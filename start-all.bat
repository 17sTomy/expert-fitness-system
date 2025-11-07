@echo off
echo ===================================
echo   Sistema Experto de Fitness
echo ===================================
echo.
echo Iniciando Backend y Frontend...
echo.

start "Backend - Fitness Expert" cmd /k "cd backend && pip install -r requirements.txt && uvicorn main:app --reload"

timeout /t 5 /nobreak >nul

start "Frontend - Fitness Expert" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ===================================
echo Aplicacion iniciada!
echo ===================================
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Cierra las ventanas del CMD para detener los servidores
echo.
pause

