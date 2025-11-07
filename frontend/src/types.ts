export interface LesionInfo {
  tipo?: string;
  zona?: string;
}

export interface UserInput {
  nombre: string;
  edad: number;
  sexo: string;
  peso: number;
  altura: number;
  nivel_fitness: string;
  objetivo: string;
  frecuencia_semanal: number;
  acceso_equipamiento: string;
  lesion?: LesionInfo;
}

export interface ExerciseRecommendation {
  ejercicio: string;
  series: number;
  reps: string;
  descanso: string;
  notas?: string;
}

export interface DayWorkout {
  dia: string;
  tipo: string;
  ejercicios: ExerciseRecommendation[];
}

export interface NutritionalPlan {
  calorias_diarias: number;
  agua_diaria: number;
  horas_sueno: number;
  comidas: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

export interface UserProfile {
  nombre: string;
  imc: number;
  imc_categoria: string;
  nivel: string;
  frecuencia: string;
  objetivo: string;
}

export interface Recommendation {
  perfil: UserProfile;
  plan_nutricional: NutritionalPlan;
  plan_entrenamiento: DayWorkout[];
  consejos: string[];
}

