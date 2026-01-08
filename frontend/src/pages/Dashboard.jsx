import { useEffect, useState } from 'react';
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, AlertTriangle, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { productApi } from '../api/productApi';
import { salesApi } from '../api/salesApi';
import { authApi } from '../api/authApi';
import { formatPrice, formatDate } from '../utils/helpers';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [recentSales, setRecentSales] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, sales, users, revenue] = await Promise.all([
          productApi.getAllProducts(),
          salesApi.getAllSales(),
          authApi.getUsers(),
          salesApi.getTotalAmount(),
        ]);

        setStats({
          totalProducts: products.length,
          totalSales: sales.length,
          totalUsers: users.length,
          totalRevenue: revenue.total_amount || 0,
        });

        setRecentSales(sales.slice(0, 5));
        const lowStock = products.filter((p) => p.stock < 20);
        setLowStockProducts(lowStock);
      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Chargement du tableau de bord...</p>
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
            <div className="flex items-center justify-between mb-2">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                  Tableau de bord
                </h1>
                <p className="text-gray-600 flex items-center space-x-2">
                  <Activity className="w-4 h-4" />
                  <span>Vue d'ensemble de votre activité en temps réel</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Dernière mise à jour</p>
                <p className="text-sm font-semibold text-gray-800">
                  {new Date().toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-premium p-6 hover-lift fade-in border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+12%</span>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Produits</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
                <p className="text-xs text-gray-500 mt-2">Total des produits en stock</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-premium p-6 hover-lift fade-in border border-gray-100" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+8%</span>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Ventes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSales}</p>
                <p className="text-xs text-gray-500 mt-2">Transactions réalisées</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-premium p-6 hover-lift fade-in border border-gray-100" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-green-600 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+5%</span>
                </div>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Utilisateurs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500 mt-2">Comptes actifs</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-premium-lg p-6 hover-lift fade-in text-white" style={{animationDelay: '0.3s'}}>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center space-x-1 text-white text-sm font-medium bg-white/20 px-2 py-1 rounded-lg">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+15%</span>
                </div>
              </div>
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">Chiffre d'affaires</p>
                <p className="text-3xl font-bold">{formatPrice(stats.totalRevenue)}</p>
                <p className="text-xs text-orange-100 mt-2">Revenus totaux générés</p>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Sales */}
            <div className="bg-white rounded-2xl shadow-premium p-6 fade-in border border-gray-100" style={{animationDelay: '0.4s'}}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Ventes récentes</h2>
                </div>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  Dernières 5
                </span>
              </div>

              {recentSales.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Aucune vente récente</p>
                  <p className="text-gray-400 text-sm mt-1">Les nouvelles ventes apparaîtront ici</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSales.map((sale, index) => (
                    <div
                      key={sale.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl hover:shadow-md transition-all border border-gray-100 hover:border-green-200"
                      style={{animationDelay: `${0.5 + index * 0.1}s`}}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                          {sale.quantity}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{sale.product_nom}</p>
                          <p className="text-sm text-gray-600">
                            Par <span className="font-medium">{sale.user_nom}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(sale.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600 text-lg">
                          {formatPrice(sale.prix_total)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Low Stock */}
            <div className="bg-white rounded-2xl shadow-premium p-6 fade-in border border-gray-100" style={{animationDelay: '0.5s'}}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Stock faible</h2>
                </div>
                <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  {lowStockProducts.length} alertes
                </span>
              </div>

              {lowStockProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-gray-800 font-medium">Tous les stocks sont bons ! 👍</p>
                  <p className="text-gray-500 text-sm mt-1">Aucun produit ne nécessite de réapprovisionnement</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 hover:shadow-md transition-all"
                      style={{animationDelay: `${0.6 + index * 0.1}s`}}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                          {product.stock}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{product.nom}</p>
                          <p className="text-sm text-gray-600">
                            Prix: <span className="font-medium">{formatPrice(product.prix)}</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stock === 0 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                          {product.stock === 0 ? '🔴 Rupture' : '⚠️ Réapprovisionner'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;