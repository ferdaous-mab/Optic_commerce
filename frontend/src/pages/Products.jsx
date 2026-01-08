import { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Package, AlertCircle, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import Table from '../components/Table';
import { productApi } from '../api/productApi';
import { formatPrice, getStockStatus } from '../utils/helpers';

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
      setFormData({
        nom: '',
        prix: '',
        stock: '',
        image_url: '',
      });
    }
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      nom: '',
      prix: '',
      stock: '',
      image_url: '',
    });
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
      setError(
        err.response?.data?.detail || 'Erreur lors de la sauvegarde du produit'
      );
    }
  };

  const handleDelete = async (product) => {
    if (
      window.confirm(`Êtes-vous sûr de vouloir supprimer "${product.nom}" ?`)
    ) {
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

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => (
        <span className="font-mono text-sm text-gray-500">#{value}</span>
      ),
    },
    {
      key: 'nom',
      label: 'Nom',
      render: (value, row) => (
        <div className="flex items-center space-x-3">
          {row.image_url ? (
            <img
              src={row.image_url}
              alt={value}
              className="w-12 h-12 rounded-xl object-cover shadow-md"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center shadow-md">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
          )}
          <span className="font-semibold text-gray-800">{value}</span>
        </div>
      ),
    },
    {
      key: 'prix',
      label: 'Prix',
      render: (value) => (
        <span className="font-bold text-green-600 text-lg">
          {formatPrice(value)}
        </span>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (value) => {
        const status = getStockStatus(value);
        const colorClasses = {
          red: 'bg-red-100 text-red-800 border-red-200',
          orange: 'bg-orange-100 text-orange-800 border-orange-200',
          yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          green: 'bg-green-100 text-green-800 border-green-200',
        };
        return (
          <span
            className={`px-4 py-2 rounded-xl text-sm font-semibold border ${
              colorClasses[status.color]
            }`}
          >
            {value} unités ({status.label})
          </span>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-xl font-medium">Chargement des produits...</p>
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
              Gestion des Produits
            </h1>
            <p className="text-gray-600 flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Gérez votre catalogue de produits</span>
            </p>
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
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                />
              </div>

              <button
                onClick={() => handleOpenModal()}
                className="w-full lg:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover-lift font-semibold"
              >
                <Plus className="w-5 h-5" />
                <span>Nouveau produit</span>
              </button>
            </div>
          </div>

          {/* Products Table/Empty State */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-premium p-16 text-center fade-in">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {searchTerm ? 'Aucun produit trouvé' : 'Aucun produit disponible'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm
                  ? 'Essayez une autre recherche'
                  : 'Commencez par ajouter votre premier produit'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => handleOpenModal()}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  <span>Ajouter un produit</span>
                </button>
              )}
            </div>
          ) : (
            <Table
              columns={columns}
              data={filteredProducts}
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
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span>{editingProduct ? 'Modifier le produit' : 'Nouveau produit'}</span>
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
              Nom du produit *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) =>
                setFormData({ ...formData, nom: e.target.value })
              }
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Ex: Lunettes Ray-Ban Classic"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                Prix (MAD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.prix}
                onChange={(e) =>
                  setFormData({ ...formData, prix: e.target.value })
                }
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="250.00"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                Stock *
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2 text-sm">
              URL de l'image (optionnel)
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-2">Laissez vide pour utiliser une image par défaut</p>
          </div>

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
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              {editingProduct ? '✓ Modifier' : '+ Créer'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Products;