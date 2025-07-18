import os
import sys
import subprocess
import shutil
import platform
from datetime import datetime

try:
    import yaml
except ImportError:
    print('PyYAML no instalado. Instalando...')
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', '--quiet', 'PyYAML'])
    import yaml


def detect_os():
    return platform.system().lower()


def detect_container_engine():
    engines = []
    for engine in ('docker', 'podman'):
        if shutil.which(engine):
            try:
                out = subprocess.check_output([engine, '--version'], stderr=subprocess.STDOUT)
                engines.append((engine, out.decode().strip()))
            except Exception:
                engines.append((engine, 'unknown'))
    return engines


def command_exists(cmd):
    return shutil.which(cmd) is not None


def check_dependencies(deps):
    missing = []
    for dep in deps or {}:
        if not command_exists(dep):
            missing.append(dep)
    return missing


def run_step(step, env):
    cmd = step.get('command')
    if isinstance(cmd, dict):
        os_key = detect_os()
        cmd = cmd.get(os_key, cmd.get('default'))
    if not cmd:
        return
    background = step.get('background', False)
    cwd = os.path.expandvars(step.get('working_directory', '.'))
    if background:
        subprocess.Popen(cmd, shell=True, cwd=cwd, env=env)
    else:
        subprocess.run(cmd, shell=True, check=False, cwd=cwd, env=env)


def run_flow(path):
    with open(path, 'r', encoding='utf-8') as f:
        flow = yaml.safe_load(f)

    print(f"== Ejecutando flujo: {flow.get('name')} ==")
    missing = check_dependencies(flow.get('dependencies'))
    if missing:
        print('Faltan dependencias:', ', '.join(missing))
        return

    env = os.environ.copy()
    env.update({k: os.path.expandvars(v) for k, v in (flow.get('env_vars') or {}).items()})

    log_file = flow.get('logs', {}).get('file', 'launcher.log')
    with open(log_file, 'a', encoding='utf-8') as log:
        for step in flow.get('steps', []):
            name = step.get('name')
            log.write(f"[{datetime.now()}] STEP {name}\n")
            print(f"-- {name} --")
            run_step(step, env)


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print('Uso: python launcher.py flujo.yaml')
        sys.exit(1)
    run_flow(sys.argv[1])

