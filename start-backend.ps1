# SpotlightReady - Start Backend Only
Write-Host "Killing any existing node processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

Write-Host "Starting Backend (port 4000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'C:\Users\Yuvraj\Desktop\SpotlightReady'; pnpm --filter backend dev"

Write-Host "Backend starting in a new window -> http://localhost:4000" -ForegroundColor Green
