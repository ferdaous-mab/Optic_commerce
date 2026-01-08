import { Home, Package, ShoppingCart, Users, ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: '/dashboard',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      icon: Package, 
      label: 'Produits', 
      path: '/products',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      icon: ShoppingCart, 
      label: 'Ventes', 
      path: '/sales',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      icon: Users, 
      label: 'Utilisateurs', 
      path: '/users',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
  ];

  return (
    <aside className="w-72 glass-effect shadow-premium h-[calc(100vh-5rem)] sticky top-20 slide-in">
      <nav className="p-6 space-y-3">
        {/* Menu Title */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4">
            Navigation
          </h3>
        </div>

        {/* Menu Items */}
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? `bg-gradient-to-r ${item.color} text-white shadow-lg shadow-${item.color.split('-')[1]}-500/30`
                  : `text-gray-700 hover:${item.bgColor} hover:${item.textColor} hover:shadow-md`
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    isActive 
                      ? 'bg-white/20' 
                      : `${item.bgColor} group-hover:scale-110 transition-transform`
                  }`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                }`} />
              </>
            )}
          </NavLink>
        ))}

        {/* Stats Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="px-4 py-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                ✨
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">Version Pro</p>
                <p className="text-xs text-gray-500">Toutes les fonctionnalités</p>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;