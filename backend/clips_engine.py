import clips
from typing import List
from schemas import UserInput, Recommendation, UserProfile, NutritionalPlan, DayWorkout, ExerciseRecommendation
from sqlalchemy.orm import Session
from models import Exercise
import random

class ClipsEngine:
    def __init__(self):
        self.env = clips.Environment()
        self.env.load('clips_rules.clp')
    
    def get_recommendations(self, user_input: UserInput, db: Session) -> Recommendation:
        # Reset environment
        self.env.reset()
        
        # Assert user facts
        lesion_tipo = user_input.lesion.tipo if user_input.lesion else "ninguna"
        lesion_zona = user_input.lesion.zona if user_input.lesion else "ninguna"
        
        user_fact = f"""(usuario 
            (nombre "{user_input.nombre}")
            (edad {user_input.edad})
            (sexo {user_input.sexo})
            (peso {user_input.peso})
            (altura {user_input.altura})
            (nivel {user_input.nivel_fitness})
            (objetivo {user_input.objetivo})
            (frecuencia {user_input.frecuencia_semanal})
            (equipamiento {user_input.acceso_equipamiento})
            (lesiones "{lesion_tipo}:{lesion_zona}"))"""
        
        # Initialize results
        results_fact = """(resultados 
            (imc 0.0) 
            (tmb 0.0) 
            (calorias 0) 
            (proteinas 0) 
            (carbohidratos 0) 
            (grasas 0) 
            (agua 0.0) 
            (sueno 0) 
            (comidas 0) 
            (imc-categoria ""))"""
        
        self.env.assert_string(user_fact)
        self.env.assert_string(results_fact)
        
        # Run rules
        self.env.run()
        
        # Extract results
        resultados = None
        for fact in self.env.facts():
            if fact.template.name == 'resultados':
                resultados = fact
                break
        
        # Extract consejos
        consejos = []
        for fact in self.env.facts():
            if fact.template.name == 'consejo':
                consejos.append(fact['mensaje'])
        
        # Extract plan info
        plan_info = None
        for fact in self.env.facts():
            if fact.template.name == 'plan-entrenamiento':
                plan_info = fact
                break
        
        # Build user profile
        perfil = UserProfile(
            nombre=user_input.nombre,
            imc=round(float(resultados['imc']), 1),
            imc_categoria=resultados['imc-categoria'],
            nivel=user_input.nivel_fitness.capitalize(),
            frecuencia=f"{user_input.frecuencia_semanal}x",
            objetivo=self._format_objetivo(user_input.objetivo)
        )
        
        # Build nutritional plan
        plan_nutricional = NutritionalPlan(
            calorias_diarias=int(resultados['calorias']),
            agua_diaria=round(float(resultados['agua']), 1),
            horas_sueno=int(resultados['sueno']),
            comidas=int(resultados['comidas']),
            proteinas=int(resultados['proteinas']),
            carbohidratos=int(resultados['carbohidratos']),
            grasas=int(resultados['grasas'])
        )
        
        # Build workout plan
        lesion_info = None
        if user_input.lesion and user_input.lesion.tipo and user_input.lesion.tipo != "ninguna":
            lesion_info = {
                'tipo': user_input.lesion.tipo,
                'zona': user_input.lesion.zona
            }
        
        plan_entrenamiento = self._generate_workout_plan(
            user_input, 
            plan_info['tipo-split'] if plan_info else "Full Body",
            db,
            lesion_info
        )
        
        return Recommendation(
            perfil=perfil,
            plan_nutricional=plan_nutricional,
            plan_entrenamiento=plan_entrenamiento,
            consejos=consejos
        )
    
    def _format_objetivo(self, objetivo: str) -> str:
        mapping = {
            "ganar_musculo": "Ganar Músculo",
            "perder_grasa": "Perder Grasa",
            "mantenimiento": "Mantenimiento"
        }
        return mapping.get(objetivo, objetivo)
    
    def _generate_workout_plan(self, user_input: UserInput, split_type: str, db: Session, lesion_info: dict = None) -> List[DayWorkout]:
        equipment_map = {
            "gimnasio_completo": "gym",
            "peso_corporal": "bodyweight",
            "entrenamiento_casa": "home"
        }
        equipment = equipment_map.get(user_input.acceso_equipamiento, "gym")
        
        # Get exercises from database
        # Para entrenamiento_casa, incluir tanto "home" como "bodyweight"
        if equipment == "home":
            exercises = db.query(Exercise).filter(
                Exercise.equipment.in_(["home", "bodyweight"])
            ).all()
        else:
            exercises = db.query(Exercise).filter(
                Exercise.equipment.in_([equipment, "bodyweight"])
            ).all()
        
        if split_type == "Full Body":
            return self._generate_full_body(exercises, user_input.frecuencia_semanal, user_input.nivel_fitness, lesion_info, equipment)
        elif split_type == "Upper/Lower":
            return self._generate_upper_lower(exercises, user_input.nivel_fitness, lesion_info, equipment)
        else:  # Push/Pull/Legs
            return self._generate_ppl(exercises, user_input.frecuencia_semanal, user_input.nivel_fitness, lesion_info, equipment)
    
    def _generate_full_body(self, exercises: List[Exercise], freq: int, nivel: str, lesion_info: dict = None, equipment: str = "gym") -> List[DayWorkout]:
        workouts = []
        muscle_groups = ["pecho", "espalda", "piernas", "hombros", "brazos", "core"]
        global_used_exercises = set()
        
        for i in range(min(freq, 3)):
            selected = []
            day_used = set()
            
            # Para cada grupo muscular, seleccionar 1 ejercicio
            for group in muscle_groups:
                group_exercises = [e for e in exercises if e.muscle_group == group and e.name not in global_used_exercises and e.name not in day_used]
                
                if group_exercises:
                    # Mezclar aleatoriamente para mayor variedad
                    random.shuffle(group_exercises)
                    # Seleccionar 1 ejercicio
                    ex = group_exercises.pop(0)
                    day_used.add(ex.name)
                    global_used_exercises.add(ex.name)
                    selected.append(self._create_exercise_rec(ex, nivel, group, lesion_info, equipment))
            
            workouts.append(DayWorkout(
                dia=f"Día {i+1}",
                tipo="Full Body - Fuerza",
                ejercicios=selected
            ))
        
        return workouts
    
    def _generate_upper_lower(self, exercises: List[Exercise], nivel: str, lesion_info: dict = None, equipment: str = "gym") -> List[DayWorkout]:
        workouts = []
        used_exercises = set()
        
        # Upper 1
        upper_groups = ["pecho", "espalda", "hombros", "brazos"]
        upper1 = []
        for group in upper_groups:
            group_exercises = [e for e in exercises if e.muscle_group == group and e.name not in used_exercises]
            if group_exercises:
                # Mezclar aleatoriamente para mayor variedad
                random.shuffle(group_exercises)
                # Seleccionar 1-2 ejercicios (aleatorio entre 1 y 2)
                num_exercises = random.randint(1, min(2, len(group_exercises)))
                for _ in range(num_exercises):
                    if group_exercises:
                        ex = group_exercises.pop(0)
                        used_exercises.add(ex.name)
                        upper1.append(self._create_exercise_rec(ex, nivel, group, lesion_info, equipment))
        
        workouts.append(DayWorkout(
            dia="Día 1",
            tipo="Upper Body - Fuerza",
            ejercicios=upper1
        ))
        
        # Lower 1
        lower_groups = ["piernas", "core"]
        lower1 = []
        for group in lower_groups:
            group_exercises = [e for e in exercises if e.muscle_group == group and e.name not in used_exercises]
            if group_exercises:
                # Mezclar aleatoriamente
                random.shuffle(group_exercises)
                # Seleccionar 1-2 ejercicios
                num_exercises = random.randint(1, min(2, len(group_exercises)))
                for _ in range(num_exercises):
                    if group_exercises:
                        ex = group_exercises.pop(0)
                        used_exercises.add(ex.name)
                        lower1.append(self._create_exercise_rec(ex, nivel, group, lesion_info, equipment))
        
        workouts.append(DayWorkout(
            dia="Día 2",
            tipo="Lower Body - Fuerza",
            ejercicios=lower1
        ))
        
        # Upper 2
        upper2 = []
        for group in upper_groups:
            group_exercises = [e for e in exercises if e.muscle_group == group and e.name not in used_exercises]
            if group_exercises:
                # Mezclar aleatoriamente
                random.shuffle(group_exercises)
                # Seleccionar 1-2 ejercicios
                num_exercises = random.randint(1, min(2, len(group_exercises)))
                for _ in range(num_exercises):
                    if group_exercises:
                        ex = group_exercises.pop(0)
                        used_exercises.add(ex.name)
                        upper2.append(self._create_exercise_rec(ex, nivel, group, lesion_info, equipment))
        
        workouts.append(DayWorkout(
            dia="Día 3",
            tipo="Upper Body - Hipertrofia",
            ejercicios=upper2
        ))
        
        # Lower 2
        lower2 = []
        for group in lower_groups:
            group_exercises = [e for e in exercises if e.muscle_group == group and e.name not in used_exercises]
            if group_exercises:
                # Mezclar aleatoriamente
                random.shuffle(group_exercises)
                # Seleccionar 1-2 ejercicios
                num_exercises = random.randint(1, min(2, len(group_exercises)))
                for _ in range(num_exercises):
                    if group_exercises:
                        ex = group_exercises.pop(0)
                        used_exercises.add(ex.name)
                        lower2.append(self._create_exercise_rec(ex, nivel, group, lesion_info, equipment))
        
        workouts.append(DayWorkout(
            dia="Día 4",
            tipo="Lower Body - Hipertrofia",
            ejercicios=lower2
        ))
        
        return workouts
    
    def _generate_ppl(self, exercises: List[Exercise], freq: int, nivel: str, lesion_info: dict = None, equipment: str = "gym") -> List[DayWorkout]:
        workouts = []
        # Usar un set global para evitar repetir ejercicios en toda la rutina
        global_used_exercises = set()
        
        # Calcular cuántos ciclos necesitamos
        num_cycles = (freq + 2) // 3  # Redondear hacia arriba
        
        for cycle in range(num_cycles):
            day_offset = cycle * 3
            
            # Push (Pecho, Hombros, Tríceps)
            push = []
            day_used = set()
            
            # 2-3 ejercicios de pecho
            pecho_exercises = [e for e in exercises if e.muscle_group == "pecho" and e.name not in global_used_exercises and e.name not in day_used]
            if pecho_exercises:
                random.shuffle(pecho_exercises)
                num_pecho = random.randint(2, min(3, len(pecho_exercises)))
                for _ in range(num_pecho):
                    if pecho_exercises:
                        ex = pecho_exercises.pop(0)
                        day_used.add(ex.name)
                        global_used_exercises.add(ex.name)
                        push.append(self._create_exercise_rec(ex, nivel, "pecho", lesion_info, equipment))
            
            # 1-2 ejercicios de hombros
            hombros_exercises = [e for e in exercises if e.muscle_group == "hombros" and e.name not in global_used_exercises and e.name not in day_used]
            if hombros_exercises:
                random.shuffle(hombros_exercises)
                num_hombros = random.randint(1, min(2, len(hombros_exercises)))
                for _ in range(num_hombros):
                    if hombros_exercises:
                        ex = hombros_exercises.pop(0)
                        day_used.add(ex.name)
                        global_used_exercises.add(ex.name)
                        push.append(self._create_exercise_rec(ex, nivel, "hombros", lesion_info, equipment))
            
            # 1-2 ejercicios de tríceps (de brazos)
            tricep_exercises = [e for e in exercises if e.muscle_group == "brazos" and e.name not in global_used_exercises and e.name not in day_used and ("tricep" in e.name.lower() or "fond" in e.name.lower() or "cerrad" in e.name.lower() or "extensión" in e.name.lower())]
            if not tricep_exercises:
                tricep_exercises = [e for e in exercises if e.muscle_group == "brazos" and e.name not in global_used_exercises and e.name not in day_used]
            if tricep_exercises:
                random.shuffle(tricep_exercises)
                num_tricep = random.randint(1, min(2, len(tricep_exercises)))
                for _ in range(num_tricep):
                    if tricep_exercises:
                        ex = tricep_exercises.pop(0)
                        day_used.add(ex.name)
                        global_used_exercises.add(ex.name)
                        push.append(self._create_exercise_rec(ex, nivel, "brazos", lesion_info, equipment))
            
            if len(workouts) < freq:
                workouts.append(DayWorkout(
                    dia=f"Día {len(workouts) + 1}",
                    tipo="Push - Empuje",
                    ejercicios=push
                ))
            
            # Pull (Espalda, Bíceps)
            day_used_pull = set()
            pull_exercises = [e for e in exercises if e.muscle_group == "espalda" and e.name not in global_used_exercises]
            pull = []
            
            # 2-3 ejercicios de espalda
            if pull_exercises:
                random.shuffle(pull_exercises)
                num_espalda = random.randint(2, min(3, len(pull_exercises)))
                for _ in range(num_espalda):
                    if pull_exercises:
                        ex = pull_exercises.pop(0)
                        day_used_pull.add(ex.name)
                        global_used_exercises.add(ex.name)
                        pull.append(self._create_exercise_rec(ex, nivel, "espalda", lesion_info, equipment))
            
            # 1-2 ejercicios de bíceps
            biceps_exercises = [e for e in exercises if e.muscle_group == "brazos" and e.name not in global_used_exercises and e.name not in day_used_pull and ("curl" in e.name.lower() or "bíceps" in e.name.lower() or "biceps" in e.name.lower())]
            if not biceps_exercises:
                biceps_exercises = [e for e in exercises if e.muscle_group == "brazos" and e.name not in global_used_exercises and e.name not in day_used_pull]
            if biceps_exercises:
                random.shuffle(biceps_exercises)
                num_biceps = random.randint(1, min(2, len(biceps_exercises)))
                for _ in range(num_biceps):
                    if biceps_exercises:
                        ex = biceps_exercises.pop(0)
                        day_used_pull.add(ex.name)
                        global_used_exercises.add(ex.name)
                        pull.append(self._create_exercise_rec(ex, nivel, "brazos", lesion_info, equipment))
            
            if len(workouts) < freq:
                workouts.append(DayWorkout(
                    dia=f"Día {len(workouts) + 1}",
                    tipo="Pull - Tirón",
                    ejercicios=pull
                ))
            
            # Legs
            day_used_legs = set()
            leg_exercises = [e for e in exercises if e.muscle_group == "piernas" and e.name not in global_used_exercises]
            core_exercises = [e for e in exercises if e.muscle_group == "core" and e.name not in global_used_exercises]
            legs = []
            
            # 2-3 ejercicios de piernas
            if leg_exercises:
                random.shuffle(leg_exercises)
                num_piernas = random.randint(2, min(3, len(leg_exercises)))
                for _ in range(num_piernas):
                    if leg_exercises:
                        ex = leg_exercises.pop(0)
                        day_used_legs.add(ex.name)
                        global_used_exercises.add(ex.name)
                        legs.append(self._create_exercise_rec(ex, nivel, "piernas", lesion_info, equipment))
            
            # 1 ejercicio de core
            if core_exercises:
                random.shuffle(core_exercises)
                if core_exercises:
                    ex = core_exercises.pop(0)
                    day_used_legs.add(ex.name)
                    global_used_exercises.add(ex.name)
                    legs.append(self._create_exercise_rec(ex, nivel, "core", lesion_info, equipment))
            
            if len(workouts) < freq:
                workouts.append(DayWorkout(
                    dia=f"Día {len(workouts) + 1}",
                    tipo="Legs - Piernas",
                    ejercicios=legs
                ))
        
        return workouts
    
    def _create_exercise_rec(self, exercise: Exercise, nivel: str, group: str, lesion_info: dict = None, equipment: str = "gym") -> ExerciseRecommendation:
        # Determine sets and reps based on level
        is_bodyweight = exercise.equipment in ["bodyweight", "home"]
        
        if nivel == "novato":
            sets = 3
            reps = "12-15" if is_bodyweight else "8-12"
            rest = "90 seg" if is_bodyweight else "2 min"
        elif nivel == "intermedio":
            if is_bodyweight:
                sets = 4
                reps = "18-25" if group not in ["pecho", "espalda", "piernas"] else "15-22"
                rest = "90 seg"
            else:
                sets = 4
                reps = "6-10" if group in ["pecho", "espalda", "piernas"] else "8-12"
                rest = "2 min"
        else:  # avanzado
            if is_bodyweight:
                sets = 5
                reps = "25-35" if group not in ["pecho", "espalda", "piernas"] else "20-30"
                rest = "60-90 seg"
            else:
                sets = 4
                reps = "5-8" if group in ["pecho", "espalda", "piernas"] else "8-12"
                rest = "2-3 min"
        
        # Handle injury notes
        notas = None
        if lesion_info and lesion_info.get('zona'):
            zona = lesion_info['zona']
            tipo = lesion_info['tipo']
            
            # Mapeo de zonas a grupos musculares afectados
            zona_grupos = {
                # Músculos específicos
                'biceps': ['brazos'],
                'triceps': ['brazos', 'pecho'],
                'pectoral': ['pecho'],
                'dorsales': ['espalda'],
                'deltoides': ['hombros', 'pecho'],
                'cuadriceps': ['piernas'],
                'femorales': ['piernas'],
                'gemelos': ['piernas'],
                # Articulaciones
                'hombro': ['pecho', 'hombros', 'brazos'],
                'rodilla': ['piernas'],
                'espalda_baja': ['espalda', 'piernas', 'core'],
                'codo': ['brazos', 'pecho', 'espalda'],
                'muneca': ['brazos', 'pecho'],
                'tobillo': ['piernas'],
                'cadera': ['piernas', 'core']
            }
            
            affected_groups = zona_grupos.get(zona, [])
            if group in affected_groups:
                if tipo in ['lesion', 'quiebre', 'fisura', 'desgarro']:
                    notas = f"⚠️ EVITAR - {tipo.upper()} en {zona.replace('_', ' ')}. Omitir este ejercicio"
                elif tipo == 'molestia':
                    notas = f"⚠️ Reducir peso significativamente - molestia en {zona.replace('_', ' ')}"
                elif tipo == 'dolor':
                    notas = f"⚠️ Peso nulo o muy ligero - recuperación activa por dolor en {zona.replace('_', ' ')}"
        
        return ExerciseRecommendation(
            ejercicio=exercise.name,
            series=sets,
            reps=reps,
            descanso=rest,
            notas=notas
        )

