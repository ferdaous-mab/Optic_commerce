from app.dal.sale_dal import SaleDAL
from app.dal.product_dal import ProductDAL
from app.dal.user_dal import UserDAL
from app.dto.sale_dto import SaleCreate, SaleUpdate, SaleResponse
from typing import List
from datetime import datetime

class SaleService:
    def __init__(self, sale_dal: SaleDAL, product_dal: ProductDAL, user_dal: UserDAL):
        self.sale_dal = sale_dal
        self.product_dal = product_dal
        self.user_dal = user_dal
    
    def create_sale(self, sale_data: SaleCreate) -> dict:
        """Créer une nouvelle vente"""
        try:
            # Vérifier que l'utilisateur existe
            user = self.user_dal.get_user_by_id(sale_data.user_id)
            if not user:
                raise ValueError("Utilisateur introuvable")
            
            # Vérifier que le produit existe
            product = self.product_dal.get_product_by_id(sale_data.product_id)
            if not product:
                raise ValueError("Produit introuvable")
            
            # Vérifier la quantité
            if sale_data.quantity <= 0:
                raise ValueError("La quantité doit être supérieure à 0")
            
            # Vérifier le stock disponible
            if product.stock < sale_data.quantity:
                raise ValueError(f"Stock insuffisant. Stock disponible: {product.stock}")
            
            # Créer la vente
            sale_dict = sale_data.dict()
            new_sale = self.sale_dal.create_sale(sale_dict)
            
            # Mettre à jour le stock
            self.product_dal.update_stock(sale_data.product_id, -sale_data.quantity)
            
            # Récupérer la vente avec les détails
            return self.sale_dal.get_sale_by_id(new_sale.id)
        
        except ValueError as e:
            raise e
        except Exception as e:
            raise Exception(f"Erreur lors de la création de la vente: {str(e)}")
    
    def get_sale_by_id(self, sale_id: int) -> dict:
        """Récupérer une vente par son ID"""
        try:
            sale = self.sale_dal.get_sale_by_id(sale_id)
            if not sale:
                raise ValueError("Vente introuvable")
            return sale
        except ValueError as e:
            raise e
        except Exception as e:
            raise Exception(f"Erreur lors de la récupération de la vente: {str(e)}")
    
    def get_all_sales(self, skip: int = 0, limit: int = 100) -> List[dict]:
        """Récupérer toutes les ventes"""
        try:
            return self.sale_dal.get_all_sales(skip, limit)
        except Exception as e:
            raise Exception(f"Erreur lors de la récupération des ventes: {str(e)}")
    
    def get_sales_by_user(self, user_id: int) -> List[dict]:
        """Récupérer toutes les ventes d'un utilisateur"""
        try:
            # Vérifier que l'utilisateur existe
            user = self.user_dal.get_user_by_id(user_id)
            if not user:
                raise ValueError("Utilisateur introuvable")
            
            return self.sale_dal.get_sales_by_user(user_id)
        except ValueError as e:
            raise e
        except Exception as e:
            raise Exception(f"Erreur lors de la récupération des ventes: {str(e)}")
    
    def get_sales_by_product(self, product_id: int) -> List[dict]:
        """Récupérer toutes les ventes d'un produit"""
        try:
            # Vérifier que le produit existe
            product = self.product_dal.get_product_by_id(product_id)
            if not product:
                raise ValueError("Produit introuvable")
            
            return self.sale_dal.get_sales_by_product(product_id)
        except ValueError as e:
            raise e
        except Exception as e:
            raise Exception(f"Erreur lors de la récupération des ventes: {str(e)}")
    
    def get_sales_by_date_range(self, start_date: datetime, end_date: datetime) -> List[dict]:
        """Récupérer les ventes dans une période"""
        try:
            if start_date > end_date:
                raise ValueError("La date de début doit être antérieure à la date de fin")
            
            return self.sale_dal.get_sales_by_date_range(start_date, end_date)
        except ValueError as e:
            raise e
        except Exception as e:
            raise Exception(f"Erreur lors de la récupération des ventes: {str(e)}")
    
    def update_sale(self, sale_id: int, sale_data: SaleUpdate) -> dict:
        """Mettre à jour une vente"""
        try:
            # Vérifier que la vente existe
            existing_sale = self.sale_dal.get_sale_by_id(sale_id)
            if not existing_sale:
                raise ValueError("Vente introuvable")
            
            # Si on change le produit, vérifier qu'il existe
            if sale_data.product_id is not None:
                product = self.product_dal.get_product_by_id(sale_data.product_id)
                if not product:
                    raise ValueError("Produit introuvable")
            
            # Si on change l'utilisateur, vérifier qu'il existe
            if sale_data.user_id is not None:
                user = self.user_dal.get_user_by_id(sale_data.user_id)
                if not user:
                    raise ValueError("Utilisateur introuvable")
            
            # Si on change la quantité, gérer le stock
            if sale_data.quantity is not None:
                old_quantity = existing_sale["quantity"]
                product_id = existing_sale["product_id"]
                quantity_diff = sale_data.quantity - old_quantity
                
                product = self.product_dal.get_product_by_id(product_id)
                if product.stock < quantity_diff:
                    raise ValueError(f"Stock insuffisant. Stock disponible: {product.stock}")
                
                # Mettre à jour le stock
                self.product_dal.update_stock(product_id, -quantity_diff)
            
            # Mettre à jour la vente
            sale_dict = sale_data.dict(exclude_unset=True)
            self.sale_dal.update_sale(sale_id, sale_dict)
            
            return self.sale_dal.get_sale_by_id(sale_id)
        
        except ValueError as e:
            raise e
        except Exception as e:
            raise Exception(f"Erreur lors de la mise à jour de la vente: {str(e)}")
    
    def delete_sale(self, sale_id: int) -> bool:
        """Supprimer une vente"""
        try:
            # Récupérer la vente
            sale = self.sale_dal.get_sale_by_id(sale_id)
            if not sale:
                raise ValueError("Vente introuvable")
            
            # Remettre le stock (annuler la vente)
            self.product_dal.update_stock(sale["product_id"], sale["quantity"])
            
            # Supprimer la vente
            return self.sale_dal.delete_sale(sale_id)
        
        except ValueError as e:
            raise e
        except Exception as e:
            raise Exception(f"Erreur lors de la suppression de la vente: {str(e)}")
    
    def get_total_sales_amount(self, start_date: datetime = None, end_date: datetime = None) -> float:
        """Calculer le montant total des ventes"""
        try:
            if start_date and end_date:
                sales = self.sale_dal.get_sales_by_date_range(start_date, end_date)
            else:
                sales = self.sale_dal.get_all_sales()
            
            total = sum(sale["prix_total"] for sale in sales)
            return total
        except Exception as e:
            raise Exception(f"Erreur lors du calcul du total: {str(e)}")