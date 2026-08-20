@echo off
taskkill /f /im python.exe >nul 2>&1
timeout /t 1 >nobreak
cd /d "%~dp0src"
start http://localhost:8000
python -m http.server 8000
