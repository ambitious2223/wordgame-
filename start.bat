@echo off
echo.
echo  ========================================
%    TikTok Arabic Word Guessing Game
%    Launching prototype...
%  ========================================
echo.

:: Try to start Python server
where python >nul 2>&1
if %errorlevel% == 0 (
    echo  [1/2] Starting local server...
    start /b python -m http.server 8000 >nul 2>&1
    timeout /t 2 /nobreak >nul
    echo  [2/2] Opening browser...
    start http://localhost:8000
    echo.
    echo  Game is running at: http://localhost:8000
    echo  Press Ctrl+C to stop, or close this window.
    echo.
    pause
) else (
    echo  Python not found. Opening HTML file directly...
    echo.
    start "" "%~dp0src\index.html"
    echo  Game opened in browser.
    echo  You can close this window.
    echo.
    timeout /t 3 /nobreak >nul
)
