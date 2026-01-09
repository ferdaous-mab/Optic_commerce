from app.dal.product_dal import ProductDAL
from app.dto.product_dto import ProductCreate, ProductUpdate, ProductResponse
from typing import List

class ProductService:
    def __init__(self, product_dal: ProductDAL):
        self.product_dal = product_dal
    
    def create_product(self, product_data: ProductCreate) -> ProductResponse:
        """Créer un nouveau produit"""
        try:
            # Validation du stock
            if product_data.stock < 0:
                raise ValueError("Le stock ne peut pas être négatif")
            
            # Validation du prix
            if product_data.prix <= 0:
                raise ValueError("Le prix doit être supérieur à 0")
            
            # Créer le produit
            product_dict = product_data.dict()
            new_product = self.product_dal.create_product(product_dict)
            
            return ProductResponse.from_orm(new_product)
        
        except ValueError as e:
            raise e
        except Exception as e:
            raise Exception(f"Erreur lors de la création du produit: {str(e)}")
    
    def get_product_by_id(self, product_id: int) -> ProductResponse:
        """Récupérer un produit par son ID"""
        try:
            product = self.product_dal.get_product_by_id(product_id)
            if not product:
                raise ValueError("Produit introuvable")
            return ProductResponse.from_orm(product)
        except ValueError as e:
            raise e
        except Exception as e:
            raise Exception(f"Erreur lors de la récupération du produit: {str(e)}")
    
    def get_all_products(self, skip: int = 0, limit: int = 100) -> List[ProductResponse]:
        """Récupérer tous les produits"""
        try:
            products = self.product_dal.get_all_products(skip, limit)
            return [ProductResponse.from_orm(product) for product in products]
        except Exception as e:
            raise Exception(f"Erreur lors de la récupération des produits: {str(e)}")
    
    def search_products(self, search_term: str) -> List[ProductResponse]:
        """Rechercher des produits par nom"""
        try:
            if not search_term or len(search_term) < 2:
                raise ValueError("Le terme de recherche doit contenir au moins 2 caractères")
            
            products = self.product_dal.search_products(search_term)
            return [ProductResponse.from_orm(product) for product in products]
        except ValueError as e:
            raise e
        except Exception as e:
            raise Exception(f"Erreur lors de la recherche: {str(e)}")
    
    def update_product(self, product_id: int, product_data: ProductUpdate) -> ProductResponse:
        """Mettre à jour un produit"""
        try:
            # Vérifier que le produit existe
            existing_product = self.product_dal.get_product_by_id(product_id)
            if not existing_product:
                raise ValueError("Produit introuvable")
            
            # Validation des données
            if product_data.stock is not None and product_data.stock < 0:
                raise ValueError("Le stock ne peut pas être négatif")
            
            if product_data.prix is not None and product_data.prix <= 0:
                raise ValueError("Le prix doit être supérieur à 0")
            
            # Mettre à jour
            product_dict = product_data.dict(exclude_unset=True)
            updated_product = self.product_dal.update_product(product_id, product_dict)
            
            return ProductResponse.from_orm(updated_product)
        
        except ValueError as e:
            raise e
        except Exception as e:
            raise Exception(f"Erreur lors de la mise à jour du produit: {str(e)}")
    
    def delete_product(self, product_id: int) -> bool:
        """Supprimer un produit"""
        try:
            # Vérifier que le produit existe
            product = self.product_dal.get_product_by_id(product_id)
            if not product:
                raise ValueError("Produit introuvable")
            
            return self.product_dal.delete_product(product_id)
        except ValueError as e:
            raise e
        except Exception as e:
            raise Exception(f"Erreur lors de la suppression du produit: {str(e)}")
    
    def check_stock_availability(self, product_id: int, quantity: int) -> bool:
        """Vérifier la disponibilité du stock"""
        try:
            product = self.product_dal.get_product_by_id(product_id)
            if not product:
                raise ValueError("Produit introuvable")
            
            return product.stock >= quantity
        except Exception as e:
            raise e