from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Configuration de la base de données PostgreSQL
DATABASE_URL = "postgresql://postgres:00000000@localhost:5432/optic"

engine = create_engine(
    DATABASE_URL, 
    echo=True,
    pool_pre_ping=True,
    connect_args={
        "options": "-c client_encoding=utf8"
    }
)

# Forcer UTF-8 sur CHAQUE connexion
@event.listens_for(engine, "connect")
def receive_connect(dbapi_conn, connection_record):
    cursor = dbapi_conn.cursor()
    cursor.execute("SET CLIENT_ENCODING TO 'UTF8';")
    cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Configuration JWT
SECRET_KEY = "01w4xv39Hv6fp7t7ZUnr-7i4ea66J9sr19s_My-q-bo"  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Dependency pour obtenir la session DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        db.rollback()
        raise
    finally:
        db.close()