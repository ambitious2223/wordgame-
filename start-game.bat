@echo off
rem Word Challenge launcher for the Tikora hub.
rem Starts the local game server, then opens the browser. When the hub launches
rem this game it passes TIKORA_GAME_LAUNCH_URL (with ?game=<slug>&key=<apiKey>)
rem so the game can authenticate; standalone runs fall back to plain localhost.
cd /d "%~dp0"
set PORT=3030
echo ==========================================
echo  Word Challenge (Tikora game)
echo  http://localhost:%PORT%
echo ==========================================
echo.
start "Word Challenge" /min cmd /c "npm run serve"
timeout /t 2 /nobreak >nul
if defined TIKORA_GAME_LAUNCH_URL (
  start "" explorer.exe "%TIKORA_GAME_LAUNCH_URL%"
) else (
  start "" explorer.exe "http://localhost:%PORT%"
)
