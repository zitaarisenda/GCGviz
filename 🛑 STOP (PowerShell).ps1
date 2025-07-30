# POS GCG Document Hub - PowerShell Stop Script

# Set console title and color
$Host.UI.RawUI.WindowTitle = "🛑 POS GCG Document Hub - PowerShell STOP"
$Host.UI.RawUI.ForegroundColor = "Red"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🛑 POS GCG Document Hub - PowerShell STOP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

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
Write-Host ""
Read-Host "Press Enter to close" 