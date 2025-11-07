from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from models import get_db, init_db
from schemas import UserInput, Recommendation
from clips_engine import ClipsEngine

app = FastAPI(title="Fitness Expert System API")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/")
def root():
    return {"message": "Fitness Expert System API"}

@app.post("/api/recommendations", response_model=Recommendation)
def get_recommendations(user_input: UserInput, db: Session = Depends(get_db)):
    try:
        engine = ClipsEngine()
        recommendations = engine.get_recommendations(user_input, db)
        return recommendations
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "healthy"}



