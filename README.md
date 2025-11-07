# Sistema Experto de Fitness 💪

Sistema experto que proporciona recomendaciones personalizadas de entrenamiento y nutrición basado en el perfil y objetivos del usuario.

## 🎯 Características

- **Recomendaciones personalizadas** basadas en reglas CLIPS
- **Cálculo de IMC** y categorización
- **Plan nutricional** detallado con macronutrientes
- **Rutinas de entrenamiento** adaptadas al nivel y frecuencia
- **Consejos personalizados** según objetivos y perfil
- **Interfaz moderna** con React y NextUI

## 🏗️ Arquitectura

### Backend (Python + FastAPI)
- Motor de reglas CLIPS para inferencia
- SQLite para almacenamiento de ejercicios
- API REST con FastAPI
- SQLAlchemy para ORM

### Frontend (React + TypeScript)
- Vite para desarrollo rápido
- NextUI para componentes modernos
- TailwindCSS para estilos
- Axios para comunicación con API

## 📋 Requisitos

- Python 3.8+
- Node.js 16+
- npm o yarn

## 🚀 Instalación y Ejecución

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

La API estará disponible en `http://localhost:8000`
Documentación: `http://localhost:8000/docs`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📊 Uso

1. Completa el formulario con tus datos personales:
   - Nombre, edad, sexo
   - Peso y altura
   - Nivel de fitness (novato, intermedio, avanzado)
   - Objetivo (ganar músculo, perder grasa, mantenimiento)
   - Frecuencia de entrenamiento semanal
   - Acceso a equipamiento
   - Lesiones o limitaciones (opcional)

2. Obtén tus recomendaciones:
   - Perfil con IMC calculado
   - Plan nutricional completo
   - Rutina de entrenamiento personalizada
   - Consejos específicos para tu caso

## 🧠 Sistema de Reglas CLIPS

El sistema utiliza reglas CLIPS para:
- Calcular IMC y TMB (Tasa Metabólica Basal)
- Determinar calorías según objetivo
- Calcular macronutrientes (proteínas, carbohidratos, grasas)
- Recomendar agua y horas de sueño
- Generar plan de entrenamiento (Full Body, Upper/Lower, Push/Pull/Legs)
- Proporcionar consejos personalizados

## 📁 Estructura del Proyecto

```
fitness-expert-system/
├── backend/
│   ├── main.py              # API FastAPI
│   ├── models.py            # Modelos SQLAlchemy
│   ├── schemas.py           # Schemas Pydantic
│   ├── clips_rules.clp      # Reglas del sistema experto
│   ├── clips_engine.py      # Motor CLIPS
│   └── requirements.txt     # Dependencias Python
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── App.tsx          # Componente principal
│   │   ├── api.ts           # Cliente API
│   │   └── types.ts         # Tipos TypeScript
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🎨 Capturas de Pantalla

La aplicación incluye:
- Formulario intuitivo con validación
- Vista de resultados con tarjetas informativas
- Tablas de ejercicios organizadas por día
- Diseño responsive y moderno
- Gradientes y animaciones suaves

## ⚠️ Disclaimer

Las recomendaciones son orientativas y generadas por un sistema experto educativo. Siempre consulta con un profesional de la salud antes de comenzar cualquier programa de ejercicios o dieta.

## 📝 Licencia

Este proyecto es de código abierto y está disponible para fines educativos.

