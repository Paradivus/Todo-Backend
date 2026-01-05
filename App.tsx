import React from 'react';
import { Server, Database, Code, Terminal, Layers, Box, Zap, Lock, ShieldCheck } from 'lucide-react';

const App = () => {
  return (
    <div className="min-h-screen bg-[#0d1117] text-slate-300 font-sans selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Hero Section */}
        <header className="mb-16 border-b border-slate-800 pb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <Server className="text-blue-400" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-slate-100 tracking-tight">Todo-Backend API</h1>
          </div>
          <p className="text-xl text-slate-400 max-w-3xl leading-relaxed">
            This backend provides a complete REST API for a to-do list application, including user authentication, project management, and task tracking.
          </p>
        </header>

        <div className="space-y-16">
          
          {/* Tech Stack */}
          <section>
            <SectionHeader icon={<Layers className="text-purple-400" />} title="Tech Stack" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <TechCard icon={<Box className="text-green-400" />} title="Node.js" subtitle="Runtime" />
              <TechCard icon={<Zap className="text-slate-200" />} title="Express" subtitle="Framework" />
              <TechCard icon={<Database className="text-blue-400" />} title="MySQL 8.0" subtitle="Database" />
              <TechCard icon={<Code className="text-yellow-400" />} title="TypeScript" subtitle="Language" />
              <TechCard icon={<ShieldCheck className="text-red-400" />} title="Zod" subtitle="Validation" />
            </div>
          </section>

          {/* Auth Flow */}
           <section>
            <SectionHeader icon={<Lock className="text-orange-400" />} title="Authentication Flow" />
            <div className="bg-[#161b22] border border-slate-800 rounded-lg p-6">
              <ol className="relative border-l border-slate-700 ml-3 space-y-8">
                <li className="mb-4 ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-[#0d1117] rounded-full -left-4 border border-slate-600 ring-4 ring-[#161b22]">
                    1
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-slate-100">Register</h3>
                  <p className="mb-2 text-base font-normal text-slate-400">Create an account to generate your user ID.</p>
                  <code className="text-sm bg-[#0d1117] px-2 py-1 rounded text-green-400 border border-slate-800 font-mono">POST /auth/register</code>
                </li>
                <li className="mb-4 ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-[#0d1117] rounded-full -left-4 border border-slate-600 ring-4 ring-[#161b22]">
                    2
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-slate-100">Login</h3>
                  <p className="mb-2 text-base font-normal text-slate-400">Authenticate to receive a JWT-like token.</p>
                  <code className="text-sm bg-[#0d1117] px-2 py-1 rounded text-blue-400 border border-slate-800 font-mono">POST /auth/login</code>
                </li>
                 <li className="ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-[#0d1117] rounded-full -left-4 border border-slate-600 ring-4 ring-[#161b22]">
                    3
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-slate-100">Authorized Requests</h3>
                  <p className="mb-2 text-base font-normal text-slate-400">Include the token in the Authorization header for all other requests.</p>
                  <div className="bg-[#0d1117] p-3 rounded border border-slate-800 font-mono text-sm text-slate-300 mt-2">
                    Authorization: Bearer auth_token_...
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Database Strategy */}
          <section>
            <SectionHeader icon={<Database className="text-blue-400" />} title="Database Strategy" />
            <p className="text-slate-400 mb-6 leading-relaxed">
              We use a <strong>Code-First</strong> approach. The application enforces the schema on startup using <code className="text-blue-300 bg-blue-900/30 px-1.5 py-0.5 rounded text-sm">CREATE TABLE IF NOT EXISTS</code> inside <span className="text-slate-200 font-mono">src/db/init.ts</span>.
            </p>
            <div className="bg-[#161b22] border border-slate-800 rounded-lg overflow-hidden">
              <div className="bg-[#0d1117] px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">src/db/init.ts</span>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
              </div>
              <pre className="p-4 overflow-x-auto text-sm font-mono text-slate-300 leading-relaxed">
{`const initDb = async (conn) => {
  // 1. Users Table
  await conn.query(\`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL
    )
  \`);
  
  // 2. Projects & Tasks Tables (Foreign Keys enforced)
};`}
              </pre>
            </div>
          </section>

          {/* API Endpoints */}
          <section>
            <SectionHeader icon={<Server className="text-green-400" />} title="API Endpoints" />
            <div className="border border-slate-800 rounded-lg overflow-hidden bg-[#161b22]">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#21262d] text-slate-200 font-semibold border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 w-32">Method</th>
                    <th className="px-6 py-4">Endpoint</th>
                    <th className="px-6 py-4">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <EndpointRow method="POST" path="/auth/register" desc="Register new user" />
                  <EndpointRow method="POST" path="/auth/login" desc="Get JWT token" />
                  <EndpointRow method="GET" path="/projects" desc="List my projects" />
                  <EndpointRow method="POST" path="/projects" desc="Create project" />
                  <EndpointRow method="DELETE" path="/projects/:id" desc="Delete project" />
                  <EndpointRow method="GET" path="/projects/:id/tasks" desc="List tasks in project" />
                  <EndpointRow method="POST" path="/projects/:id/tasks" desc="Add task" />
                  <EndpointRow method="PATCH" path="/tasks/:id" desc="Update status/title" />
                  <EndpointRow method="DELETE" path="/tasks/:id" desc="Delete task" />
                </tbody>
              </table>
            </div>
          </section>

          {/* Running & Testing */}
          <div className="grid md:grid-cols-2 gap-8">
            <section>
              <SectionHeader icon={<Terminal className="text-pink-400" />} title="Running Locally" />
              <div className="space-y-4">
                <div className="bg-[#161b22] border border-slate-800 p-4 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">Start Database</p>
                  <div className="flex justify-between items-center">
                    <code className="text-green-400 font-mono text-sm">docker-compose up -d</code>
                  </div>
                </div>
                <div className="bg-[#161b22] border border-slate-800 p-4 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">Start Server</p>
                  <code className="text-green-400 font-mono text-sm">npm start</code>
                </div>
              </div>
            </section>

            <section>
              <SectionHeader icon={<Code className="text-blue-400" />} title="Testing with curl" />
              <div className="bg-[#161b22] border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
                <div className="text-slate-500 mb-2"># 1. Register</div>
                <div className="text-purple-400 mb-4">
                  curl -X POST http://localhost:3000/auth/register \<br/>
                  &nbsp;&nbsp;-H <span className="text-orange-300">"Content-Type: application/json"</span> \<br/>
                  &nbsp;&nbsp;-d <span className="text-orange-300">'{"{"}"email":"me@test.com","password":"123"{"}"}'</span>
                </div>
                
                <div className="text-slate-500 mb-2"># 2. Login & Save Token</div>
                <div className="text-purple-400">
                  curl -X POST http://localhost:3000/auth/login ...
                </div>
              </div>
            </section>
          </div>

        </div>
        
        <footer className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Todo-Backend API. Built with Express & MySQL.</p>
        </footer>
      </div>
    </div>
  );
};

