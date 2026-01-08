import { useEffect, useState } from 'react';
import { Plus, Search, ShoppingCart, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import Table from '../components/Table';
import Card from '../components/Card';
import { salesApi } from '../api/salesApi';
import { productApi } from '../api/productApi';
import { authApi } from '../api/authApi';
import { formatPrice, formatDate } from '../utils/helpers';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [formData, setFormData] = useState({
    product_id: '',
    user_id: '',
    quantity: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [stats, setStats] = useState({
    totalSales: 0,
    todaySales: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSales(sales);
    } else {
      const filtered = sales.filter(
        (sale) =>
          sale.product_nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.user_nom?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSales(filtered);
    }
  }, [searchTerm, sales]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salesData, productsData, usersData, revenueData] = await Promise.all([
        salesApi.getAllSales(),
        productApi.getAllProducts(),
        authApi.getUsers(),
        salesApi.getTotalAmount(),
      ]);

      setSales(salesData);
      setFilteredSales(salesData);
      setProducts(productsData);
      setUsers(usersData);

      const today = new Date().toISOString().split('T')[0];
      const todaySalesData = salesData.filter((sale) =>
        sale.date.startsWith(today)
      );

      setStats({
        totalSales: salesData.length,
        todaySales: todaySalesData.length,
        totalRevenue: revenueData.total_amount || 0,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (sale = null) => {
    if (sale) {
      setEditingSale(sale);
      setFormData({
        product_id: sale.product_id,
        user_id: sale.user_id,
        quantity: sale.quantity,
      });
    } else {
      setEditingSale(null);
      setFormData({
        product_id: '',
        user_id: '',
        quantity: '',
      });
    }
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSale(null);
    setFormData({
      product_id: '',
      user_id: '',
      quantity: '',
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const saleData = {
        product_id: parseInt(formData.product_id),
        user_id: parseInt(formData.user_id),
        quantity: parseInt(formData.quantity),
      };

      if (editingSale) {
        await salesApi.updateSale(editingSale.id, saleData);
        setSuccess('Vente modifiée avec succès !');
      } else {
        await salesApi.createSale(saleData);
        setSuccess('Vente créée avec succès !');
      }

      setTimeout(() => {
        handleCloseModal();
        fetchData();
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.detail || 'Erreur lors de la sauvegarde de la vente'
      );
    }
  };

  const handleDelete = async (sale) => {
    if (
      window.confirm(
        `Êtes-vous sûr de vouloir supprimer cette vente ? Le stock sera restauré.`
      )
    ) {
      try {
        await salesApi.deleteSale(sale.id);
        setSuccess('Vente supprimée avec succès !');
        fetchData();
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Erreur lors de la suppression de la vente');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => (
        <span className="font-mono text-sm text-gray-500">#{value}</span>
      ),
    },
    {
      key: 'product_nom',
      label: 'Produit',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-800">{value}</span>
        </div>
      ),
    },
    {
      key: 'user_nom',
      label: 'Vendeur',
      render: (value) => (
        <span className="text-gray-700">{value}</span>
      ),
    },
    {
      key: 'quantity',
      label: 'Quantité',
      render: (value) => (
        <span className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm font-semibold border border-blue-200">
          {value} unité{value > 1 ? 's' : ''}
        </span>
      ),
    },
    {
      key: 'prix_unitaire',
      label: 'Prix unitaire',
      render: (value) => (
        <span className="text-gray-600 font-medium">{formatPrice(value)}</span>
      ),
    },
    {
      key: 'prix_total',
      label: 'Total',
      render: (value) => (
        <span className="font-bold text-green-600 text-lg">{formatPrice(value)}</span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (value) => (
        <span className="text-gray-500 text-sm">{formatDate(value)}</span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl font-medium">Chargement des ventes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8 fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
              Gestion des Ventes
            </h1>
            <p className="text-gray-600 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Suivez et gérez toutes vos transactions</span>
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-premium p-6 hover-lift fade-in border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total des ventes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSales}</p>
                <p className="text-xs text-gray-500 mt-2">Toutes les transactions</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-premium p-6 hover-lift fade-in border border-gray-100" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Ventes aujourd'hui</p>
                <p className="text-3xl font-bold text-gray-900">{stats.todaySales}</p>
                <p className="text-xs text-gray-500 mt-2">Transactions du jour</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-premium-lg p-6 hover-lift fade-in text-white" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">Chiffre d'affaires</p>
                <p className="text-3xl font-bold">{formatPrice(stats.totalRevenue)}</p>
                <p className="text-xs text-orange-100 mt-2">Revenus totaux générés</p>
              </div>
            </div>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 text-green-800 px-6 py-4 rounded-xl mb-6 fade-in shadow-lg">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
                <div>
                  <p className="font-semibold">{success}</p>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 text-red-800 px-6 py-4 rounded-xl mb-6 fade-in shadow-lg">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 mr-3 text-red-600" />
                <div>
                  <p className="font-semibold">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="bg-white rounded-2xl shadow-premium p-6 mb-8 fade-in border border-gray-100">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher une vente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                />
              </div>

              <button
                onClick={() => handleOpenModal()}
                className="w-full lg:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl hover-lift font-semibold"
              >
                <Plus className="w-5 h-5" />
                <span>Nouvelle vente</span>
              </button>
            </div>
          </div>

          {/* Sales Table/Empty State */}
          {filteredSales.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-premium p-16 text-center fade-in">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {searchTerm ? 'Aucune vente trouvée' : 'Aucune vente disponible'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? 'Essayez une autre recherche'
                  : 'Commencez par enregistrer votre première vente'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => handleOpenModal()}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  <span>Créer une vente</span>
                </button>
              )}
            </div>
          ) : (
            <Table
              columns={columns}
              data={filteredSales}
              onEdit={handleOpenModal}
              onDelete={handleDelete}
            />
          )}
        </main>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span>{editingSale ? 'Modifier la vente' : 'Nouvelle vente'}</span>
          </div>
        }
      >
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-3" />
              {error}
            </div>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-800 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-3" />
              {success}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              Produit *
            </label>
            <select
              value={formData.product_id}
              onChange={(e) =>
                setFormData({ ...formData, product_id: e.target.value })
              }
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            >
              <option value="">Sélectionnez un produit</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.nom} - Stock: {product.stock} - {formatPrice(product.prix)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              Vendeur *
            </label>
            <select
              value={formData.user_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: e.target.value })
              }
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            >
              <option value="">Sélectionnez un vendeur</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nom} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              Quantité *
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Ex: 2"
              required
            />
          </div>

          {formData.product_id && formData.quantity && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-5 rounded-xl">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                Récapitulatif
              </h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Produit:</span>{' '}
                  {products.find((p) => p.id === parseInt(formData.product_id))?.nom}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Prix unitaire:</span>{' '}
                  {formatPrice(
                    products.find((p) => p.id === parseInt(formData.product_id))
                      ?.prix || 0
                  )}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Quantité:</span> {formData.quantity} unité{formData.quantity > 1 ? 's' : ''}
                </p>
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <p className="text-lg font-bold text-gray-800">
                    <span className="font-medium">Total:</span>{' '}
                    <span className="text-green-600">
                      {formatPrice(
                        (products.find((p) => p.id === parseInt(formData.product_id))
                          ?.prix || 0) * parseInt(formData.quantity || 0)
                      )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              {editingSale ? '✓ Modifier' : '+ Créer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Sales;