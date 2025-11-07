from pydantic import BaseModel, Field
from typing import Optional, List

class LesionInfo(BaseModel):
    tipo: Optional[str] = None  # lesion, quiebre, fisura, desgarro, molestia, dolor, ninguna
    zona: Optional[str] = None  # hombro, rodilla, espalda_baja, codo, muneca, tobillo, etc.

class UserInput(BaseModel):
    nombre: str
    edad: int = Field(gt=0, lt=120)
    sexo: str  # masculino, femenino
    peso: float = Field(gt=0)  # kg
    altura: float = Field(gt=0)  # cm
    nivel_fitness: str  # novato, intermedio, avanzado
    objetivo: str  # ganar_musculo, perder_grasa, mantenimiento
    frecuencia_semanal: int = Field(gt=0, le=7)  # días por semana
    acceso_equipamiento: str  # gimnasio_completo, peso_corporal, entrenamiento_casa
    lesion: Optional[LesionInfo] = None

class ExerciseRecommendation(BaseModel):
    ejercicio: str
    series: int
    reps: str
    descanso: str
    notas: Optional[str] = None

class DayWorkout(BaseModel):
    dia: str
    tipo: str
    ejercicios: List[ExerciseRecommendation]

class NutritionalPlan(BaseModel):
    calorias_diarias: int
    agua_diaria: float  # litros
    horas_sueno: int
    comidas: int
    proteinas: int  # gramos
    carbohidratos: int  # gramos
    grasas: int  # gramos

class UserProfile(BaseModel):
    nombre: str
    imc: float
    imc_categoria: str
    nivel: str
    frecuencia: str
    objetivo: str

class Recommendation(BaseModel):
    perfil: UserProfile
    plan_nutricional: NutritionalPlan
    plan_entrenamiento: List[DayWorkout]
    consejos: List[str]

