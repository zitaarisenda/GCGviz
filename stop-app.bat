@echo off
title POS GCG Document Hub - Stop Script
color 0C

echo ========================================
echo   POS GCG Document Hub - Stop Script
echo ========================================
echo.

echo Stopping all application processes...

:: Kill Node.js processes
echo Stopping Node.js processes...
taskkill /f /im node.exe >nul 2>&1

:: Kill npm processes
echo Stopping npm processes...
taskkill /f /im npm.cmd >nul 2>&1

:: Kill specific port processes
echo Stopping processes on ports 8080 and 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1

echo.
echo ========================================
echo   All processes stopped successfully!
echo ========================================
echo.
echo Press any key to close this window...
pause >nul 