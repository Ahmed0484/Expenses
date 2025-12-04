@echo off
cd /d "%~dp0"

echo Starting JSON Server...
start /b npx json-server src/data/expenses.json --port 3000

echo Starting React App...
npm run dev
