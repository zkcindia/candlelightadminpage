import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Creating folder structure...\n');

// Your folder structure
const structure = {
  'src': {
    'api': ['api.js'],
    'components': {
      'common': ['Sidebar.jsx', 'Header.jsx', 'StatsCard.jsx', 'DataTable.jsx', 'StatusBadge.jsx'],
      'auth': ['Login.jsx', 'ProtectedRoute.jsx'],
      'student': ['StudentDashboard.jsx', 'StudentList.jsx', 'StudentDetails.jsx', 'StudentStats.jsx'],
      'teacher': ['TeacherDashboard.jsx', 'TeacherList.jsx', 'TeacherDetails.jsx', 'TeacherStats.jsx'],
      'agent': ['AgentDashboard.jsx', 'AgentList.jsx', 'AgentDetails.jsx', 'AgentStats.jsx']
    },
    'pages': ['Dashboard.jsx', 'Students.jsx', 'Teachers.jsx', 'Agents.jsx', 'Questions.jsx', 'Earnings.jsx', 'Logs.jsx'],
    'context': ['AuthContext.jsx'],
    'hooks': ['useAuth.js'],
    'utils': ['constants.js', 'helpers.js']
  }
};

// Function to create structure
function createStructure(basePath, structure, parentPath = '') {
  for (const [folder, content] of Object.entries(structure)) {
    const folderPath = path.join(basePath, folder);
    const relativePath = parentPath ? `${parentPath}/${folder}` : folder;
    
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`📁 Created: ${relativePath}/`);
    }

    if (Array.isArray(content)) {
      content.forEach(file => {
        const filePath = path.join(folderPath, file);
        if (!fs.existsSync(filePath)) {
          const fileContent = getFileContent(file, folder);
          fs.writeFileSync(filePath, fileContent);
          console.log(`📄 Created: ${relativePath}/${file}`);
        }
      });
    } else if (typeof content === 'object') {
      createStructure(folderPath, content, relativePath);
    }
  }
}

// Get content for each file
function getFileContent(filename, folder) {
  const templates = {
    'api.js': `import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) config.headers.Authorization = 'Bearer ' + token;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
`,
    
    'Login.jsx': `import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login({ email, password });
    setLoading(false);
    if (success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-bold text-gray-900">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Email address"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Password"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
`,
    
    'ProtectedRoute.jsx': `import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}
`,
    
    'useAuth.js': `import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
`,
    
    'AuthContext.jsx': `import React, { createContext, useState, useEffect } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const logout = async () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
`,
    
    'App.jsx': `import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './context/AuthContext';
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
`,
    
    'AppRoutes.jsx': `import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Agents from './pages/Agents';
import Questions from './pages/Questions';
import Earnings from './pages/Earnings';
import Logs from './pages/Logs';
import Login from './components/auth/Login';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
              <main className="p-6">
                <Routes>
                  <Route index element={<Navigate to="/dashboard" />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="students" element={<Students />} />
                  <Route path="teachers" element={<Teachers />} />
                  <Route path="agents" element={<Agents />} />
                  <Route path="questions" element={<Questions />} />
                  <Route path="earnings" element={<Earnings />} />
                  <Route path="logs" element={<Logs />} />
                </Routes>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
`,
    
    'Sidebar.jsx': `import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  AcademicCapIcon,
  UserPlusIcon,
  QuestionMarkCircleIcon,
  CurrencyDollarIcon,
  DocumentTextIcon 
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/students', label: 'Students', icon: UserGroupIcon },
    { path: '/teachers', label: 'Teachers', icon: AcademicCapIcon },
    { path: '/agents', label: 'Agents', icon: UserPlusIcon },
    { path: '/questions', label: 'Questions', icon: QuestionMarkCircleIcon },
    { path: '/earnings', label: 'Earnings', icon: CurrencyDollarIcon },
    { path: '/logs', label: 'Activity Logs', icon: DocumentTextIcon },
  ];

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-blue-800 to-blue-900 text-white fixed left-0 top-0">
      <div className="flex items-center h-16 px-4 border-b border-blue-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center font-bold">A</div>
          <span className="ml-3 text-lg font-semibold">Admin</span>
        </div>
      </div>
      <nav className="mt-6 px-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              'flex items-center px-3 py-3 rounded-lg mb-1 transition-colors ' +
              (isActive ? 'bg-blue-700 text-white' : 'text-blue-100 hover:bg-blue-700/50 hover:text-white')
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="ml-3 text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
`,
    
    'Header.jsx': `import React from 'react';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between ml-64">
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg relative">
          <BellIcon className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">{user?.name || 'Admin'}</span>
          <button onClick={logout} className="p-2 hover:bg-gray-100 rounded-lg">
            <UserCircleIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
`,
    
    'StatsCard.jsx': `import React from 'react';

export default function StatsCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={\`\${color} p-3 rounded-lg\`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
`,
    
    'Dashboard.jsx': `import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  UsersIcon, 
  AcademicCapIcon, 
  CurrencyDollarIcon,
  QuestionMarkCircleIcon 
} from '@heroicons/react/24/outline';
import StatsCard from '../components/common/StatsCard';
import api from '../api/api';

const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => api.get('/dashboard/stats'),
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  const stats = data?.data || {};

  return (
    <div className="p-6 ml-64">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's your overview.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Students" value={stats.totalStudents || 0} icon={UsersIcon} color="bg-blue-500" />
        <StatsCard title="Total Teachers" value={stats.totalTeachers || 0} icon={AcademicCapIcon} color="bg-green-500" />
        <StatsCard title="Total Questions" value={stats.totalQuestions || 0} icon={QuestionMarkCircleIcon} color="bg-purple-500" />
        <StatsCard title="Total Earnings" value={\`\$\${stats.totalEarnings || 0}\`} icon={CurrencyDollarIcon} color="bg-yellow-500" />
      </div>
    </div>
  );
};

export default Dashboard;
`,
  };

  return templates[filename] || `// ${filename}\n`;
}

// Run the script
createStructure(process.cwd(), structure);
console.log('\n✅ Folder structure created successfully!');
console.log('\n📝 Next steps:');
console.log('1. npm run dev - Start development server');