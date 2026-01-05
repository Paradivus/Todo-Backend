import express from 'express';
import { z } from 'zod';
import { db } from './db';

// --- CONFIGURATION ---
const PORT = process.env.PORT || 3000;
const app = express();

// --- MIDDLEWARE ---
app.use(express.json() as any);

// --- HELPER: CENTRALIZED ERROR HANDLING ---
const handleApiError = (res: any, error: any) => {
  console.error('API Error:', error); // Keep server logs for debugging

  // 1. Zod Validation Errors
  if (error instanceof z.ZodError) {
    const errorMessages = error.issues.map(issue => {
      // Create a readable string: "email: Invalid email address"
      const path = issue.path.join('.');
      return `${path}: ${issue.message}`;
    });
    
    res.status(400).json({ 
      error: 'Validation Failed', 
      details: errorMessages 
    });
    return;
  }

  // 2. MySQL / Database Errors
  if (error.code) {
    switch (error.code) {
      case 'ER_DUP_ENTRY':
        res.status(409).json({ 
          error: 'Conflict', 
          message: 'This record already exists (e.g., email already registered).' 
        });
        return;
      case 'ER_NO_REFERENCED_ROW':
      case 'ER_NO_REFERENCED_ROW_2':
        res.status(400).json({ 
          error: 'Invalid Reference', 
          message: 'Operation failed because a referenced resource (User or Project) does not exist.' 
        });
        return;
      case 'ER_DATA_TOO_LONG':
        res.status(400).json({
          error: 'Bad Request',
          message: 'Input data is too long for one or more fields.'
        });
        return;
    }
  }

  // 3. Generic Server Errors
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: 'An unexpected error occurred. Please try again later.' 
  });
};

// --- VALIDATION SCHEMAS (With Custom Messages) ---
const AuthSchema = z.object({
  email: z.string().email({ message: "Invalid email address format" }),
  password: z.string().min(3, { message: "Password must be at least 3 characters long" })
});

const ProjectSchema = z.object({
  name: z.string().min(1, { message: "Project name cannot be empty" })
});

const TaskSchema = z.object({
  title: z.string().min(1, { message: "Task title cannot be empty" })
});

const UpdateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  status: z.enum(['todo', 'in_progress', 'done'], { 
    errorMap: () => ({ message: "Status must be 'todo', 'in_progress', or 'done'" }) 
  }).optional()
});

// --- AUTH MIDDLEWARE ---
const requireAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
      res.status(401).json({ error: 'Unauthorized', message: 'No token provided' });
      return;
  }
  
  const token = authHeader.replace('Bearer ', '');
  const parts = token.split('_');
  
  // Format: auth_token_{userId}_{timestamp}
  if (parts.length < 3 || parts[0] !== 'auth' || parts[1] !== 'token') {
      res.status(401).json({ error: 'Unauthorized', message: 'Invalid or malformed token' });
      return;
  }
  
  req.userId = parseInt(parts[2]);
  next();
};

// --- ROUTES ---

// Auth
app.post('/auth/register', async (req: any, res: any) => {
  try {
    const { email, password } = AuthSchema.parse(req.body);

    // Optimized: We rely on the DB 'UNIQUE' constraint on email to catch duplicates
    // This reduces the request to a single DB round-trip.
    const passwordHash = `hashed_${password}`;
    
    const result: any = await db.query(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)', 
      [email, passwordHash]
    );
    
    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: result.insertId 
    });
  } catch (e: any) {
    handleApiError(res, e);
  }
});

app.post('/auth/login', async (req: any, res: any) => {
  try {
    const { email, password } = AuthSchema.parse(req.body);
    
    const rows: any = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    // Generic error message for security (don't reveal if email exists)
    if (!user || user.password_hash !== `hashed_${password}`) {
        res.status(401).json({ error: 'Authentication Failed', message: 'Invalid email or password' });
        return;
    }

    const token = `auth_token_${user.id}_${Date.now()}`;
    res.json({ token, message: 'Login successful' });
  } catch (e: any) {
    handleApiError(res, e);
  }
});

// Projects
app.get('/projects', requireAuth, async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const projects = await db.query('SELECT * FROM projects WHERE user_id = ?', [userId]);
    res.json(projects);
  } catch (e: any) {
    handleApiError(res, e);
  }
});

