from sqlalchemy.orm import Session
from app.models.product import Product
from typing import Optional, List

class ProductDAL:
    def __init__(self, db: Session):
        self.db = db
    
    def create_product(self, product_data: dict) -> Product:
        """Créer un nouveau produit"""
        try:
            product = Product(**product_data)
            self.db.add(product)
            self.db.commit()
            self.db.refresh(product)
            return product
        except Exception as e:
            self.db.rollback()
            raise e
    
    def get_product_by_id(self, product_id: int) -> Optional[Product]:
        """Récupérer un produit par son ID"""
        try:
            return self.db.query(Product).filter(Product.id == product_id).first()
        except Exception as e:
            raise e
    
    def get_all_products(self, skip: int = 0, limit: int = 100) -> List[Product]:
        """Récupérer tous les produits avec pagination"""
        try:
            return self.db.query(Product).offset(skip).limit(limit).all()
        except Exception as e:
            raise e
    
    def search_products(self, search_term: str) -> List[Product]:
        """Rechercher des produits par nom"""
        try:
            return self.db.query(Product).filter(
                Product.nom.ilike(f"%{search_term}%")
            ).all()
        except Exception as e:
            raise e
    
    def update_product(self, product_id: int, product_data: dict) -> Optional[Product]:
        """Mettre à jour un produit"""
        try:
            product = self.get_product_by_id(product_id)
            if not product:
                return None
            
            for key, value in product_data.items():
                if value is not None:
                    setattr(product, key, value)
            
            self.db.commit()
            self.db.refresh(product)
            return product
        except Exception as e:
            self.db.rollback()
            raise e
    
    def update_stock(self, product_id: int, quantity_change: int) -> Optional[Product]:
        """Mettre à jour le stock d'un produit"""
        try:
            product = self.get_product_by_id(product_id)
            if not product:
                return None
            
            product.stock += quantity_change
            
            if product.stock < 0:
                raise ValueError("Stock insuffisant")
            
            self.db.commit()
            self.db.refresh(product)
            return product
        except Exception as e:
            self.db.rollback()
            raise e
    
    def delete_product(self, product_id: int) -> bool:
        """Supprimer un produit"""
        try:
            product = self.get_product_by_id(product_id)
            if not product:
                return False
            
            self.db.delete(product)
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            raise e