# 🐳 Docker Setup - Fitness Expert System

## Requisitos Previos

- Docker Desktop instalado y corriendo
- Docker Compose (incluido en Docker Desktop)

## 🚀 Inicio Rápido

### Opción 1: Levantar todo con Docker Compose

```bash
# Construir y levantar todos los servicios
docker-compose up --build

# O en modo detached (background)
docker-compose up -d --build
```

Esto levantará:
- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs

### Opción 2: Solo un servicio

```bash
# Solo backend
docker-compose up backend

# Solo frontend
docker-compose up frontend
```

## 📋 Comandos Útiles

### Ver logs
```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend
```

### Detener servicios
```bash
# Detener y remover contenedores
docker-compose down

# Detener y remover contenedores + volúmenes
docker-compose down -v
```

### Reconstruir después de cambios
```bash
# Reconstruir sin cache
docker-compose build --no-cache

# Reconstruir y levantar
docker-compose up --build
```

### Acceder al contenedor
```bash
# Backend
docker-compose exec backend bash

# Frontend
docker-compose exec frontend sh
```

## 🔧 Configuración

### Variables de Entorno

Puedes crear un archivo `.env` en la raíz del proyecto:

```env
# Backend
DATABASE_URL=sqlite:///./data/fitness_expert.db
API_HOST=0.0.0.0
API_PORT=8000

# Frontend
VITE_API_URL=http://localhost:8000
```

### Cambiar Puertos

Edita `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "8001:8000"  # Cambiar 8001 por el puerto deseado
  
  frontend:
    ports:
      - "3001:80"  # Cambiar 3001 por el puerto deseado
```

## 🐛 Troubleshooting

### El backend no inicia
```bash
# Ver logs del backend
docker-compose logs backend

# Reconstruir backend
docker-compose build --no-cache backend
docker-compose up backend
```

### El frontend no se conecta al backend
- Verifica que el backend esté corriendo: `docker-compose ps`
- Verifica la variable `VITE_API_URL` en el frontend
- Asegúrate de que ambos servicios estén en la misma red Docker

### Limpiar todo y empezar de nuevo
```bash
# Detener y remover todo
docker-compose down -v

# Limpiar imágenes
docker system prune -a

# Reconstruir desde cero
docker-compose up --build
```

## 📦 Estructura

```
fitness-expert-system/
├── docker-compose.yml      # Orquestación de servicios
├── backend/
│   ├── Dockerfile          # Imagen del backend
│   └── .dockerignore
├── frontend/
│   ├── Dockerfile          # Imagen del frontend
│   ├── nginx.conf          # Configuración Nginx
│   └── .dockerignore
└── .dockerignore             # Ignorar archivos globales
```

## 🎯 Desarrollo vs Producción

### Desarrollo
- Los volúmenes montan el código local para hot-reload
- Cambios se reflejan automáticamente

### Producción
- Usa imágenes optimizadas
- Frontend servido por Nginx
- Backend con Gunicorn (recomendado para producción)

## ⚡ Optimizaciones

Para producción, considera:
1. Usar Gunicorn + Uvicorn workers en backend
2. Habilitar compresión gzip en Nginx
3. Usar variables de entorno para configuración
4. Implementar health checks más robustos


