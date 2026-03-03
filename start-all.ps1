# SpotlightReady - Start Both Servers
Write-Host "Killing any existing node processes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

Write-Host "Starting Backend (port 4000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'C:\Users\Yuvraj\Desktop\SpotlightReady'; pnpm --filter backend dev"

Start-Sleep -Seconds 2

Write-Host "Starting Frontend (port 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location 'C:\Users\Yuvraj\Desktop\SpotlightReady'; pnpm --filter frontend dev"

Write-Host ""
Write-Host "Both servers starting in separate windows!" -ForegroundColor Green
Write-Host "  Backend  -> http://localhost:4000" -ForegroundColor White
Write-Host "  Frontend -> http://localhost:3000" -ForegroundColor White
