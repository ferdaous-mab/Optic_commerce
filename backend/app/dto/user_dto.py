from pydantic import BaseModel, EmailStr
from typing import Optional

# DTO pour la création d'un utilisateur (inscription)
class UserCreate(BaseModel):
    nom: str
    email: EmailStr
    password: str

# DTO pour la connexion
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# DTO pour la réponse (sans le mot de passe)
class UserResponse(BaseModel):
    id: int
    nom: str
    email: str
    
    class Config:
        from_attributes = True  # Permet de convertir depuis un modèle SQLAlchemy

# DTO pour la mise à jour
class UserUpdate(BaseModel):
    nom: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None