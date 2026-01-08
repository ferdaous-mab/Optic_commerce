from sqlalchemy.orm import Session
from app.models.user import User
from typing import Optional, List

class UserDAL:
    def __init__(self, db: Session):
        self.db = db
    
    def create_user(self, user_data: dict) -> User:
        """Créer un nouvel utilisateur"""
        try:
            user = User(**user_data)
            self.db.add(user)
            self.db.commit()
            self.db.refresh(user)
            return user
        except Exception as e:
            self.db.rollback()
            raise e
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Récupérer un utilisateur par son ID"""
        try:
            return self.db.query(User).filter(User.id == user_id).first()
        except Exception as e:
            raise e
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Récupérer un utilisateur par son email"""
        try:
            return self.db.query(User).filter(User.email == email).first()
        except Exception as e:
            raise e
    
    def get_all_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        """Récupérer tous les utilisateurs avec pagination"""
        try:
            return self.db.query(User).offset(skip).limit(limit).all()
        except Exception as e:
            raise e
    
    def update_user(self, user_id: int, user_data: dict) -> Optional[User]:
        """Mettre à jour un utilisateur"""
        try:
            user = self.get_user_by_id(user_id)
            if not user:
                return None
            
            for key, value in user_data.items():
                if value is not None:
                    setattr(user, key, value)
            
            self.db.commit()
            self.db.refresh(user)
            return user
        except Exception as e:
            self.db.rollback()
            raise e
    
    def delete_user(self, user_id: int) -> bool:
        """Supprimer un utilisateur"""
        try:
            user = self.get_user_by_id(user_id)
            if not user:
                return False
            
            self.db.delete(user)
            self.db.commit()
            return True
        except Exception as e:
            self.db.rollback()
            raise e