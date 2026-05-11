@echo off
title Stockly - Apagado
echo Parando backend (node en :3001)...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":3001.*LISTENING"') do taskkill /F /PID %%P >nul 2>&1
echo Parando MySQL (mysqld en :3306)...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":3306.*LISTENING"') do taskkill /F /PID %%P >nul 2>&1
echo Hecho.
timeout /t 2 >nul
