from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.config import get_db
from app.dal.product_dal import ProductDAL
from app.services.product_service import ProductService
from app.dto.product_dto import ProductCreate, ProductUpdate, ProductResponse
from typing import List

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(product_data: ProductCreate, db: Session = Depends(get_db)):
    """Créer un nouveau produit"""
    try:
        product_dal = ProductDAL(db)
        product_service = ProductService(product_dal)
        return product_service.create_product(product_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Récupérer un produit par son ID"""
    try:
        product_dal = ProductDAL(db)
        product_service = ProductService(product_dal)
        return product_service.get_product_by_id(product_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/", response_model=List[ProductResponse])
def get_all_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Récupérer tous les produits avec pagination"""
    try:
        product_dal = ProductDAL(db)
        product_service = ProductService(product_dal)
        return product_service.get_all_products(skip, limit)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/search/", response_model=List[ProductResponse])
def search_products(q: str = Query(..., min_length=2), db: Session = Depends(get_db)):
    """Rechercher des produits par nom"""
    try:
        product_dal = ProductDAL(db)
        product_service = ProductService(product_dal)
        return product_service.search_products(q)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, product_data: ProductUpdate, db: Session = Depends(get_db)):
    """Mettre à jour un produit"""
    try:
        product_dal = ProductDAL(db)
        product_service = ProductService(product_dal)
        return product_service.update_product(product_id, product_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Supprimer un produit"""
    try:
        product_dal = ProductDAL(db)
        product_service = ProductService(product_dal)
        product_service.delete_product(product_id)
        return None
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/{product_id}/stock-check")
def check_stock(product_id: int, quantity: int = Query(..., ge=1), db: Session = Depends(get_db)):
    """Vérifier la disponibilité du stock"""
    try:
        product_dal = ProductDAL(db)
        product_service = ProductService(product_dal)
        is_available = product_service.check_stock_availability(product_id, quantity)
        return {
            "product_id": product_id,
            "requested_quantity": quantity,
            "is_available": is_available
        }
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))