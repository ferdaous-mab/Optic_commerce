import { useEffect, useState } from 'react';
import { Plus, Search, ShoppingCart, Calendar, DollarSign, TrendingUp, AlertCircle, CheckCircle, X, Edit, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { salesApi } from '../api/salesApi';
import { productApi } from '../api/productApi';
import { authApi } from '../api/authApi';
import { formatPrice, formatDate } from '../utils/helpers';
import './dashboard.css';

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
      const todaySalesData = salesData.filter((sale) => sale.date.startsWith(today));

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
      setFormData({ product_id: '', user_id: '', quantity: '' });
    }
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSale(null);
    setFormData({ product_id: '', user_id: '', quantity: '' });
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
      setError(err.response?.data?.detail || 'Erreur lors de la sauvegarde de la vente');
    }
  };

  const handleDelete = async (sale) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer cette vente ? Le stock sera restauré.`)) {
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
          <p style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>Chargement des ventes...</p>
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
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(72, 187, 120, 0.4)' }}>
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a202c', marginBottom: '4px', background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Gestion des Ventes
                </h1>
                <p style={{ color: '#718096', fontSize: '14px' }}>Suivez et gérez toutes vos transactions</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <div className="login-card hover-lift">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)' }}>
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
              </div>
              <p style={{ color: '#718096', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Total des ventes</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1a202c' }}>{stats.totalSales}</p>
              <p style={{ fontSize: '12px', color: '#a0aec0', marginTop: '8px' }}>Toutes les transactions</p>
            </div>

            <div className="login-card hover-lift">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(72, 187, 120, 0.4)' }}>
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
              <p style={{ color: '#718096', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>Ventes aujourd'hui</p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1a202c' }}>{stats.todaySales}</p>
              <p style={{ fontSize: '12px', color: '#a0aec0', marginTop: '8px' }}>Transactions du jour</p>
            </div>

            <div className="login-card hover-lift" style={{ background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', opacity: 0.9 }}>Chiffre d'affaires</p>
              <p style={{ fontSize: '32px', fontWeight: '700' }}>{formatPrice(stats.totalRevenue)}</p>
              <p style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>Revenus totaux générés</p>
            </div>
          </div>

          {/* Messages */}
          {success && (
            <div className="alert alert-success" style={{ marginBottom: '24px' }}>
              <CheckCircle className="w-5 h-5" />
              {success}
            </div>
          )}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '24px' }}>
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Action Bar */}
          <div className="login-card" style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#a0aec0', width: '20px', height: '20px' }} />
                <input
                  type="text"
                  placeholder="Rechercher une vente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '48px' }}
                />
              </div>
              <button onClick={() => handleOpenModal()} className="submit-btn" style={{ background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }}>
                <Plus className="w-5 h-5" />
                <span>Nouvelle vente</span>
              </button>
            </div>
          </div>

          {/* Sales List */}
          {filteredSales.length === 0 ? (
            <div className="login-card" style={{ textAlign: 'center', padding: '64px 32px' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(72, 187, 120, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <ShoppingCart className="w-10 h-10" style={{ color: '#48bb78' }} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
                {searchTerm ? 'Aucune vente trouvée' : 'Aucune vente disponible'}
              </h3>
              <p style={{ color: '#718096', marginBottom: '24px' }}>
                {searchTerm ? 'Essayez une autre recherche' : 'Commencez par enregistrer votre première vente'}
              </p>
              {!searchTerm && (
                <button onClick={() => handleOpenModal()} className="submit-btn" style={{ width: 'auto', display: 'inline-flex', background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }}>
                  <Plus className="w-5 h-5" />
                  <span>Créer une vente</span>
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredSales.map((sale) => (
                <div key={sale.id} className="login-card hover-lift" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                      <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)' }}>
                        {sale.quantity}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '700', color: '#2d3748', fontSize: '16px', marginBottom: '4px' }}>{sale.product_nom}</p>
                        <p style={{ fontSize: '14px', color: '#718096' }}>Par <span style={{ fontWeight: '600' }}>{sale.user_nom}</span></p>
                        <p style={{ fontSize: '12px', color: '#a0aec0', marginTop: '4px' }}>{formatDate(sale.date)}</p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>Prix unitaire: {formatPrice(sale.prix_unitaire)}</p>
                        <p style={{ fontSize: '20px', fontWeight: '700', color: '#48bb78' }}>{formatPrice(sale.prix_total)}</p>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleOpenModal(sale)} style={{ padding: '8px', background: 'rgba(102, 126, 234, 0.1)', border: 'none', borderRadius: '8px', color: '#667eea', cursor: 'pointer' }}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(sale)} style={{ padding: '8px', background: 'rgba(245, 101, 101, 0.1)', border: 'none', borderRadius: '8px', color: '#f56565', cursor: 'pointer' }}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="login-card" style={{ maxWidth: '500px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c' }}>
                  {editingSale ? 'Modifier la vente' : 'Nouvelle vente'}
                </h2>
              </div>
              <button onClick={handleCloseModal} style={{ padding: '8px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#718096' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="alert alert-error" style={{ marginBottom: '16px' }}>
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success" style={{ marginBottom: '16px' }}>
                <CheckCircle className="w-5 h-5" />
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group">
                <label className="form-label">Produit *</label>
                <select
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  className="form-input"
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

              <div className="form-group">
                <label className="form-label">Vendeur *</label>
                <select
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  className="form-input"
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

              <div className="form-group">
                <label className="form-label">Quantité *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="form-input"
                  placeholder="Ex: 2"
                  required
                />
              </div>

              {formData.product_id && formData.quantity && (
                <div style={{ padding: '16px', background: 'rgba(72, 187, 120, 0.1)', borderRadius: '12px', border: '1px solid rgba(72, 187, 120, 0.3)' }}>
                  <h4 style={{ fontWeight: '600', color: '#2d3748', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp className="w-5 h-5" style={{ color: '#48bb78' }} />
                    Récapitulatif
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <p style={{ fontSize: '14px', color: '#4a5568' }}>
                      <span style={{ fontWeight: '600' }}>Produit:</span> {products.find((p) => p.id === parseInt(formData.product_id))?.nom}
                    </p>
                    <p style={{ fontSize: '14px', color: '#4a5568' }}>
                      <span style={{ fontWeight: '600' }}>Prix unitaire:</span> {formatPrice(products.find((p) => p.id === parseInt(formData.product_id))?.prix || 0)}
                    </p>
                    <p style={{ fontSize: '14px', color: '#4a5568' }}>
                      <span style={{ fontWeight: '600' }}>Quantité:</span> {formData.quantity} unité{formData.quantity > 1 ? 's' : ''}
                    </p>
                    <div style={{ borderTop: '1px solid rgba(72, 187, 120, 0.3)', paddingTop: '8px', marginTop: '8px' }}>
                      <p style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748' }}>
                        <span>Total:</span> <span style={{ color: '#48bb78' }}>{formatPrice((products.find((p) => p.id === parseInt(formData.product_id))?.prix || 0) * parseInt(formData.quantity || 0))}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={handleCloseModal} style={{ flex: 1, padding: '14px', border: '2px solid #e2e8f0', background: 'white', borderRadius: '12px', color: '#4a5568', fontWeight: '600', cursor: 'pointer' }}>
                  Annuler
                </button>
                <button type="submit" className="submit-btn" style={{ flex: 1, background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' }}>
                  {editingSale ? '✓ Modifier' : '+ Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;






