# LaunchMaster

LaunchMaster es una prueba de lanzador de aplicaciones multiplataforma. Permite ejecutar flujos de trabajo definidos en YAML en modo nativo o dentro de contenedores.

## Características

- Detección de sistema operativo y motores de contenedores.
- Diseño modular con backend de ejecución y frontend web.
- Editor visual drag-and-drop para crear flujos.
- Logs y health checks integrados.
- Seguridad: sin contraseñas en claro ni contenedores privilegiados.

## Instalación rápida

En Windows ejecuta `install.bat` y en macOS/Linux ejecuta `install.sh`.

```bash
cd launcher_app
chmod +x install.sh
./install.sh
```

## Flujos de ejemplo

El directorio `launcher_app` contiene tres flujos de demostración:

- `webdev-native.yaml`
- `webdev-container.yaml`
- `suite-creativa.yaml`

## Demo

![Demostración](launcher_app/demo.gif)


## Uso rápido con Python

Para ejecutar un flujo sin usar la interfaz web puedes emplear el script `launcher.py`.
Instala PyYAML si es necesario y ejecuta el flujo deseado:

```bash
cd launcher_app
python3 launcher.py webdev-native.yaml
```

El script detecta el sistema operativo, verifica dependencias básicas y ejecuta los pasos
en orden. Los logs se guardan en el archivo indicado por cada YAML.

