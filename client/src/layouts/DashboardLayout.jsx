import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Printer, 
  Search,
  Settings,
  LogOut,
  LayoutDashboard,
  FileText,
  User
} from 'lucide-react';

export default function DashboardLayout({ isAdmin = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (isAdmin) {
    return (
      <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between">
          <div>
            <div className="h-16 flex items-center px-6">
              <span className="text-blue-600 font-bold text-xl tracking-tight">Printopia</span>
            </div>
            
            <div className="px-6 py-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
                  <Printer className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Admin Panel</h3>
                  <p className="text-xs text-slate-500">Manage Print Jobs</p>
                </div>
              </div>

              <nav className="space-y-1">
                <Link to="/admin" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/admin' || location.pathname.startsWith('/admin/orders') ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <FileText className="w-4 h-4" />
                  Orders
                </Link>
                <Link to="/admin/settings" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/admin/settings' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <Settings className="w-4 h-4" />
                  Settings
                </Link>
              </nav>
            </div>
          </div>
          
          <div className="p-6 border-t border-slate-100">
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium text-sm transition-colors w-full">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Admin Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
            <div className="relative w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Cari ID Pesanan..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden">
                <User className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-8">
            <Outlet />
          </div>
        </main>
      </div>
    );
  }

  // Mahasiswa Top Nav
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/dashboard" className="text-blue-600 font-bold text-xl tracking-tight w-32">
            Printopia
          </Link>
          
          <nav className="hidden md:flex items-center h-full gap-8">
            <Link 
              to="/dashboard" 
              className={`h-full flex items-center text-sm font-semibold border-b-2 transition-colors ${location.pathname === '/dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/dashboard/new" 
              className={`h-full flex items-center text-sm font-semibold border-b-2 transition-colors ${location.pathname === '/dashboard/new' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}
            >
              New Order
            </Link>
          </nav>

          <div className="flex items-center gap-4 justify-end w-32">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer" onClick={handleLogout} title="Click to logout">
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <span className="hidden sm:inline">{user?.name || 'Mahasiswa'}</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
