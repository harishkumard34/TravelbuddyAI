from fastapi import FastAPI
from app.api.routes import router

from fastapi.middleware.cors import CORSMiddleware

# 1. APPLICATION INITIATION: 
# Idhu thaan namma API-oda starting point (Vaasal padi). 'app' ngura variable-la FastAPI-a uruvaakurom.
app = FastAPI(title="TravelBuddy AI API")

# 2. CORS MIDDLEWARE (Security Gatekeeper):
# Frontend (React - port 5173) Backend-a (FastAPI - port 8000) thodarbu kolla try pannumbodhu, 
# Browser security kaaga block pannum. Adhai thadukka thaan indha CORS.
# allow_origins=["*"] na "Yaar venaalum indha API kitta pesalam" nu artham.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173", 
        "https://hilarious-queijadas-17a3e8.netlify.app"
    ], # Allow local dev AND production Netlify frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. ROUTER REGISTRATION:
# Namma API-oda routes (vazhigal) ellam routes.py-la irukku. 
# Adhai inga main app kooda link pandrom. '/api/v1' ngura prefix moolama routes start aagum.
app.include_router(router, prefix="/api/v1")

# 4. DEFAULT ROUTE (Health Check):
# Browser-la verum http://127.0.0.1:8000/ nu pottal indha message varum. 
# Server uyiroda irukka nu check panna idhu use aagum.
@app.get("/")
def read_root():
    return {"message": "Welcome to TravelBuddy AI Agent!"}