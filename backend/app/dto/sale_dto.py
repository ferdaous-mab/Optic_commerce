from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal
from typing import Optional

# DTO pour la création d'une vente
class SaleCreate(BaseModel):
    product_id: int
    user_id: int
    quantity: int

# DTO pour la mise à jour d'une vente
class SaleUpdate(BaseModel):
    product_id: Optional[int] = None
    user_id: Optional[int] = None
    quantity: Optional[int] = None

# DTO pour la réponse (avec détails optionnels)
class SaleResponse(BaseModel):
    id: int
    product_id: int
    user_id: int
    quantity: int
    date: datetime
    product_nom: Optional[str] = None
    user_nom: Optional[str] = None
    prix_unitaire: Optional[Decimal] = None
    prix_total: Optional[Decimal] = None
    
    class Config:
        from_attributes = True