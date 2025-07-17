#!/bin/bash

# App Launcher - Script de Instalación para sistemas Unix/Linux
# Este script instala la aplicación App Launcher

set -e  # Salir en caso de error

# Información de la aplicación
APP_NAME="App Launcher"
APP_DIR="$HOME/.app-launcher"
DESKTOP_FILE="$HOME/.local/share/applications/app-launcher.desktop"
LOG_FILE="$APP_DIR/install.log"

# Códigos de color para salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # Sin Color

# Función para registrar mensajes
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

# Función para imprimir mensajes de estado
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
    log "INFO: $1"
}

print_success() {
    echo -e "${GREEN}[ÉXITO]${NC} $1"
    log "ÉXITO: $1"
}

print_warning() {
    echo -e "${YELLOW}[ADVERTENCIA]${NC} $1"
    log "ADVERTENCIA: $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    log "ERROR: $1"
}

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Función para obtener información del SO
get_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        echo "windows"
    else
        echo "unknown"
    fi
}

# Función para instalar Node.js en diferentes sistemas
install_nodejs() {
    local os=$(get_os)
    
    print_status "Intentando instalar Node.js..."
    
    case $os in
        "linux")
            if command_exists apt-get; then
                print_status "Instalando Node.js usando apt-get..."
                sudo apt-get update
                sudo apt-get install -y nodejs npm
            elif command_exists yum; then
                print_status "Instalando Node.js usando yum..."
                sudo yum install -y nodejs npm
            elif command_exists pacman; then
                print_status "Instalando Node.js usando pacman..."
                sudo pacman -S nodejs npm
            else
                print_error "No se encontró un gestor de paquetes compatible. Por favor instala Node.js manualmente."
                exit 1
            fi
            ;;
        "macos")
            if command_exists brew; then
                print_status "Instalando Node.js usando Homebrew..."
                brew install node
            else
                print_error "Homebrew no encontrado. Por favor instala Node.js manualmente desde https://nodejs.org/"
                exit 1
            fi
            ;;
        *)
            print_error "Sistema operativo no soportado. Por favor instala Node.js manualmente."
            exit 1
            ;;
    esac
}

# Función para crear entrada de escritorio (solo Linux)
create_desktop_entry() {
    if [[ "$(get_os)" == "linux" ]]; then
        print_status "Creando entrada de escritorio..."
        
        mkdir -p "$(dirname "$DESKTOP_FILE")"
        
        cat > "$DESKTOP_FILE" << EOF
[Desktop Entry]
Name=App Launcher
Comment=Lanzador de aplicaciones multiplataforma
Exec=node $PWD/server.js
Icon=$PWD/icon.png
Type=Application
Categories=Utility;Development;
StartupNotify=true
Path=$PWD
EOF
        
        chmod +x "$DESKTOP_FILE"
        print_success "Entrada de escritorio creada"
    fi
}

# Función principal de instalación
main() {
    print_status "Iniciando instalación de App Launcher..."
    
    # Crear directorio de log
    mkdir -p "$APP_DIR"
    
    # Verificar instalación de Node.js
    if ! command_exists node; then
        print_warning "Node.js no encontrado. Intentando instalar..."
        install_nodejs
    else
        print_success "Node.js encontrado: $(node --version)"
    fi
    
    # Verificar instalación de npm
    if ! command_exists npm; then
        print_error "npm no encontrado. Por favor instala npm manualmente."
        exit 1
    else
        print_success "npm encontrado: $(npm --version)"
    fi
    
    # Instalar dependencias
    print_status "Instalando dependencias de la aplicación..."
    npm install
    
    if [[ $? -eq 0 ]]; then
        print_success "Dependencias instaladas exitosamente"
    else
        print_error "Error al instalar dependencias"
        exit 1
    fi
    
    # Opcional: Verificar instalación de Docker
    if command_exists docker; then
        print_success "Docker encontrado: $(docker --version)"
    else
        print_warning "Docker no encontrado. Los flujos de trabajo en contenedores no estarán disponibles."
        print_warning "Para usar características de contenedores, instala Docker desde: https://www.docker.com/get-started"
    fi
    
    # Crear directorio de workflows si no existe
    if [[ ! -d "workflows" ]]; then
        mkdir workflows
        print_success "Directorio de workflows creado"
    fi
    
    # Crear entrada de escritorio (solo Linux)
    if [[ "$(get_os)" == "linux" ]]; then
        read -p "¿Crear entrada de escritorio? (s/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[SsYy]$ ]]; then
            create_desktop_entry
        fi
    fi
    
    # Instalación completada
    print_success "¡Instalación completada exitosamente!"
    echo
    echo "========================================="
    echo "  Instalación de App Launcher Completada"
    echo "========================================="
    echo
    echo "Para iniciar App Launcher:"
    echo "  1. Abre terminal en este directorio"
    echo "  2. Ejecuta: node server.js"
    echo "  3. Abre tu navegador en: http://localhost:5000"
    echo
    echo "Para ayuda y documentación:"
    echo "  - README.md en este directorio"
    echo "  - GitHub: https://github.com/usuario/app-launcher"
    echo
    echo "¡Gracias por usar App Launcher!"
}

# Ejecutar función principal
main "$@"