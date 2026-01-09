from app.dal.user_dal import UserDAL
from app.utils.security import hash_password, verify_password, create_access_token
from app.dto.user_dto import UserCreate, UserLogin, UserResponse
from datetime import timedelta
from app.config import ACCESS_TOKEN_EXPIRE_MINUTES
from typing import Dict
import traceback

class AuthService:
    def __init__(self, user_dal: UserDAL):
        self.user_dal = user_dal
    
    def register(self, user_data: UserCreate) -> UserResponse:
        """Inscription d'un nouvel utilisateur"""
        try:
            print(f"🔍 DEBUG: Début de l'inscription")
            print(f"🔍 DEBUG: Données reçues: {user_data}")
            
            # Vérifier si l'email existe déjà
            print(f"🔍 DEBUG: Vérification de l'email...")
            existing_user = self.user_dal.get_user_by_email(user_data.email)
            if existing_user:
                raise ValueError("Cet email est déjà utilisé")
            
            print(f"🔍 DEBUG: Email disponible, hashage du mot de passe...")
            # Hasher le mot de passe
            hashed_password = hash_password(user_data.password)
            print(f"🔍 DEBUG: Mot de passe hashé avec succès")
            
            # Préparer les données pour la création
            user_dict = {
                "nom": user_data.nom,
                "email": user_data.email,
                "password": hashed_password
            }
            print(f"🔍 DEBUG: Dictionnaire créé: {user_dict}")
            
            # Créer l'utilisateur
            print(f"🔍 DEBUG: Création de l'utilisateur dans la DB...")
            new_user = self.user_dal.create_user(user_dict)
            print(f"🔍 DEBUG: Utilisateur créé avec succès: {new_user.id}")
            
            return UserResponse.from_orm(new_user)
        
        except ValueError as e:
            print(f"❌ ERROR ValueError: {str(e)}")
            raise e
        except Exception as e:
            print(f"❌ ERROR Exception: {str(e)}")
            print(f"❌ Traceback complet:")
            traceback.print_exc()
            raise Exception(f"Erreur lors de l'inscription: {str(e)}")
        
    def login(self, credentials: UserLogin) -> Dict:
        """Connexion d'un utilisateur"""
        try:
            # Récupérer l'utilisateur par email
            user = self.user_dal.get_user_by_email(credentials.email)
            
            if not user:
                raise ValueError("Email ou mot de passe incorrect")
            
            # Vérifier le mot de passe
            if not verify_password(credentials.password, user.password):
                raise ValueError("Email ou mot de passe incorrect")
            
            # Créer le token JWT
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            access_token = create_access_token(
                data={"sub": user.email, "user_id": user.id},
                expires_delta=access_token_expires
            )
            
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": UserResponse.from_orm(user)
            }
        
        except ValueError as e:
            raise e
        except Exception as e:
            raise Exception(f"Erreur lors de la connexion: {str(e)}")
    
    def get_user_by_id(self, user_id: int) -> UserResponse:
        """Récupérer un utilisateur par son ID"""
        try:
            user = self.user_dal.get_user_by_id(user_id)
            if not user:
                raise ValueError("Utilisateur introuvable")
            return UserResponse.from_orm(user)
        except Exception as e:
            raise e
    
    def get_all_users(self, skip: int = 0, limit: int = 100):
        """Récupérer tous les utilisateurs"""
        try:
            users = self.user_dal.get_all_users(skip, limit)
            return [UserResponse.from_orm(user) for user in users]
        except Exception as e:
            raise Exception(f"Erreur lors de la récupération des utilisateurs: {str(e)}")