@echo off
cd /d C:\Source\Repos\FoodPicker
start "" python app.py
timeout /t 5 >nul
start http://127.0.0.1:5000
pause
