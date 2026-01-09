from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, Dict
from app.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES

# Configuration du contexte de hachage des mots de passe
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Hasher un mot de passe en clair
    
    Args:
        password (str): Mot de passe en clair
    
    Returns:
        str: Mot de passe hashé
    """
    try:
        return pwd_context.hash(password)
    except Exception as e:
        raise Exception(f"Erreur lors du hachage du mot de passe: {str(e)}")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Vérifier si un mot de passe en clair correspond au hash
    
    Args:
        plain_password (str): Mot de passe en clair
        hashed_password (str): Mot de passe hashé
    
    Returns:
        bool: True si le mot de passe correspond, False sinon
    """
    try:
        return pwd_context.verify(plain_password, hashed_password)
    except Exception as e:
        raise Exception(f"Erreur lors de la vérification du mot de passe: {str(e)}")

def create_access_token(data: Dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Créer un token JWT
    
    Args:
        data (Dict): Données à encoder dans le token (ex: {"sub": "email@example.com", "user_id": 1})
        expires_delta (Optional[timedelta]): Durée de validité personnalisée
    
    Returns:
        str: Token JWT encodé
    """
    try:
        to_encode = data.copy()
        
        # Définir l'expiration du token
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        # Ajouter l'expiration au payload
        to_encode.update({"exp": expire})
        
        # Encoder le token
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    except Exception as e:
        raise Exception(f"Erreur lors de la création du token: {str(e)}")

def decode_access_token(token: str) -> Optional[Dict]:
    """
    Décoder et vérifier un token JWT
    
    Args:
        token (str): Token JWT à décoder
    
    Returns:
        Optional[Dict]: Données décodées si le token est valide, None sinon
    """
    try:
        # Décoder le token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    
    except JWTError as e:
        # Token invalide ou expiré
        return None
    except Exception as e:
        raise Exception(f"Erreur lors du décodage du token: {str(e)}")

def get_current_user_email(token: str) -> Optional[str]:
    """
    Extraire l'email de l'utilisateur depuis le token JWT
    
    Args:
        token (str): Token JWT
    
    Returns:
        Optional[str]: Email de l'utilisateur si le token est valide, None sinon
    """
    try:
        payload = decode_access_token(token)
        if payload is None:
            return None
        
        email: str = payload.get("sub")
        return email
    
    except Exception as e:
        return None

def get_current_user_id(token: str) -> Optional[int]:
    """
    Extraire l'ID de l'utilisateur depuis le token JWT
    
    Args:
        token (str): Token JWT
    
    Returns:
        Optional[int]: ID de l'utilisateur si le token est valide, None sinon
    """
    try:
        payload = decode_access_token(token)
        if payload is None:
            return None
        
        user_id: int = payload.get("user_id")
        return user_id
    
    except Exception as e:
        return None