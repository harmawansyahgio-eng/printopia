import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal');
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create an account</h1>
          <p className="text-sm text-zinc-500 mt-1.5">Enter your details to get started with Printopia</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-sm text-red-600 font-medium">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Full Name</label>
            <input 
              type="text" required
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-zinc-50 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email address</label>
            <input 
              type="email" required
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-zinc-50 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Phone Number</label>
            <input 
              type="tel" required
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-zinc-50 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="081234567890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
            <input 
              type="password" required
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm bg-zinc-50 focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-blue-600 outline-none transition-all"
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-zinc-900 disabled:opacity-50 hover:bg-zinc-800 text-white font-medium text-sm py-2.5 px-4 rounded-lg transition-all shadow-sm mt-2"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link to="/login" className="text-zinc-900 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
