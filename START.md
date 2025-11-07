# 🚀 Guía de Inicio Rápido

## Paso 1: Instalar Dependencias del Backend

Abre una terminal y ejecuta:

```bash
cd backend
pip install -r requirements.txt
```

## Paso 2: Iniciar el Backend

En la misma terminal del backend:

```bash
uvicorn main:app --reload
```

Deberías ver:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

✅ El backend está corriendo en `http://localhost:8000`

## Paso 3: Instalar Dependencias del Frontend

Abre una **NUEVA** terminal y ejecuta:

```bash
cd frontend
npm install
```

## Paso 4: Iniciar el Frontend

En la terminal del frontend:

```bash
npm run dev
```

Deberías ver:
```
  VITE ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

✅ El frontend está corriendo en `http://localhost:5173`

## Paso 5: ¡Usar la Aplicación!

1. Abre tu navegador en `http://localhost:5173`
2. Completa el formulario con tus datos
3. Haz clic en "Obtener Recomendaciones"
4. ¡Disfruta de tus recomendaciones personalizadas!

## 📌 Comandos Útiles

### Backend
- Ver documentación API: `http://localhost:8000/docs`
- Detener servidor: `Ctrl + C`

### Frontend
- Ver en el navegador: `http://localhost:5173`
- Detener servidor: `Ctrl + C`
- Build producción: `npm run build`

## ⚠️ Solución de Problemas

### Error: clipspy no se instala
```bash
pip install clipspy==1.0.3
```

### Error: Puerto en uso
Cambia el puerto en `backend/main.py` o `frontend/vite.config.ts`

### Error: CORS
Verifica que el backend esté corriendo antes de iniciar el frontend

