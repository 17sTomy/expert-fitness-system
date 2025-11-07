@echo off
echo ===================================
echo   Iniciando Backend - Fitness Expert
echo ===================================
echo.

cd backend

echo Instalando dependencias...
pip install -r requirements.txt

echo.
echo Iniciando servidor...
echo Backend disponible en: http://localhost:8000
echo Documentacion API: http://localhost:8000/docs
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

uvicorn main:app --reload

