@echo off
title POS GCG Document Hub - Startup Script
color 0A

echo ========================================
echo   POS GCG Document Hub - Startup Script
echo ========================================
echo.

:: Check if Node.js is installed
echo [1/6] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed

:: Check if npm is available
echo [2/6] Checking npm availability...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not available
    pause
    exit /b 1
)
echo ✓ npm is available

:: Install frontend dependencies
echo [3/6] Installing frontend dependencies...
cd /d "%~dp0"
if not exist "node_modules" (
    echo Installing npm packages for frontend...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
) else (
    echo ✓ Frontend dependencies already installed
)

:: Install backend dependencies
echo [4/6] Installing backend dependencies...
cd /d "%~dp0backend\src"
if not exist "node_modules" (
    echo Installing npm packages for backend...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
) else (
    echo ✓ Backend dependencies already installed
)

:: Start backend server
echo [5/6] Starting backend server...
cd /d "%~dp0backend\src"
start "Backend Server" cmd /k "echo Starting backend server on port 3000... && node index.js"

:: Wait a moment for backend to start
timeout /t 3 /nobreak >nul

:: Start frontend development server
echo [6/6] Starting frontend development server...
cd /d "%~dp0"
start "Frontend Server" cmd /k "echo Starting frontend server on port 8080... && npm run dev"

:: Wait for frontend to start
echo Waiting for frontend server to start...
timeout /t 5 /nobreak >nul

:: Open browser
echo Opening browser...
start http://localhost:8080

echo.
echo ========================================
echo   Application started successfully!
echo ========================================
echo.
echo Frontend: http://localhost:8080
echo Backend:  http://localhost:3000
echo.
echo Press any key to close this window...
pause >nul 