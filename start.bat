@echo off
rem Backend es frontend inditasa ket ablakban
start "Bike Locator - backend" /D "%~dp0backend" cmd /k .venv\Scripts\python -m uvicorn main:app --reload

rem Megvarja, amig a backend valaszol, csak utana indul a frontend
echo Varakozas a backendre...
set /a probak=0
:varakozas
set /a probak+=1
if %probak% gtr 60 goto :hiba
ping -n 2 127.0.0.1 >nul
curl -s --noproxy "*" -o nul http://127.0.0.1:8000/api/health || goto :varakozas

start "Bike Locator - frontend" /D "%~dp0frontend" cmd /k npm run dev -- --open
echo Backend (API dokumentacio): http://127.0.0.1:8000/docs
echo Frontend:                   http://localhost:5173
exit /b 0

:hiba
echo A backend 60 masodperc alatt sem indult el, nezd meg a backend ablakat.
exit /b 1
