@echo off
echo ===================================
echo   Iniciando Frontend - Fitness Expert
echo ===================================
echo.

cd frontend

echo Instalando dependencias...
call npm install

echo.
echo Iniciando servidor de desarrollo...
echo Frontend disponible en: http://localhost:5173
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

call npm run dev


