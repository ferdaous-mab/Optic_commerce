import { Home, Package, ShoppingCart, Users, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: '/dashboard',
      gradient: 'from-blue-500 to-blue-600',
    },
    { 
      icon: Package, 
      label: 'Produits', 
      path: '/products',
      gradient: 'from-purple-500 to-purple-600',
    },
    { 
      icon: ShoppingCart, 
      label: 'Ventes', 
      path: '/sales',
      gradient: 'from-green-500 to-green-600',
    },
    { 
      icon: Users, 
      label: 'Utilisateurs', 
      path: '/users',
      gradient: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <aside className="sidebar-modern">
      <nav className="sidebar-nav">
        {/* Menu Title */}
        <div className="sidebar-header">
          <h3 className="sidebar-title">Navigation</h3>
        </div>

        {/* Menu Items */}
        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-menu-item ${isActive ? 'active' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="sidebar-item-content">
                    <div className={`sidebar-item-icon ${isActive ? 'active' : ''}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="sidebar-item-label">{item.label}</span>
                  </div>
                  <ChevronRight className={`sidebar-item-arrow ${isActive ? 'active' : ''}`} />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Stats Section */}
        <div className="sidebar-footer">
          <div className="sidebar-pro-card">
            <div className="sidebar-pro-content">
              <div className="sidebar-pro-icon">✨</div>
              <div>
                <p className="sidebar-pro-title">Version Pro</p>
                <p className="sidebar-pro-subtitle">Toutes les fonctionnalités</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;