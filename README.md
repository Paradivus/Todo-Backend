<div align="center">
  
# ⚡ Todo-Backend API

This backend provides a complete REST API for a to-do list application, including user authentication, project management, and task tracking.

</div>

<br />

## 🏗️ Tech Stack

<div align="center">
  <table>
    <tr>
      <td align="center" width="160">
        <br/>
        <b>Node.js</b> 🟢<br/>
        <sub>Runtime</sub>
        <br/><br/>
      </td>
      <td align="center" width="160">
        <br/>
        <b>Express</b> ⚡<br/>
        <sub>Framework</sub>
        <br/><br/>
      </td>
      <td align="center" width="160">
        <br/>
        <b>MySQL 8.0</b> 🔵<br/>
        <sub>Database</sub>
        <br/><br/>
      </td>
      <td align="center" width="160">
        <br/>
        <b>TypeScript</b> 🟡<br/>
        <sub>Language</sub>
        <br/><br/>
      </td>
      <td align="center" width="160">
        <br/>
        <b>Zod</b> 🛡️<br/>
        <sub>Validation</sub>
        <br/><br/>
      </td>
    </tr>
  </table>
</div>

<br />

## 🔒 Authentication Flow

1. **Register** &nbsp; `POST /auth/register`
   <br/>Create an account to generate your user ID.

2. **Login** &nbsp; `POST /auth/login`
   <br/>Authenticate to receive a JWT-like token.

3. **Authorized Requests**
   <br/>Include the token in the `Authorization` header for all other requests.
   ```http
   Authorization: Bearer auth_token_...
   ```

<br />

## 🗄️ Database Strategy

We use a **Code-First** approach. The application enforces the schema on startup using `CREATE TABLE IF NOT EXISTS` inside `src/db/init.ts`.

```typescript
const initDb = async (conn) => {
  // 1. Users Table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL
    )
  `);
  
  // 2. Projects & Tasks Tables (Foreign Keys enforced)
};
```

<br />

## ⚡ API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** 🟢 | `/auth/register` | Register new user |
| **POST** 🟢 | `/auth/login` | Get JWT token |
| **GET** 🔵 | `/projects` | List my projects |
| **POST** 🟢 | `/projects` | Create project |
| **DELETE** 🔴 | `/projects/:id` | Delete project |
| **GET** 🔵 | `/projects/:id/tasks` | List tasks in project |
| **POST** 🟢 | `/projects/:id/tasks` | Add task |
| **PATCH** 🟡 | `/tasks/:id` | Update status/title |
| **DELETE** 🔴 | `/tasks/:id` | Delete task |

<br />

## ⌨️ Running Locally

<table>
<tr>
<td width="50%">

### 1. Start Database
```bash
docker-compose up -d
```

</td>
<td width="50%">

### 2. Start Server
```bash
npm start
```

</td>
</tr>
</table>

<br />

## 💻 Testing with curl

**1. Register**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"me@test.com","password":"123"}'
```

**2. Login**
```bash
curl -X POST http://localhost:3000/auth/login ...
```