@echo off
rem TikTok Arabic Word Guessing Game — local launcher.
rem Starts the server on port 3030 and opens the browser.
cd /d "%~dp0"
set PORT=3030
echo ==========================================
echo  TikTok Arabic Word Guessing Game
echo  Server: http://localhost:%PORT%
echo ==========================================
echo.
start "Word Challenge" /min cmd /c "npm run serve"
timeout /t 2 /nobreak >nul
if defined TIKORA_GAME_LAUNCH_URL (
  start "" explorer.exe "%TIKORA_GAME_LAUNCH_URL%"
) else (
  start "" explorer.exe "http://localhost:%PORT%"
)
