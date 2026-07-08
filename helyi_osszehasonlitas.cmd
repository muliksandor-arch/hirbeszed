@echo off
chcp 65001 >nul
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0helyi_osszehasonlitas.ps1" %*
exit /b %ERRORLEVEL%
