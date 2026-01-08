from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.config import get_db
from app.dal.sale_dal import SaleDAL
from app.dal.product_dal import ProductDAL
from app.dal.user_dal import UserDAL
from app.services.sale_service import SaleService
from app.dto.sale_dto import SaleCreate, SaleUpdate, SaleResponse
from typing import List
from datetime import datetime

router = APIRouter(prefix="/sales", tags=["Sales"])

@router.post("/", response_model=SaleResponse, status_code=status.HTTP_201_CREATED)
def create_sale(sale_data: SaleCreate, db: Session = Depends(get_db)):
    """Créer une nouvelle vente"""
    try:
        sale_dal = SaleDAL(db)
        product_dal = ProductDAL(db)
        user_dal = UserDAL(db)
        sale_service = SaleService(sale_dal, product_dal, user_dal)
        return sale_service.create_sale(sale_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/{sale_id}", response_model=SaleResponse)
def get_sale(sale_id: int, db: Session = Depends(get_db)):
    """Récupérer une vente par son ID"""
    try:
        sale_dal = SaleDAL(db)
        product_dal = ProductDAL(db)
        user_dal = UserDAL(db)
        sale_service = SaleService(sale_dal, product_dal, user_dal)
        return sale_service.get_sale_by_id(sale_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/", response_model=List[SaleResponse])
def get_all_sales(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Récupérer toutes les ventes avec pagination"""
    try:
        sale_dal = SaleDAL(db)
        product_dal = ProductDAL(db)
        user_dal = UserDAL(db)
        sale_service = SaleService(sale_dal, product_dal, user_dal)
        return sale_service.get_all_sales(skip, limit)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/user/{user_id}", response_model=List[SaleResponse])
def get_sales_by_user(user_id: int, db: Session = Depends(get_db)):
    """Récupérer toutes les ventes d'un utilisateur"""
    try:
        sale_dal = SaleDAL(db)
        product_dal = ProductDAL(db)
        user_dal = UserDAL(db)
        sale_service = SaleService(sale_dal, product_dal, user_dal)
        return sale_service.get_sales_by_user(user_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/product/{product_id}", response_model=List[SaleResponse])
def get_sales_by_product(product_id: int, db: Session = Depends(get_db)):
    """Récupérer toutes les ventes d'un produit"""
    try:
        sale_dal = SaleDAL(db)
        product_dal = ProductDAL(db)
        user_dal = UserDAL(db)
        sale_service = SaleService(sale_dal, product_dal, user_dal)
        return sale_service.get_sales_by_product(product_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/date-range/", response_model=List[SaleResponse])
def get_sales_by_date_range(
    start_date: datetime = Query(..., description="Date de début (format: YYYY-MM-DD)"),
    end_date: datetime = Query(..., description="Date de fin (format: YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    """Récupérer les ventes dans une période"""
    try:
        sale_dal = SaleDAL(db)
        product_dal = ProductDAL(db)
        user_dal = UserDAL(db)
        sale_service = SaleService(sale_dal, product_dal, user_dal)
        return sale_service.get_sales_by_date_range(start_date, end_date)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.put("/{sale_id}", response_model=SaleResponse)
def update_sale(sale_id: int, sale_data: SaleUpdate, db: Session = Depends(get_db)):
    """Mettre à jour une vente"""
    try:
        sale_dal = SaleDAL(db)
        product_dal = ProductDAL(db)
        user_dal = UserDAL(db)
        sale_service = SaleService(sale_dal, product_dal, user_dal)
        return sale_service.update_sale(sale_id, sale_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.delete("/{sale_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sale(sale_id: int, db: Session = Depends(get_db)):
    """Supprimer une vente (remet le stock)"""
    try:
        sale_dal = SaleDAL(db)
        product_dal = ProductDAL(db)
        user_dal = UserDAL(db)
        sale_service = SaleService(sale_dal, product_dal, user_dal)
        sale_service.delete_sale(sale_id)
        return None
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/stats/total-amount")
def get_total_sales_amount(
    start_date: datetime = Query(None, description="Date de début (optionnel)"),
    end_date: datetime = Query(None, description="Date de fin (optionnel)"),
    db: Session = Depends(get_db)
):
    """Calculer le montant total des ventes"""
    try:
        sale_dal = SaleDAL(db)
        product_dal = ProductDAL(db)
        user_dal = UserDAL(db)
        sale_service = SaleService(sale_dal, product_dal, user_dal)
        total = sale_service.get_total_sales_amount(start_date, end_date)
        return {
            "total_amount": total,
            "start_date": start_date,
            "end_date": end_date
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))