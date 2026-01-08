from sqlalchemy import Column, Integer, String, Numeric, Text
from app.config import Base

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nom = Column(String(100), nullable=False)
    prix = Column(Numeric(10, 2), nullable=False)
    stock = Column(Integer, nullable=False)
    image_url = Column(Text, nullable=True)