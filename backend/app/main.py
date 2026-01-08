from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth_router import router as auth_router
from app.routers.product_router import router as product_router
from app.routers.sale_router import router as sale_router

# Créer l'application FastAPI
app = FastAPI(
    title="API Gestion Optique",
    description="API pour la gestion d'un magasin d'optique - Produits, Ventes et Utilisateurs",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuration CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifiez les domaines autorisés
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enregistrer les routers
app.include_router(auth_router)
app.include_router(product_router)
app.include_router(sale_router)

# Route racine
@app.get("/", tags=["Root"])
def root():
    """Route de test pour vérifier que l'API fonctionne"""
    return {
        "message": "✅ API Gestion Optique - Opérationnelle",
        "version": "1.0.0",
        "documentation": "/docs",
        "endpoints": {
            "auth": "/auth",
            "products": "/products",
            "sales": "/sales"
        }
    }

# Route de santé (health check)
@app.get("/health", tags=["Health"])
def health_check():
    """Vérifier l'état de l'API"""
    return {
        "status": "healthy",
        "message": "L'API fonctionne correctement"
    }

# Point d'entrée pour exécuter l'application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )