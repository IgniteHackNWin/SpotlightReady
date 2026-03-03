# SpotlightReady - Start Frontend Only
Write-Host "Killing any existing node processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

Write-Host "Starting Frontend (port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'C:\Users\Yuvraj\Desktop\SpotlightReady'; pnpm --filter frontend dev"

Write-Host "Frontend starting in a new window -> http://localhost:3000" -ForegroundColor Green
