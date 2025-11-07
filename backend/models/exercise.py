from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Exercise(Base):
    __tablename__ = "exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    muscle_group = Column(String, nullable=False)
    equipment = Column(String, nullable=False)  # gym, bodyweight, home
    difficulty = Column(String, nullable=False)  # beginner, intermediate, advanced
    description = Column(String, nullable=True)

