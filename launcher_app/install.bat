@echo off
title App Launcher - Instalación
cls

echo.
echo ========================================
echo   App Launcher - Instalación Windows
echo ========================================
echo.

:: Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js no está instalado o no está en PATH
    echo.
    echo Por favor instala Node.js desde: https://nodejs.org/
    echo Después de instalar Node.js, ejecuta este instalador nuevamente.
    echo.
    pause
    exit /b 1
)

echo [INFO] Node.js encontrado
node --version

:: Verificar si npm está disponible
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm no está disponible
    echo.
    echo Por favor asegúrate de que npm esté instalado con Node.js
    echo.
    pause
    exit /b 1
)

echo [INFO] npm encontrado
npm --version

:: Instalar dependencias
echo.
echo [INFO] Instalando dependencias...
npm install
if errorlevel 1 (
    echo [ERROR] Error al instalar dependencias
    echo.
    pause
    exit /b 1
)

echo [INFO] Dependencias instaladas exitosamente

:: Crear acceso directo en escritorio (opcional)
echo.
set /p create_shortcut="¿Crear acceso directo en escritorio? (s/n): "
if /i "%create_shortcut%"=="s" (
    echo [INFO] Creando acceso directo en escritorio...
    
    :: Crear archivo batch para iniciar la aplicación
    echo @echo off > "%USERPROFILE%\Desktop\App Launcher.bat"
    echo cd /d "%~dp0" >> "%USERPROFILE%\Desktop\App Launcher.bat"
    echo echo Iniciando App Launcher... >> "%USERPROFILE%\Desktop\App Launcher.bat"
    echo node server.js >> "%USERPROFILE%\Desktop\App Launcher.bat"
    echo pause >> "%USERPROFILE%\Desktop\App Launcher.bat"
    
    echo [INFO] Acceso directo creado en escritorio
)

:: Opcional: Verificar instalación de Docker
echo.
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ADVERTENCIA] Docker no está instalado o no está en PATH
    echo.
    echo Para flujos de trabajo en contenedores, instala Docker Desktop desde:
    echo https://www.docker.com/products/docker-desktop
    echo.
    echo Puedes usar flujos de trabajo nativos sin Docker.
) else (
    echo [INFO] Docker encontrado
    docker --version
)

:: Crear directorio de flujos de trabajo si no existe
if not exist "workflows" (
    mkdir workflows
    echo [INFO] Directorio de flujos de trabajo creado
)

:: Instalación completada
echo.
echo ========================================
echo   ¡Instalación Completada!
echo ========================================
echo.
echo Para iniciar App Launcher:
echo   1. Abre Command Prompt en este directorio
echo   2. Ejecuta: node server.js
echo   3. Abre tu navegador en: http://localhost:5000
echo.
echo O usa el acceso directo del escritorio si lo creaste.
echo.
echo Para ayuda y documentación:
echo   - README.md en este directorio
echo   - GitHub: https://github.com/usuario/app-launcher
echo.
echo ¡Gracias por usar App Launcher!
echo.
pause