import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.exercise import Base

# Database setup
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./fitness_expert.db")
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Export Base for use in seed.py
__all__ = ["engine", "SessionLocal", "get_db", "Base"]

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

