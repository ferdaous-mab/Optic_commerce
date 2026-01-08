from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.sale import Sale
from app.models.product import Product
from app.models.user import User
from typing import Optional, List
from datetime import datetime

class SaleDAL:
    def __init__(self, db: Session):
        self.db = db
    
    def create_sale(self, sale_data: dict) -> Sale:
        """Créer une nouvelle vente"""
        try:
            sale = Sale(**sale_data)
            self.db.add(sale)
            self.db.commit()
            self.db.refresh(sale)
            return sale
        except Exception as e:
            self.db.rollback()
            raise e
    
    def get_sale_by_id(self, sale_id: int) -> Optional[dict]:
        """Récupérer une vente par son ID avec détails"""
        try:
            result = self.db.query(
                Sale,
                Product.nom.label('product_nom'),
                Product.prix.label('prix_unitaire'),
                User.nom.label('user_nom')
            ).join(
                Product, Sale.product_id == Product.id
            ).join(
                User, Sale.user_id == User.id
            ).filter(Sale.id == sale_id).first()
            
            if result:
                sale, product_nom, prix_unitaire, user_nom = result
                return {
                    "id": sale.id,
                    "product_id": sale.product_id,
                    "user_id": sale.user_id,
                    "quantity": sale.quantity,
                    "date": sale.date,
                    "product_nom": product_nom,
                    "user_nom": user_nom,
                    "prix_unitaire": float(prix_unitaire),
                    "prix_total": float(prix_unitaire) * sale.quantity
                }
            return None
        except Exception as e:
            raise e
    
    def get_all_sales(self, skip: int = 0, limit: int = 100) -> List[dict]:
        """Récupérer toutes les ventes avec détails et pagination"""
        try:
            results = self.db.query(
                Sale,
                Product.nom.label('product_nom'),
                Product.prix.label('prix_unitaire'),
                User.nom.label('user_nom')
            ).join(
                Product, Sale.product_id == Product.id
            ).join(
                User, Sale.user_id == User.id
            ).order_by(desc(Sale.date)).offset(skip).limit(limit).all()
            
            sales = []
            for sale, product_nom, prix_unitaire, user_nom in results:
                sales.append({
                    "id": sale.id,
                    "product_id": sale.product_id,
                    "user_id": sale.user_id,
                    "quantity": sale.quantity,
                    "date": sale.date,
                    "product_nom": product_nom,
                    "user_nom": user_nom,
                    "prix_unitaire": float(prix_unitaire),
                    "prix_total": float(prix_unitaire) * sale.quantity
                })
            return sales
        except Exception as e:
            raise e
    
    def get_sales_by_user(self, user_id: int) -> List[dict]:
        """Récupérer toutes les ventes d'un utilisateur"""
        try:
            results = self.db.query(
                Sale,
                Product.nom.label('product_nom'),
                Product.prix.label('prix_unitaire'),
                User.nom.label('user_nom')
            ).join(
                Product, Sale.product_id == Product.id
            ).join(
                User, Sale.user_id == User.id
            ).filter(Sale.user_id == user_id).order_by(desc(Sale.date)).all()
            
            sales = []
            for sale, product_nom, prix_unitaire, user_nom in results:
                sales.append({
                    "id": sale.id,
                    "product_id": sale.product_id,
                    "user_id": sale.user_id,
                    "quantity": sale.quantity,
                    "date": sale.date,
                    "product_nom": product_nom,
                    "user_nom": user_nom,
                    "prix_unitaire": float(prix_unitaire),
                    "prix_total": float(prix_unitaire) * sale.quantity
                })
            return sales
        except Exception as e:
            raise e
    
    def get_sales_by_product(self, product_id: int) -> List[dict]:
        """Récupérer toutes les ventes d'un produit"""
        try:
            results = self.db.query(
                Sale,
                Product.nom.label('product_nom'),
                Product.prix.label('prix_unitaire'),
                User.nom.label('user_nom')
            ).join(
                Product, Sale.product_id == Product.id
            ).join(
                User, Sale.user_id == User.id
            ).filter(Sale.product_id == product_id).order_by(desc(Sale.date)).all()
            
            sales = []
            for sale, product_nom, prix_unitaire, user_nom in results:
                sales.append({
                    "id": sale.id,
                    "product_id": sale.product_id,
                    "user_id": sale.user_id,
                    "quantity": sale.quantity,
                    "date": sale.date,
                    "product_nom": product_nom,
                    "user_nom": user_nom,
                    "prix_unitaire": float(prix_unitaire),
                    "prix_total": float(prix_unitaire) * sale.quantity
                })
            return sales
        except Exception as e:
            raise e
    
    def get_sales_by_date_range(self, start_date: datetime, end_date: datetime) -> List[dict]:
        """Récupérer les ventes dans une période"""
        try:
            results = self.db.query(
                Sale,
                Product.nom.label('product_nom'),
                Product.prix.label('prix_unitaire'),
                User.nom.label('user_nom')
            ).join(
                Product, Sale.product_id == Product.id
            ).join(
                User, Sale.user_id == User.id
            ).filter(
                Sale.date >= start_date,
                Sale.date <= end_date
            ).order_by(desc(Sale.date)).all()
            
            sales = []
            for sale, product_nom, prix_unitaire, user_nom in results:
                sales.append({
                    "id": sale.id,
                    "product_id": sale.product_id,
                    "user_id": sale.user_id,
                    "quantity": sale.quantity,
                    "date": sale.date,
                    "product_nom": product_nom,
                    "user_nom": user_nom,
                    "prix_unitaire": float(prix_unitaire),
                    "prix_total": float(prix_unitaire) * sale.quantity
                })
            return sales
        except Exception as e:
            raise e
    
    def update_sale(self, sale_id: int, sale_data: dict) -> Optional[Sale]:
        """Mettre à jour une vente"""
        try:
            sale = self.db.query(Sale).filter(Sale.id == sale_id).first()
            if not sale:
                return None
            
            for key, value in sale_data.items():
                if value is not None:
                    setattr(sale, key, value)
            
            self.db.commit()
            self.db.refresh(sale)
            return sale
        except Exception as e:
            self.db.rollback()
            raise e
    
    def delete_sale(self, sale_id: int) -> bool:
        """Supprimer une vente"""
        try:
            sale = self.db.query(Sale).filter(Sale.id == sale_id).first()
            if not sale:
                return False
            
            self.db.delete(sale)
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            raise e