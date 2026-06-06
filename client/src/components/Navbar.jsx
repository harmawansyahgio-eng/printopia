import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold tracking-wider">
          Printopia
        </Link>
        <div className="flex space-x-4 items-center">
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-white text-sm font-bold transition">
                  Admin Panel
                </Link>
              ) : (
                <Link to="/dashboard" className="hover:text-blue-200 transition">
                  Dashboard
                </Link>
              )}
              <span className="opacity-75">|</span>
              <span className="font-medium">{user.name}</span>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200 transition">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-blue-50 transition font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
