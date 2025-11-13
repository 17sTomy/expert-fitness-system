import os
from models.exercise import Exercise
from .database import engine, SessionLocal, Base

def init_db():
    # Crear directorio si no existe (para Docker)
    db_path = str(engine.url).replace("sqlite:///", "")
    if "/" in db_path:
        db_dir = "/".join(db_path.split("/")[:-1])
        if db_dir and not os.path.exists(db_dir):
            os.makedirs(db_dir, exist_ok=True)
    
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if exercises already exist
    if db.query(Exercise).first():
        db.close()
        return
    
    # Seed exercises
    exercises = [
        # Pecho - Gym
        Exercise(name="Press de Banca", muscle_group="pecho", equipment="gym", difficulty="intermediate", description="Press con barra"),
        Exercise(name="Press de Banca con Mancuernas", muscle_group="pecho", equipment="gym", difficulty="intermediate", description="Press con mancuernas"),
        Exercise(name="Press Inclinado con Barra", muscle_group="pecho", equipment="gym", difficulty="intermediate", description="Press inclinado"),
        Exercise(name="Aperturas con Mancuernas", muscle_group="pecho", equipment="gym", difficulty="beginner", description="Chest flyes"),
        # Pecho - Peso Corporal/Casa
        Exercise(name="Flexiones", muscle_group="pecho", equipment="bodyweight", difficulty="beginner", description="Flexiones de brazos"),
        Exercise(name="Flexiones Diamante", muscle_group="pecho", equipment="bodyweight", difficulty="intermediate", description="Diamond push-ups"),
        Exercise(name="Flexiones Inclinadas", muscle_group="pecho", equipment="bodyweight", difficulty="beginner", description="Incline push-ups"),
        Exercise(name="Flexiones Declinadas", muscle_group="pecho", equipment="bodyweight", difficulty="advanced", description="Decline push-ups"),
        Exercise(name="Flexiones con Palmada", muscle_group="pecho", equipment="bodyweight", difficulty="advanced", description="Plyometric push-ups"),
        Exercise(name="Flexiones Arquero", muscle_group="pecho", equipment="bodyweight", difficulty="intermediate", description="Archer push-ups"),
        
        # Espalda - Gym
        Exercise(name="Remo con Barra", muscle_group="espalda", equipment="gym", difficulty="intermediate", description="Remo horizontal"),
        Exercise(name="Remo con Mancuernas", muscle_group="espalda", equipment="gym", difficulty="intermediate", description="Dumbbell row"),
        Exercise(name="Dominadas", muscle_group="espalda", equipment="gym", difficulty="advanced", description="Pull-ups"),
        Exercise(name="Peso Muerto", muscle_group="espalda", equipment="gym", difficulty="advanced", description="Deadlift"),
        Exercise(name="Jalones al Pecho", muscle_group="espalda", equipment="gym", difficulty="beginner", description="Lat pulldown"),
        Exercise(name="Remo T", muscle_group="espalda", equipment="gym", difficulty="intermediate", description="T-bar row"),
        # Espalda - Peso Corporal/Casa
        Exercise(name="Dominadas en Barra", muscle_group="espalda", equipment="bodyweight", difficulty="advanced", description="Pull-ups en barra"),
        Exercise(name="Dominadas Asistidas", muscle_group="espalda", equipment="bodyweight", difficulty="intermediate", description="Assisted pull-ups"),
        Exercise(name="Remo Invertido", muscle_group="espalda", equipment="bodyweight", difficulty="beginner", description="Inverted row"),
        Exercise(name="Superman", muscle_group="espalda", equipment="bodyweight", difficulty="beginner", description="Superman exercise"),
        Exercise(name="Remo con Silla", muscle_group="espalda", equipment="home", difficulty="beginner", description="Chair row"),
        Exercise(name="Remo con Toalla", muscle_group="espalda", equipment="home", difficulty="intermediate", description="Towel row"),
        
        # Piernas - Gym
        Exercise(name="Sentadillas", muscle_group="piernas", equipment="gym", difficulty="intermediate", description="Squats con barra"),
        Exercise(name="Peso muerto Rumano", muscle_group="piernas", equipment="gym", difficulty="intermediate", description="Romanian Deadlift"),
        Exercise(name="Sentadillas con Mancuernas", muscle_group="piernas", equipment="gym", difficulty="intermediate", description="Goblet squats"),
        Exercise(name="Prensa", muscle_group="piernas", equipment="gym", difficulty="beginner", description="Leg press"),
        Exercise(name="Sentadillas Búlgara", muscle_group="piernas", equipment="gym", difficulty="intermediate", description="Bulgarian split squat"),
        Exercise(name="Zancadas", muscle_group="piernas", equipment="gym", difficulty="intermediate", description="Lunges"),
        Exercise(name="Extensiones de Cuádriceps", muscle_group="piernas", equipment="gym", difficulty="beginner", description="Leg extension"),
        Exercise(name="Curl de Femoral", muscle_group="piernas", equipment="gym", difficulty="beginner", description="Leg curl"),
        # Piernas - Peso Corporal/Casa
        Exercise(name="Sentadillas al Aire", muscle_group="piernas", equipment="bodyweight", difficulty="beginner", description="Bodyweight squats"),
        Exercise(name="Pistol Squats", muscle_group="piernas", equipment="bodyweight", difficulty="advanced", description="Single leg squats"),
        Exercise(name="Sentadillas con Salto", muscle_group="piernas", equipment="bodyweight", difficulty="intermediate", description="Jump squats"),
        Exercise(name="Zancadas al Aire", muscle_group="piernas", equipment="bodyweight", difficulty="beginner", description="Bodyweight lunges"),
        Exercise(name="Sentadillas Búlgara al Aire", muscle_group="piernas", equipment="bodyweight", difficulty="intermediate", description="Bulgarian split squat sin peso"),
        Exercise(name="Sentadillas Sumo", muscle_group="piernas", equipment="bodyweight", difficulty="beginner", description="Sumo squats"),
        Exercise(name="Elevación de Talones", muscle_group="piernas", equipment="bodyweight", difficulty="beginner", description="Calf raises"),
        Exercise(name="Curl Nórdico", muscle_group="piernas", equipment="bodyweight", difficulty="advanced", description="Nordic curl"),
        Exercise(name="Wall Sit", muscle_group="piernas", equipment="bodyweight", difficulty="intermediate", description="Isometric wall sit"),
        
        # Hombros - Gym
        Exercise(name="Press Militar", muscle_group="hombros", equipment="gym", difficulty="intermediate", description="Military press"),
        Exercise(name="Elevaciones Laterales", muscle_group="hombros", equipment="gym", difficulty="beginner", description="Lateral raises"),
        Exercise(name="Press con Mancuernas", muscle_group="hombros", equipment="gym", difficulty="beginner", description="Dumbbell press"),
        Exercise(name="Face Pulls", muscle_group="hombros", equipment="gym", difficulty="beginner", description="Face pulls"),
        Exercise(name="Elevaciones Frontales", muscle_group="hombros", equipment="gym", difficulty="beginner", description="Front raises"),
        # Hombros - Peso Corporal/Casa
        Exercise(name="Flexiones Pino", muscle_group="hombros", equipment="bodyweight", difficulty="advanced", description="Handstand push-ups"),
        Exercise(name="Flexiones Pike", muscle_group="hombros", equipment="bodyweight", difficulty="intermediate", description="Pike push-ups"),
        Exercise(name="Elevaciones Laterales con Botellas", muscle_group="hombros", equipment="home", difficulty="beginner", description="Lateral raises con peso casero"),
        Exercise(name="Plancha Lateral", muscle_group="hombros", equipment="bodyweight", difficulty="intermediate", description="Side plank"),
        
        # Brazos - Gym
        Exercise(name="Curl con Barra", muscle_group="brazos", equipment="gym", difficulty="beginner", description="Barbell curl"),
        Exercise(name="Curl con Mancuernas", muscle_group="brazos", equipment="gym", difficulty="beginner", description="Dumbbell curl"),
        Exercise(name="Extensiones de Tríceps", muscle_group="brazos", equipment="gym", difficulty="beginner", description="Tricep extensions"),
        Exercise(name="Curl Martillo", muscle_group="brazos", equipment="gym", difficulty="beginner", description="Hammer curl"),
        Exercise(name="Curl Concentrado", muscle_group="brazos", equipment="gym", difficulty="beginner", description="Concentration curl"),
        # Brazos - Peso Corporal/Casa
        Exercise(name="Fondos", muscle_group="brazos", equipment="bodyweight", difficulty="intermediate", description="Dips"),
        Exercise(name="Fondos con Sillas", muscle_group="brazos", equipment="home", difficulty="intermediate", description="Chair dips"),
        Exercise(name="Flexiones Cerradas", muscle_group="brazos", equipment="bodyweight", difficulty="intermediate", description="Close grip push-ups"),
        Exercise(name="Curl con Toalla", muscle_group="brazos", equipment="home", difficulty="beginner", description="Towel curl"),
        Exercise(name="Extensiones de Tríceps con Silla", muscle_group="brazos", equipment="home", difficulty="beginner", description="Tricep dips con silla"),
        Exercise(name="Flexiones de Tríceps", muscle_group="brazos", equipment="bodyweight", difficulty="intermediate", description="Tricep push-ups"),
        Exercise(name="Curl Isométrico", muscle_group="brazos", equipment="bodyweight", difficulty="intermediate", description="Isometric bicep hold"),
        
        # Core - Gym
        Exercise(name="Rueda Abdominal", muscle_group="core", equipment="home", difficulty="advanced", description="Ab wheel"),
        # Core - Peso Corporal/Casa
        Exercise(name="Plancha", muscle_group="core", equipment="bodyweight", difficulty="beginner", description="Plank"),
        Exercise(name="Plancha Lateral", muscle_group="core", equipment="bodyweight", difficulty="intermediate", description="Side plank"),
        Exercise(name="Crunches", muscle_group="core", equipment="bodyweight", difficulty="beginner", description="Abdominales"),
        Exercise(name="Elevación de Piernas", muscle_group="core", equipment="bodyweight", difficulty="intermediate", description="Leg raises"),
        Exercise(name="Mountain Climbers", muscle_group="core", equipment="bodyweight", difficulty="intermediate", description="Escaladores"),
        Exercise(name="Russian Twist", muscle_group="core", equipment="bodyweight", difficulty="intermediate", description="Giros rusos"),
        Exercise(name="Bicicleta", muscle_group="core", equipment="bodyweight", difficulty="beginner", description="Bicycle crunches"),
        Exercise(name="Plancha con Elevación de Pierna", muscle_group="core", equipment="bodyweight", difficulty="intermediate", description="Plank leg raise"),
        Exercise(name="V-Ups", muscle_group="core", equipment="bodyweight", difficulty="advanced", description="V-sit ups"),
        Exercise(name="L-Sit", muscle_group="core", equipment="bodyweight", difficulty="advanced", description="L-sit hold"),
    ]
    
    db.add_all(exercises)
    db.commit()
    db.close()

