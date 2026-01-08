import { useEffect, useState } from 'react';
import { Search, Users as UsersIcon, Mail, Calendar, ShoppingCart } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Table from '../components/Table';
import Card from '../components/Card';
import { authApi } from '../api/authApi';
import { salesApi } from '../api/salesApi';
import { formatDate } from '../utils/helpers';

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

  const columns = [
    {
      key: 'id',
      label: 'ID',
    },
    {
      key: 'nom',
      label: 'Nom',
      render: (value) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-600 font-bold text-lg">
              {value.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => (
        <div className="flex items-center space-x-2 text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'id',
      label: 'Ventes',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <ShoppingCart className="w-4 h-4 text-green-600" />
          <span className="font-medium text-green-600">
            {userSales[value] || 0}
          </span>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-2xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Utilisateurs
            </h1>
            <p className="text-gray-600">
              Consultez la liste de tous les utilisateurs
            </p>
          </div>

          {/* Statistique */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card
              title="Total utilisateurs"
              value={users.length}
              icon={UsersIcon}
              color="purple"
              subtitle="Utilisateurs enregistrés"
            />
            <Card
              title="Utilisateurs actifs"
              value={Object.keys(userSales).length}
              icon={ShoppingCart}
              color="green"
              subtitle="Avec au moins une vente"
            />
          </div>

          {/* Messages d'erreur */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 fade-in">
              {error}
            </div>
          )}

          {/* Barre de recherche */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tableau des utilisateurs */}
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm
                  ? 'Aucun utilisateur trouvé'
                  : 'Aucun utilisateur disponible'}
              </p>
            </div>
          ) : (
            <Table columns={columns} data={filteredUsers} />
          )}
        </main>
      </div>
    </div>
  );
};

export default Users;