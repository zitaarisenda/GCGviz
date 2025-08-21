@echo off
chcp 65001 >nul
echo Starting POS Data Cleaner 2 Web API...
cd /d "%~dp0"
start "Backend" cmd /k "python backend/app.py"
timeout /t 3 /nobreak >nul
start "Frontend" cmd /k "npm run dev:frontend"
echo.
echo Both services starting...
echo Backend: http://localhost:5001
echo Frontend: http://localhost:8081
echo.
pause