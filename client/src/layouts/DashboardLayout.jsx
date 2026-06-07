import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Printer, 
  Search,
  Settings,
  LogOut,
  LayoutDashboard,
  FileText,
  User,
  Menu,
  X
} from 'lucide-react';

export default function DashboardLayout({ isAdmin = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  if (isAdmin) {
    return (
      <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden relative">
        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/50 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Admin Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
          <div>
            <div className="h-16 flex items-center justify-between px-6">
              <span className="text-blue-600 font-bold text-xl tracking-tight">Printopia</span>
              <button className="md:hidden text-slate-500" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="px-6 py-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shrink-0">
                  <Printer className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm truncate">Admin Panel</h3>
                  <p className="text-xs text-slate-500 truncate">Manage Print Jobs</p>
                </div>
              </div>

              <nav className="space-y-1">
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/admin' || location.pathname.startsWith('/admin/orders') ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
                  <FileText className="w-4 h-4" />
                  Orders
                </Link>
                <Link to="/admin/settings" onClick={() => setMobileMenuOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/admin/settings' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}>
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
        <main className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
          <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between shrink-0 gap-4">
            <div className="flex items-center gap-3">
              <button className="md:hidden text-slate-500 hover:text-slate-700" onClick={toggleMobileMenu}>
                <Menu className="w-6 h-6" />
              </button>
              <div className="relative hidden sm:block w-48 md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Cari ID Pesanan..." 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-colors"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden">
                <User className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-4 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    );
  }

  // Mahasiswa Top Nav
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link to="/dashboard" className="text-blue-600 font-bold text-xl tracking-tight">
              Printopia
            </Link>
          </div>
          
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

          <div className="flex items-center gap-4 justify-end">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer" onClick={handleLogout} title="Click to logout">
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <span className="hidden sm:inline">{user?.name || 'Mahasiswa'}</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 absolute w-full left-0 shadow-lg">
            <nav className="flex flex-col py-2">
              <Link 
                to="/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm font-medium ${location.pathname === '/dashboard' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/dashboard/new" 
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm font-medium ${location.pathname === '/dashboard/new' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'}`}
              >
                New Order
              </Link>
            </nav>
          </div>
        )}
      </header>
      
      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
