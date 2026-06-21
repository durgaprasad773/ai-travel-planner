@echo off
echo Starting AI Travel Planner...
echo.

echo Starting Backend Server...
start cmd /k "cd backend && npm run dev"

timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
