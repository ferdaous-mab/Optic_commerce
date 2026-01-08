import { useEffect, useState } from 'react';
import { Search, Users as UsersIcon, Mail, ShoppingCart, ArrowUpRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { authApi } from '../api/authApi';
import { salesApi } from '../api/salesApi';
import { formatDate } from '../utils/helpers';
import './dashboard.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userSales, setUserSales] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, allSales] = await Promise.all([
        authApi.getUsers(),
        salesApi.getAllSales(),
      ]);

      setUsers(usersData);
      setFilteredUsers(usersData);

      // Compter les ventes par utilisateur
      const salesCount = {};
      allSales.forEach((sale) => {
        salesCount[sale.user_id] = (salesCount[sale.user_id] || 0) + 1;
      });
      setUserSales(salesCount);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const getAvatarColor = (index) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
      'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
      'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)',
      'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="animated-bg">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          <div className="loader" style={{ width: '60px', height: '60px', borderWidth: '4px', margin: '0 auto 20px' }}></div>
          <p style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      <div className="dashboard-grid"></div>

      <Navbar />
      
      <div className="dashboard-layout">
        <Sidebar />
        
        <main className="dashboard-main">
          {/* Header */}
          <div className="login-card" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(237, 137, 54, 0.4)' }}>
                <UsersIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a202c', marginBottom: '4px', background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Utilisateurs
                </h1>
                <p style={{ color: '#718096', fontSize: '14px' }}>Consultez la liste de tous les utilisateurs</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <div className="login-card hover-lift">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(159, 122, 234, 0.4)' }}>
                  <UsersIcon className="w-6 h-6 text-white" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#48bb78', fontSize: '14px', fontWeight: '600' }}>
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+12%</span>
                </div>
              </div>
              <p style={{ color: '#718096', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Total utilisateurs</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1a202c' }}>{users.length}</p>
              <p style={{ fontSize: '12px', color: '#a0aec0', marginTop: '8px' }}>Utilisateurs enregistrés</p>
            </div>

            <div className="login-card hover-lift">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(72, 187, 120, 0.4)' }}>
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#48bb78', fontSize: '14px', fontWeight: '600' }}>
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+8%</span>
                </div>
              </div>
              <p style={{ color: '#718096', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Utilisateurs actifs</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1a202c' }}>{Object.keys(userSales).length}</p>
              <p style={{ fontSize: '12px', color: '#a0aec0', marginTop: '8px' }}>Avec au moins une vente</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '24px' }}>
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Search Bar */}
          <div className="login-card" style={{ marginBottom: '32px' }}>
            <div style={{ position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', width: '20px', height: '20px' }} />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '48px' }}
              />
            </div>
          </div>

          {/* Users Grid */}
          {filteredUsers.length === 0 ? (
            <div className="login-card" style={{ textAlign: 'center', padding: '64px 32px' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(237, 137, 54, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <UsersIcon className="w-10 h-10" style={{ color: '#ed8936' }} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
                {searchTerm ? 'Aucun utilisateur trouvé' : 'Aucun utilisateur disponible'}
              </h3>
              <p style={{ color: '#718096' }}>
                {searchTerm ? 'Essayez une autre recherche' : 'Les utilisateurs apparaîtront ici'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {filteredUsers.map((user, index) => (
                <div key={user.id} className="login-card hover-lift" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ width: '64px', height: '64px', background: getAvatarColor(index), borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '28px', fontWeight: '700', boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)' }}>
                      {user.nom.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '4px' }}>{user.nom}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#718096', fontSize: '14px' }}>
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ padding: '12px', background: 'rgba(102, 126, 234, 0.05)', borderRadius: '10px' }}>
                      <p style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>ID Utilisateur</p>
                      <p style={{ fontSize: '16px', fontWeight: '700', color: '#2d3748' }}>#{user.id}</p>
                    </div>
                    <div style={{ padding: '12px', background: 'rgba(72, 187, 120, 0.05)', borderRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <ShoppingCart className="w-4 h-4" style={{ color: '#48bb78' }} />
                        <p style={{ fontSize: '12px', color: '#718096' }}>Ventes</p>
                      </div>
                      <p style={{ fontSize: '20px', fontWeight: '700', color: '#48bb78' }}>
                        {userSales[user.id] || 0}
                      </p>
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', padding: '12px', background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(159, 122, 234, 0.05))', borderRadius: '10px', border: '1px solid rgba(102, 126, 234, 0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', color: '#4a5568', fontWeight: '600' }}>Statut</span>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: userSales[user.id] > 0 ? 'rgba(72, 187, 120, 0.1)' : 'rgba(160, 174, 192, 0.1)', color: userSales[user.id] > 0 ? '#48bb78' : '#718096' }}>
                        {userSales[user.id] > 0 ? '✓ Actif' : '○ Inactif'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Users;