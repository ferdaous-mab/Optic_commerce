import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar-modern">
      <div className="navbar-content">
        <div className="navbar-container">
          {/* Logo Section */}
          <div className="navbar-logo-section">
            <div className="navbar-logo-icon">
              <span className="text-2xl">👓</span>
            </div>
            <div>
              <h1 className="navbar-title">
                Optic Commerce
              </h1>
              <p className="navbar-subtitle">Gestion professionnelle</p>
            </div>
          </div>

          {/* Right Section */}
          <div className="navbar-actions">
            {/* User Info */}
            <div className="navbar-user-info">
              <div className="navbar-user-avatar">
                {user?.nom?.charAt(0).toUpperCase()}
              </div>
              <div className="navbar-user-details">
                <p className="navbar-user-name">{user?.nom}</p>
                <p className="navbar-user-role">{user?.role || 'Utilisateur'}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button onClick={handleLogout} className="navbar-logout-btn">
              <LogOut className="w-4 h-4" />
              <span className="navbar-logout-text">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;