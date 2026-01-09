from pydantic import BaseModel
from decimal import Decimal
from typing import Optional

# DTO pour la création d'un produit
class ProductCreate(BaseModel):
    nom: str
    prix: Decimal
    stock: int
    image_url: Optional[str] = None

# DTO pour la réponse
class ProductResponse(BaseModel):
    id: int
    nom: str
    prix: Decimal
    stock: int
    image_url: Optional[str] = None
    
    class Config:
        from_attributes = True

# DTO pour la mise à jour
class ProductUpdate(BaseModel):
    nom: Optional[str] = None
    prix: Optional[Decimal] = None
    stock: Optional[int] = None
    image_url: Optional[str] = None