app.post('/projects', requireAuth, async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const { name } = ProjectSchema.parse(req.body);

    const result: any = await db.query('INSERT INTO projects (user_id, name) VALUES (?, ?)', [userId, name]);
    const newProject: any = await db.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    res.status(201).json(newProject[0]);
  } catch (e: any) {
    handleApiError(res, e);
  }
});

app.delete('/projects/:id', requireAuth, async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const projectId = req.params.id;

    const result: any = await db.query('DELETE FROM projects WHERE id = ? AND user_id = ?', [projectId, userId]);
    
    if (result.affectedRows === 0) {
       res.status(404).json({ error: 'Not Found', message: 'Project not found or you do not have permission to delete it.' });
       return;
    }
    
    res.json({ message: 'Project deleted successfully' });
  } catch (e: any) {
    handleApiError(res, e);
  }
});

// Tasks
app.get('/projects/:id/tasks', requireAuth, async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const projectId = req.params.id;

    // Security check: Ensure project belongs to user
    const projects: any = await db.query('SELECT id FROM projects WHERE id = ? AND user_id = ?', [projectId, userId]);
    if (projects.length === 0) {
        res.status(403).json({ error: 'Access Denied', message: 'You do not have access to this project.' });
        return;
    }

    const tasks = await db.query('SELECT * FROM tasks WHERE project_id = ?', [projectId]);
    res.json(tasks);
  } catch (e: any) {
    handleApiError(res, e);
  }
});

app.post('/projects/:id/tasks', requireAuth, async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const projectId = req.params.id;
    const { title } = TaskSchema.parse(req.body);

    // Security check: Ensure project belongs to user
    const projects: any = await db.query('SELECT id FROM projects WHERE id = ? AND user_id = ?', [projectId, userId]);
    if (projects.length === 0) {
        res.status(403).json({ error: 'Access Denied', message: 'You cannot add tasks to a project you do not own.' });
        return;
    }

    const result: any = await db.query('INSERT INTO tasks (project_id, title) VALUES (?, ?)', [projectId, title]);
    const newTask: any = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(newTask[0]);
  } catch (e: any) {
    handleApiError(res, e);
  }
});

app.patch('/tasks/:id', requireAuth, async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;
    const { title, status } = UpdateTaskSchema.parse(req.body);

    // Complex Join Check: Ensure task belongs to a project that belongs to the user
    const taskCheck: any = await db.query(`
        SELECT t.id 
        FROM tasks t 
        JOIN projects p ON t.project_id = p.id 
        WHERE t.id = ? AND p.user_id = ?
    `, [taskId, userId]);

    if (taskCheck.length === 0) {
        res.status(404).json({ error: 'Not Found', message: 'Task not found or access denied.' });
        return;
    }

    const updates = [];
    const params = [];
    if (title) { updates.push('title = ?'); params.push(title); }
    if (status) { updates.push('status = ?'); params.push(status); }
    
    if (updates.length > 0) {
        params.push(taskId);
        await db.query(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`, params);
    }

    const updated: any = await db.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    res.json(updated[0]);
  } catch (e: any) {
    handleApiError(res, e);
  }
});

app.delete('/tasks/:id', requireAuth, async (req: any, res: any) => {
  try {
    const userId = req.userId;
    const taskId = req.params.id;

    // Complex Join Check: Ensure task belongs to a project that belongs to the user
    const taskCheck: any = await db.query(`
        SELECT t.id 
        FROM tasks t 
        JOIN projects p ON t.project_id = p.id 
        WHERE t.id = ? AND p.user_id = ?
    `, [taskId, userId]);

    if (taskCheck.length === 0) {
        res.status(404).json({ error: 'Not Found', message: 'Task not found or access denied.' });
        return;
    }

    await db.query('DELETE FROM tasks WHERE id = ?', [taskId]);
    res.json({ message: 'Task deleted successfully' });
  } catch (e: any) {
    handleApiError(res, e);
  }
});

// --- SERVER STARTUP ---
const start = async () => {
  try {
    console.log('Connecting to database...');
    await db.init();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (e) {
    console.error('Failed to start server:', e);
    process.exit(1);
  }
};

start();