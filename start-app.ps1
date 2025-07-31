# POS GCG Document Hub - PowerShell Startup Script
param(
    [switch]$StopOnly
)

# Set console title and color
$Host.UI.RawUI.WindowTitle = "🚀 POS GCG Document Hub - PowerShell"
$Host.UI.RawUI.ForegroundColor = "Green"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 POS GCG Document Hub - PowerShell" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($StopOnly) {
    Write-Host "🛑 Stopping all application processes..." -ForegroundColor Red
    
    # Stop Node.js processes
    Write-Host "Stopping Node.js processes..." -ForegroundColor Yellow
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    
    # Stop npm processes
    Write-Host "Stopping npm processes..." -ForegroundColor Yellow
    Get-Process -Name "npm" -ErrorAction SilentlyContinue | Stop-Process -Force
    
    # Stop processes on specific ports
    Write-Host "Stopping processes on ports 8080 and 3000..." -ForegroundColor Yellow
    $ports = @(8080, 3000)
    foreach ($port in $ports) {
        $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        foreach ($pid in $processes) {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  ✅ All processes stopped successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Read-Host "Press Enter to close"
    exit
}

# Check Node.js installation
Write-Host "[1/6] Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Node.js is installed ($nodeVersion)" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit 1
}

# Check npm availability
Write-Host "[2/6] Checking npm availability..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ npm is available (v$npmVersion)" -ForegroundColor Green
    } else {
        throw "npm not found"
    }
} catch {
    Write-Host "ERROR: npm is not available" -ForegroundColor Red
    Read-Host "Press Enter to close"
    exit 1
}

# Get script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Install frontend dependencies
Write-Host "[3/6] Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location $scriptDir
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm packages for frontend..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install frontend dependencies" -ForegroundColor Red
        Read-Host "Press Enter to close"
        exit 1
    }
} else {
    Write-Host "✓ Frontend dependencies already installed" -ForegroundColor Green
}

# Install backend dependencies
Write-Host "[4/6] Installing backend dependencies..." -ForegroundColor Yellow
$backendDir = Join-Path $scriptDir "backend\src"
Set-Location $backendDir
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm packages for backend..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install backend dependencies" -ForegroundColor Red
        Read-Host "Press Enter to close"
        exit 1
    }
} else {
    Write-Host "✓ Backend dependencies already installed" -ForegroundColor Green
}

# Start backend server
Write-Host "[5/6] Starting backend server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting backend server on port 3000...' -ForegroundColor Yellow; node index.js" -WindowStyle Normal

# Wait for backend to start
Start-Sleep -Seconds 3

# Start frontend development server
Write-Host "[6/6] Starting frontend development server..." -ForegroundColor Yellow
Set-Location $scriptDir
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Starting frontend server on port 8080...' -ForegroundColor Yellow; npm run dev" -WindowStyle Normal

# Wait for frontend to start
Write-Host "Waiting for frontend server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Open browser
Write-Host "Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:8080"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🎉 Application started successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: http://localhost:8080" -ForegroundColor White
Write-Host "Backend:  http://localhost:3000" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to close" 