// Helper Components

const SectionHeader = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
  <h2 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
    <div className="p-1.5 bg-[#161b22] rounded-lg border border-slate-800">
      {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
    </div>
    {title}
  </h2>
);

const TechCard = ({ icon, title, subtitle }: { icon: React.ReactNode, title: string, subtitle: string }) => (
  <div className="bg-[#161b22] border border-slate-800 p-4 rounded-lg flex items-center gap-3 hover:border-slate-600 transition-colors">
    <div className="p-2 bg-[#0d1117] rounded-md border border-slate-800">
      {icon}
    </div>
    <div>
      <div className="font-bold text-slate-200">{title}</div>
      <div className="text-xs text-slate-500 uppercase tracking-wider">{subtitle}</div>
    </div>
  </div>
);

const EndpointRow = ({ method, path, desc }: { method: string, path: string, desc: string }) => {
  const methodColor = 
    method === 'GET' ? 'text-blue-400 bg-blue-400/10' :
    method === 'POST' ? 'text-green-400 bg-green-400/10' :
    method === 'DELETE' ? 'text-red-400 bg-red-400/10' :
    'text-yellow-400 bg-yellow-400/10';

  return (
    <tr className="hover:bg-[#21262d] transition-colors">
      <td className="px-6 py-4 font-mono text-xs font-bold w-32">
        <span className={`px-2 py-1 rounded ${methodColor}`}>{method}</span>
      </td>
      <td className="px-6 py-4 font-mono text-slate-300">{path}</td>
      <td className="px-6 py-4 text-slate-400">{desc}</td>
    </tr>
  );
};

export default App;