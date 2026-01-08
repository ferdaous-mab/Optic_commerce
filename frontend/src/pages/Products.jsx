import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Package, AlertCircle, CheckCircle, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { productApi } from '../api/productApi';
import { formatPrice, getStockStatus } from '../utils/helpers';
import './dashboard.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prix: '',
    stock: '',
    image_url: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.nom.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      setError('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nom: product.nom,
        prix: product.prix,
        stock: product.stock,
        image_url: product.image_url || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({ nom: '', prix: '', stock: '', image_url: '' });
    }
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({ nom: '', prix: '', stock: '', image_url: '' });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const productData = {
        nom: formData.nom,
        prix: parseFloat(formData.prix),
        stock: parseInt(formData.stock),
        image_url: formData.image_url || null,
      };

      if (editingProduct) {
        await productApi.updateProduct(editingProduct.id, productData);
        setSuccess('Produit modifié avec succès !');
      } else {
        await productApi.createProduct(productData);
        setSuccess('Produit créé avec succès !');
      }

      setTimeout(() => {
        handleCloseModal();
        fetchProducts();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la sauvegarde du produit');
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${product.nom}" ?`)) {
      try {
        await productApi.deleteProduct(product.id);
        setSuccess('Produit supprimé avec succès !');
        fetchProducts();
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        setError('Erreur lors de la suppression du produit');
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
          <p style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>Chargement des produits...</p>
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
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(159, 122, 234, 0.4)' }}>
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a202c', marginBottom: '4px', background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Gestion des Produits
                </h1>
                <p style={{ color: '#718096', fontSize: '14px' }}>Gérez votre catalogue de produits</p>
              </div>
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
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '48px' }}
                />
              </div>
              <button onClick={() => handleOpenModal()} className="submit-btn">
                <Plus className="w-5 h-5" />
                <span>Nouveau produit</span>
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="login-card" style={{ textAlign: 'center', padding: '64px 32px' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(159, 122, 234, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Package className="w-10 h-10" style={{ color: '#9f7aea' }} />
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>
                {searchTerm ? 'Aucun produit trouvé' : 'Aucun produit disponible'}
              </h3>
              <p style={{ color: '#718096', marginBottom: '24px' }}>
                {searchTerm ? 'Essayez une autre recherche' : 'Commencez par ajouter votre premier produit'}
              </p>
              {!searchTerm && (
                <button onClick={() => handleOpenModal()} className="submit-btn" style={{ width: 'auto', display: 'inline-flex' }}>
                  <Plus className="w-5 h-5" />
                  <span>Ajouter un produit</span>
                </button>
              )}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {filteredProducts.map((product) => {
                const status = getStockStatus(product.stock);
                const statusColors = {
                  red: { bg: 'rgba(245, 101, 101, 0.1)', text: '#f56565', border: 'rgba(245, 101, 101, 0.3)' },
                  orange: { bg: 'rgba(237, 137, 54, 0.1)', text: '#ed8936', border: 'rgba(237, 137, 54, 0.3)' },
                  yellow: { bg: 'rgba(237, 204, 88, 0.1)', text: '#d69e2e', border: 'rgba(237, 204, 88, 0.3)' },
                  green: { bg: 'rgba(72, 187, 120, 0.1)', text: '#48bb78', border: 'rgba(72, 187, 120, 0.3)' },
                };
                const statusColor = statusColors[status.color];

                return (
                  <div key={product.id} className="login-card hover-lift" style={{ padding: '24px' }}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.nom} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px', marginBottom: '16px' }} />
                    ) : (
                      <div style={{ width: '100%', height: '180px', background: 'linear-gradient(135deg, rgba(159, 122, 234, 0.1), rgba(128, 90, 213, 0.1))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                        <Package className="w-16 h-16" style={{ color: '#9f7aea' }} />
                      </div>
                    )}
                    
                    <div style={{ marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#2d3748', marginBottom: '8px' }}>{product.nom}</h3>
                      <p style={{ fontSize: '24px', fontWeight: '700', color: '#48bb78' }}>{formatPrice(product.prix)}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span style={{ fontSize: '14px', color: '#718096' }}>Stock:</span>
                      <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', background: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}` }}>
                        {product.stock} - {status.label}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleOpenModal(product)} style={{ flex: 1, padding: '10px', background: 'rgba(102, 126, 234, 0.1)', border: 'none', borderRadius: '10px', color: '#667eea', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s' }}>
                        <Edit className="w-4 h-4" />
                        Modifier
                      </button>
                      <button onClick={() => handleDelete(product)} style={{ flex: 1, padding: '10px', background: 'rgba(245, 101, 101, 0.1)', border: 'none', borderRadius: '10px', color: '#f56565', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s' }}>
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                );
              })}
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
                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c' }}>
                  {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
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
                <label className="form-label">Nom du produit *</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="form-input"
                  placeholder="Ex: Lunettes Ray-Ban Classic"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Prix (MAD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.prix}
                    onChange={(e) => setFormData({ ...formData, prix: e.target.value })}
                    className="form-input"
                    placeholder="250.00"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="form-input"
                    placeholder="50"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">URL de l'image (optionnel)</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="form-input"
                  placeholder="https://example.com/image.jpg"
                />
                <p className="input-hint">Laissez vide pour utiliser une image par défaut</p>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={handleCloseModal} style={{ flex: 1, padding: '14px', border: '2px solid #e2e8f0', background: 'white', borderRadius: '12px', color: '#4a5568', fontWeight: '600', cursor: 'pointer' }}>
                  Annuler
                </button>
                <button type="submit" className="submit-btn" style={{ flex: 1 }}>
                  {editingProduct ? '✓ Modifier' : '+ Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;