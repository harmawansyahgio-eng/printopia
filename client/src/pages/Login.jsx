import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 selection:bg-zinc-200">
      <Link to="/" className="mb-8 flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl shadow-md hover:scale-105 transition-transform">
        <Printer className="w-6 h-6 text-white" />
      </Link>
      
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h1>
          <p className="text-sm text-zinc-500 mt-1.5">Enter your credentials to access your account</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-sm text-red-600 font-medium">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email address</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-zinc-50 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-zinc-50 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-zinc-900 disabled:opacity-50 hover:bg-zinc-800 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-all shadow-sm mt-2"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-zinc-900 font-semibold hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
