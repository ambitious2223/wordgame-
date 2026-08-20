@echo off
echo.
echo  ========================================
echo   TikTok Arabic Word Guessing Game
echo  ========================================
echo.

:: Navigate to src folder and start server
cd /d "%~dp0src"

:: Check if Python is available
where python >nul 2>&1
if %errorlevel% == 0 (
    echo  Starting server on http://localhost:8000
    echo  Game will open automatically...
    echo.
    start http://localhost:8000
    python -m http.server 8000
) else (
    echo  Python not found. Opening game directly...
    start "" "%~dp0src\index.html"
)
