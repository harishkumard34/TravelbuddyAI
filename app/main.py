from fastapi import FastAPI
from app.api.routes import router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TravelBuddy AI API")

# Add CORS so React frontend (port 5173) can talk to Backend (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Namma API routes-a main app kooda link pandrom
app.include_router(router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to TravelBuddy AI Agent!"}