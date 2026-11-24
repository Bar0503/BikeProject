@echo off
rem Telepites: Python kornyezet es csomagok, utana a frontend csomagjai
cd /d "%~dp0backend"
python -m venv .venv || goto :hiba
.venv\Scripts\python -m pip install --disable-pip-version-check -r requirements.txt || goto :hiba
cd /d "%~dp0frontend"
call npm install || goto :hiba
echo.
echo Telepites kesz. Inditas: start.bat
exit /b 0

:hiba
echo.
echo Hiba tortent a telepites kozben, lasd a fenti uzenetet.
exit /b 1
