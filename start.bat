@echo off
chcp 65001 >nul
setlocal ENABLEDELAYEDEXPANSION

REM ========================================================================
REM Stockly - Lanzador completo (MySQL + Backend + Navegador)
REM Doble-click para arrancar todo. Cerrar la ventana = apaga el backend.
REM MySQL queda corriendo minimizado (usa stop.bat para apagarlo).
REM ========================================================================

set "MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.4\bin"
set "MYSQL_DATA=%LOCALAPPDATA%\MySQL\data"
set "NODE_BIN=C:\Program Files\nodejs"
set "PROJECT_DIR=%~dp0"
set "BACKEND_DIR=%PROJECT_DIR%backend"
set "URL=http://localhost:3001/"

title Stockly Launcher
color 0E

echo.
echo ============================================================
echo   STOCKLY - Lanzador
echo ============================================================
echo.

if not exist "%MYSQL_BIN%\mysqld.exe" (
    echo [ERROR] MySQL no encontrado en: %MYSQL_BIN%
    echo Instala MySQL Server 8.4 o ajusta MYSQL_BIN en este .bat
    echo.
    pause
    exit /b 1
)
if not exist "%NODE_BIN%\node.exe" (
    echo [ERROR] Node.js no encontrado en: %NODE_BIN%
    echo Instala Node LTS desde https://nodejs.org/
    echo.
    pause
    exit /b 1
)

if not exist "%BACKEND_DIR%\node_modules" (
    echo Instalando dependencias de Node ^(primera vez^)...
    pushd "%BACKEND_DIR%"
    call "%NODE_BIN%\npm.cmd" install --no-audit --no-fund
    popd
)
if not exist "%BACKEND_DIR%\.env" (
    echo Generando backend\.env desde plantilla...
    copy "%BACKEND_DIR%\.env.example" "%BACKEND_DIR%\.env" >nul
)
if not exist "%MYSQL_DATA%\mysql" (
    echo Inicializando MySQL en %MYSQL_DATA% ^(primera vez^)...
    if not exist "%LOCALAPPDATA%\MySQL" mkdir "%LOCALAPPDATA%\MySQL"
    "%MYSQL_BIN%\mysqld.exe" --initialize-insecure --datadir="%MYSQL_DATA%" --console >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Fallo inicializando MySQL.
        pause
        exit /b 1
    )
)

netstat -an | findstr /R /C:":3306.*LISTENING" >nul
if errorlevel 1 (
    echo Arrancando MySQL en :3306...
    start "Stockly MySQL" /MIN "%MYSQL_BIN%\mysqld.exe" --datadir=%MYSQL_DATA% --port=3306 --console
) else (
    echo MySQL ya estaba corriendo.
)

echo Esperando a MySQL...
set /a tries=0
:wait_mysql
"%MYSQL_BIN%\mysql.exe" -u root -e "SELECT 1" >nul 2>&1
if !errorlevel! equ 0 goto mysql_ready
set /a tries+=1
if !tries! gtr 30 (
    echo [ERROR] MySQL no respondio en 30s.
    pause
    exit /b 1
)
timeout /t 1 /nobreak >nul
goto wait_mysql
:mysql_ready
echo [OK] MySQL listo.

"%MYSQL_BIN%\mysql.exe" -u root -e "USE stockly" >nul 2>&1
if errorlevel 1 (
    echo Creando base de datos 'stockly' y cargando schema...
    "%MYSQL_BIN%\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS stockly CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    "%MYSQL_BIN%\mysql.exe" -u root stockly < "%PROJECT_DIR%db\schema.sql"
)

for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":3001.*LISTENING"') do (
    echo Cerrando proceso previo en :3001 ^(PID %%P^)...
    taskkill /F /PID %%P >nul 2>&1
)

set "LAN_IP="
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4"') do (
    set "ip=%%a"
    set "ip=!ip: =!"
    if not "!ip:~0,4!"=="169." if not "!ip!"=="127.0.0.1" (
        if not defined LAN_IP set "LAN_IP=!ip!"
    )
)

echo.
echo ============================================================
echo   Stockly corriendo
echo ============================================================
echo   Local:    %URL%
if defined LAN_IP echo   LAN:      http://!LAN_IP!:3001/
echo.
echo   Demo:  adrian@tfg.local / password123  (admin)
echo          laura@tfg.local  / password123  (operario)
echo          marcos@tfg.local / password123  (cliente)
echo.
echo   Cierra esta ventana o pulsa Ctrl+C para parar el backend.
echo ============================================================
echo.

REM Abrir navegador en background tras 4s (espera a que el backend este listo)
start /B "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 4; Start-Process '%URL%'"

REM Backend en primer plano: cerrar ventana = matar backend
cd /d "%BACKEND_DIR%"
set "PATH=%NODE_BIN%;%PATH%"
"%NODE_BIN%\node.exe" server.js

echo.
echo [Backend detenido]
pause
