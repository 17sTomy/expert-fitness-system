# 📁 Estructura del Proyecto

```
fitness-expert-system/
│
├── 📄 README.md                      # Documentación principal
├── 📄 START.md                       # Guía de inicio rápido
├── 📄 CLIPS_RULES_EXPLAINED.md       # Explicación del sistema de reglas
├── 📄 PROJECT_STRUCTURE.md           # Este archivo
├── 📄 .gitignore                     # Archivos ignorados por Git
│
├── 🚀 start-all.bat                  # Inicia backend y frontend (Windows)
├── 🚀 start-backend.bat              # Solo backend (Windows)
├── 🚀 start-frontend.bat             # Solo frontend (Windows)
│
├── 📂 backend/                       # Backend Python + FastAPI
│   ├── 📄 main.py                   # Aplicación FastAPI principal
│   ├── 📄 models.py                 # Modelos de base de datos
│   ├── 📄 schemas.py                # Schemas Pydantic
│   ├── 📄 clips_rules.clp           # Reglas del sistema experto
│   ├── 📄 clips_engine.py           # Motor CLIPS
│   ├── 📄 requirements.txt          # Dependencias Python
│   ├── 📄 README.md                 # Documentación del backend
│   └── 🗄️ fitness_expert.db         # Base de datos SQLite (se crea automáticamente)
│
└── 📂 frontend/                      # Frontend React + TypeScript
    ├── 📄 index.html                # HTML principal
    ├── 📄 package.json              # Dependencias Node.js
    ├── 📄 tsconfig.json             # Configuración TypeScript
    ├── 📄 vite.config.ts            # Configuración Vite
    ├── 📄 tailwind.config.js        # Configuración Tailwind
    ├── 📄 postcss.config.js         # Configuración PostCSS
    ├── 📄 README.md                 # Documentación del frontend
    │
    └── 📂 src/
        ├── 📄 main.tsx              # Punto de entrada
        ├── 📄 App.tsx               # Componente principal
        ├── 📄 index.css             # Estilos globales
        ├── 📄 types.ts              # Tipos TypeScript
        ├── 📄 api.ts                # Cliente API
        │
        └── 📂 components/
            ├── 📄 UserForm.tsx      # Formulario de entrada
            └── 📄 Results.tsx       # Pantalla de resultados
```

## 📊 Estadísticas del Proyecto

### Backend
- **Lenguaje**: Python 3.8+
- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Motor IA**: CLIPS
- **Base de datos**: SQLite
- **Archivos**: 6 archivos principales
- **Líneas de código**: ~800 líneas

### Frontend
- **Lenguaje**: TypeScript
- **Framework**: React 18
- **Build tool**: Vite
- **UI Library**: NextUI
- **Estilos**: TailwindCSS
- **Archivos**: 10 archivos principales
- **Líneas de código**: ~900 líneas

## 🔑 Archivos Clave

### Backend

#### `main.py`
- Define la API REST con FastAPI
- Endpoint principal: `POST /api/recommendations`
- Configuración CORS
- Inicialización de base de datos

#### `clips_rules.clp`
- **24 ejercicios** precargados en la base de datos
- **15+ reglas** de inferencia CLIPS
- Cálculos de IMC, TMB, calorías, macros
- Sistema de consejos personalizados

#### `clips_engine.py`
- Integración Python-CLIPS
- Generación de rutinas de entrenamiento
- Selección inteligente de ejercicios
- 3 tipos de split: Full Body, Upper/Lower, PPL

#### `models.py`
- Modelo `Exercise` con SQLAlchemy
- Base de datos con ejercicios por grupo muscular
- Seed automático de datos

### Frontend

#### `UserForm.tsx`
- Formulario completo con validación
- 10 campos de entrada
- Integración con NextUI
- Manejo de errores

#### `Results.tsx`
- 4 tarjetas de perfil (IMC, Nivel, Frecuencia, Objetivo)
- Plan nutricional con macronutrientes
- Tablas de ejercicios por día
- Sistema de consejos personalizados
- Diseño responsive y moderno

## 🎨 Características de Diseño

- ✨ Gradientes modernos (azul/púrpura)
- 🎯 Iconos SVG inline
- 📱 Diseño 100% responsive
- 🌈 Esquema de colores por categoría
- 💫 Animaciones suaves
- 🎭 Componentes NextUI

## 🔄 Flujo de Datos

```
Usuario (Frontend)
    ↓
UserForm.tsx (formulario)
    ↓
api.ts (axios POST)
    ↓
FastAPI Backend (main.py)
    ↓
ClipsEngine (clips_engine.py)
    ↓
CLIPS Rules (clips_rules.clp)
    ↓
Inferencia + Cálculos
    ↓
Database (SQLite)
    ↓
Generación de Rutina
    ↓
Response JSON
    ↓
Results.tsx (visualización)
    ↓
Usuario ve recomendaciones
```

## 📦 Dependencias

### Backend
- `fastapi` - Framework web
- `uvicorn` - Servidor ASGI
- `pydantic` - Validación de datos
- `sqlalchemy` - ORM
- `clipspy` - Motor CLIPS
- `python-multipart` - Form data

### Frontend
- `react` + `react-dom` - UI framework
- `@nextui-org/react` - Componentes UI
- `axios` - Cliente HTTP
- `framer-motion` - Animaciones
- `typescript` - Tipado estático
- `vite` - Build tool
- `tailwindcss` - Estilos

## 🚀 Scripts Disponibles

### Windows
- `start-all.bat` - Inicia todo el stack
- `start-backend.bat` - Solo backend
- `start-frontend.bat` - Solo frontend

### Manual
Backend:
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## 📈 Escalabilidad

El proyecto está diseñado para ser fácilmente escalable:

1. **Agregar ejercicios**: Modificar `models.py` (seed section)
2. **Nuevas reglas**: Editar `clips_rules.clp`
3. **Más campos**: Agregar a `schemas.py` y `types.ts`
4. **Nuevos cálculos**: Añadir reglas CLIPS
5. **Más consejos**: Crear nuevas reglas de consejo

## 🎓 Casos de Uso

- ✅ Proyecto universitario de IA
- ✅ Demostración de sistemas expertos
- ✅ Aplicación de fitness personalizada
- ✅ Base para aplicaciones más complejas
- ✅ Aprendizaje de CLIPS + FastAPI + React

