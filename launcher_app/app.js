// Application data
const appData = {
  "flows": [
    {
      "name": "WebDev-Native",
      "version": "1.0.0",
      "description": "Flujo de desarrollo web nativo para proyectos React/Vue/Angular",
      "mode": "native",
      "dependencies": {
        "node": ">=16.0.0",
        "npm": ">=8.0.0",
        "git": ">=2.0.0"
      },
      "healthcheck": {
        "interval": "30s",
        "timeout": "10s",
        "retries": 3
      },
      "steps": [
        {
          "name": "verificar_node",
          "command": "node --version",
          "timeout": 5
        },
        {
          "name": "instalar_dependencias",
          "command": "npm install",
          "timeout": 300
        },
        {
          "name": "lanzar_dev_server",
          "command": "npm run dev",
          "background": true,
          "port": 3000
        },
        {
          "name": "abrir_navegador",
          "command": "http://localhost:3000",
          "delay": 3
        }
      ],
      "env_vars": {
        "NODE_ENV": "development",
        "PORT": "3000"
      }
    },
    {
      "name": "WebDev-Container",
      "version": "1.0.0",
      "description": "Flujo de desarrollo web containerizado con Docker",
      "mode": "container",
      "dependencies": {
        "docker": ">=20.0.0",
        "docker-compose": ">=1.29.0"
      },
      "healthcheck": {
        "interval": "30s",
        "timeout": "10s",
        "retries": 3,
        "test": "curl -f http://localhost:3000 || exit 1"
      },
      "steps": [
        {
          "name": "verificar_docker",
          "command": "docker --version",
          "timeout": 5
        },
        {
          "name": "construir_imagen",
          "image": "node:18-alpine",
          "timeout": 600
        },
        {
          "name": "ejecutar_contenedor",
          "image": "webdev-app:latest",
          "ports": ["3000:3000"]
        },
        {
          "name": "abrir_navegador",
          "command": "http://localhost:3000",
          "delay": 5
        }
      ],
      "security": {
        "user": "node",
        "read_only": false
      }
    },
    {
      "name": "Suite-Creativa",
      "version": "1.0.0",
      "description": "Flujo automatizado para herramientas creativas Adobe y alternativas",
      "mode": "native",
      "dependencies": {
        "python": ">=3.8.0",
        "ffmpeg": ">=4.0.0"
      },
      "healthcheck": {
        "interval": "60s",
        "timeout": "15s",
        "retries": 2
      },
      "steps": [
        {
          "name": "verificar_herramientas",
          "command": "python --version && ffmpeg -version",
          "timeout": 10
        },
        {
          "name": "abrir_photoshop",
          "command": "photoshop",
          "background": true
        },
        {
          "name": "abrir_illustrator",
          "command": "illustrator",
          "background": true
        },
        {
          "name": "configurar_directorio_trabajo",
          "command": "mkdir -p $WORK_DIR/assets && mkdir -p $WORK_DIR/exports"
        },
        {
          "name": "script_automatizacion",
          "command": "python automation_script.py",
          "timeout": 300
        }
      ],
      "env_vars": {
        "WORK_DIR": "$HOME/CreativeWork",
        "PYTHONPATH": "$WORK_DIR/scripts"
      }
    }
  ]
};

// Global state
let currentFlow = null;
let executionInProgress = false;
let editorSteps = [];
let systemInfo = {};
let currentEditingStepIndex = -1;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Application loading...');
  detectSystemInfo();
  loadFlows();
  setupEventListeners();
  setupDragAndDrop();
  addLogEntry('info', '🚀 Lanzador Cross-Platform iniciado correctamente');
});

// System detection
function detectSystemInfo() {
  const userAgent = navigator.userAgent;
  let os = 'Unknown';
  
  if (userAgent.includes('Windows')) {
    os = 'Windows';
  } else if (userAgent.includes('Mac')) {
    os = 'macOS';
  } else if (userAgent.includes('Linux')) {
    os = 'Linux';
  }
  
  const osInfo = document.getElementById('os-info');
  if (osInfo) {
    osInfo.innerHTML = `<span class="status-indicator--available">${os}</span>`;
  }
  
  setTimeout(() => {
    simulateContainerEngineDetection();
  }, 1000);
  
  setTimeout(() => {
    simulateNodeDetection();
  }, 1500);
}

function simulateContainerEngineDetection() {
  const dockerAvailable = Math.random() > 0.3;
  const podmanAvailable = Math.random() > 0.7;
  
  const dockerStatus = document.getElementById('docker-status');
  const podmanStatus = document.getElementById('podman-status');
  
  if (dockerStatus) {
    dockerStatus.innerHTML = dockerAvailable 
      ? '<span class="status-indicator--available">✓ Docker 20.10.8</span>'
      : '<span class="status-indicator--unavailable">✗ No disponible</span>';
  }
  
  if (podmanStatus) {
    podmanStatus.innerHTML = podmanAvailable 
      ? '<span class="status-indicator--available">✓ Podman 3.4.2</span>'
      : '<span class="status-indicator--unavailable">✗ No disponible</span>';
  }
  
  systemInfo.docker = dockerAvailable;
  systemInfo.podman = podmanAvailable;
}

function simulateNodeDetection() {
  const nodeAvailable = Math.random() > 0.2;
  const nodeStatus = document.getElementById('node-status');
  
  if (nodeStatus) {
    nodeStatus.innerHTML = nodeAvailable 
      ? '<span class="status-indicator--available">✓ Node.js 18.17.0</span>'
      : '<span class="status-indicator--unavailable">✗ No disponible</span>';
  }
  
  systemInfo.node = nodeAvailable;
}

// Load flows
function loadFlows() {
  const flowsGrid = document.getElementById('flows-grid');
  if (!flowsGrid) return;
  
  flowsGrid.innerHTML = '';
  
  appData.flows.forEach(flow => {
    const flowCard = createFlowCard(flow);
    flowsGrid.appendChild(flowCard);
  });
}

function createFlowCard(flow) {
  const card = document.createElement('div');
  card.className = 'flow-card animate-fade-in';
  card.innerHTML = `
    <div class="flow-card__header">
      <h3 class="flow-card__title">${flow.name}</h3>
      <span class="flow-card__mode flow-card__mode--${flow.mode}">${flow.mode}</span>
    </div>
    <p class="flow-card__description">${flow.description}</p>
    <div class="flow-card__actions">
      <button class="btn btn--primary btn--sm" data-action="execute" data-flow="${flow.name}">
        🚀 Ejecutar
      </button>
      <button class="btn btn--secondary btn--sm" data-action="edit" data-flow="${flow.name}">
        ✏️ Editar
      </button>
      <button class="btn btn--outline btn--sm" data-action="duplicate" data-flow="${flow.name}">
        📋 Duplicar
      </button>
    </div>
  `;
  
  return card;
}

// Event listeners
function setupEventListeners() {
  // Theme toggle
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // System refresh
  const refreshSystem = document.getElementById('refresh-system');
  if (refreshSystem) {
    refreshSystem.addEventListener('click', function() {
      detectSystemInfo();
      addLogEntry('info', '📋 Información del sistema actualizada');
    });
  }
  
  // Create flow
  const createFlowBtn = document.getElementById('create-flow-btn');
  if (createFlowBtn) {
    createFlowBtn.addEventListener('click', createNewFlow);
  }
  
  // Editor actions
  const saveFlow = document.getElementById('save-flow');
  if (saveFlow) {
    saveFlow.addEventListener('click', saveCurrentFlow);
  }
  
  const testFlow = document.getElementById('test-flow');
  if (testFlow) {
    testFlow.addEventListener('click', testCurrentFlow);
  }
  
  const closeEditor = document.getElementById('close-editor');
  if (closeEditor) {
    closeEditor.addEventListener('click', function() {
      const editorSection = document.getElementById('editor-section');
      if (editorSection) {
        editorSection.style.display = 'none';
      }
    });
  }
  
  // Execution actions
  const stopExecution = document.getElementById('stop-execution');
  if (stopExecution) {
    stopExecution.addEventListener('click', function() {
      executionInProgress = false;
      addLogEntry('warning', '⏹️ Ejecución detenida por el usuario');
    });
  }
  
  const closeExecution = document.getElementById('close-execution');
  if (closeExecution) {
    closeExecution.addEventListener('click', function() {
      const executionSection = document.getElementById('execution-section');
      if (executionSection) {
        executionSection.style.display = 'none';
      }
      executionInProgress = false;
    });
  }
  
  // Modal close buttons
  const modalCloseButtons = document.querySelectorAll('.modal-close, #cancel-flow-config, #cancel-component');
  modalCloseButtons.forEach(button => {
    button.addEventListener('click', function() {
      hideAllModals();
    });
  });
  
  // Modal overlay
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', hideAllModals);
  }
  
  // Flow card actions - event delegation
  const flowsGrid = document.getElementById('flows-grid');
  if (flowsGrid) {
    flowsGrid.addEventListener('click', function(e) {
      if (e.target.classList.contains('btn')) {
        const action = e.target.dataset.action;
        const flowName = e.target.dataset.flow;
        
        switch(action) {
          case 'execute':
            executeFlow(flowName);
            break;
          case 'edit':
            editFlow(flowName);
            break;
          case 'duplicate':
            duplicateFlow(flowName);
            break;
        }
      }
    });
  }
  
  // Add env var button
  const addEnvVar = document.getElementById('add-env-var');
  if (addEnvVar) {
    addEnvVar.addEventListener('click', addEnvironmentVariable);
  }
  
  // Forms
  const flowConfigForm = document.getElementById('flow-config-form');
  if (flowConfigForm) {
    flowConfigForm.addEventListener('submit', handleFlowConfigSubmit);
  }
  
  const componentForm = document.getElementById('component-form');
  if (componentForm) {
    componentForm.addEventListener('submit', handleComponentSubmit);
  }
}

// Flow execution
function executeFlow(flowName) {
  const flow = appData.flows.find(f => f.name === flowName);
  if (!flow) return;
  
  currentFlow = flow;
  executionInProgress = true;
  
  const executionSection = document.getElementById('execution-section');
  if (executionSection) {
    executionSection.style.display = 'block';
    executionSection.scrollIntoView({ behavior: 'smooth' });
  }
  
  const logsContainer = document.getElementById('logs-container');
  if (logsContainer) {
    logsContainer.innerHTML = '';
  }
  
  setupStatusGrid(flow);
  executeSteps(flow.steps);
  
  addLogEntry('info', `🚀 Iniciando ejecución del flujo: ${flowName}`);
}

function setupStatusGrid(flow) {
  const statusGrid = document.getElementById('status-grid');
  if (!statusGrid) return;
  
  statusGrid.innerHTML = '';
  
  flow.steps.forEach((step, index) => {
    const statusStep = document.createElement('div');
    statusStep.className = 'status-step';
    statusStep.id = `status-step-${index}`;
    statusStep.innerHTML = `
      <div class="status-step__icon">⏳</div>
      <div class="status-step__info">
        <div class="status-step__name">${step.name}</div>
        <div class="status-step__status">Esperando...</div>
      </div>
    `;
    statusGrid.appendChild(statusStep);
  });
}

async function executeSteps(steps) {
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const statusElement = document.getElementById(`status-step-${i}`);
    
    if (!executionInProgress) break;
    
    if (statusElement) {
      statusElement.querySelector('.status-step__icon').textContent = '⚙️';
      statusElement.querySelector('.status-step__status').textContent = 'Ejecutando...';
    }
    
    addLogEntry('info', `Ejecutando paso: ${step.name}`);
    addLogEntry('info', `Comando: ${step.command || step.image || 'N/A'}`);
    
    const executionTime = Math.random() * 2000 + 1000;
    await new Promise(resolve => setTimeout(resolve, executionTime));
    
    const success = Math.random() > 0.1;
    
    if (statusElement) {
      if (success) {
        statusElement.querySelector('.status-step__icon').textContent = '✅';
        statusElement.querySelector('.status-step__status').textContent = 'Completado';
        addLogEntry('success', `✓ Paso completado: ${step.name}`);
      } else {
        statusElement.querySelector('.status-step__icon').textContent = '❌';
        statusElement.querySelector('.status-step__status').textContent = 'Error';
        addLogEntry('error', `✗ Error en paso: ${step.name}`);
        break;
      }
    }
    
    if (step.delay) {
      await new Promise(resolve => setTimeout(resolve, step.delay * 1000));
    }
  }
  
  if (executionInProgress) {
    addLogEntry('success', '🎉 Flujo completado exitosamente');
  }
}

function addLogEntry(type, message) {
  const logsContainer = document.getElementById('logs-container');
  if (!logsContainer) return;
  
  const logEntry = document.createElement('div');
  logEntry.className = `log-entry log-entry--${type}`;
  
  const timestamp = new Date().toLocaleTimeString();
  logEntry.innerHTML = `
    <div class="log-timestamp">[${timestamp}]</div>
    <div class="log-message">${message}</div>
  `;
  
  logsContainer.appendChild(logEntry);
  logsContainer.scrollTop = logsContainer.scrollHeight;
}

// Flow editing
function editFlow(flowName) {
  const flow = appData.flows.find(f => f.name === flowName);
  if (!flow) return;
  
  currentFlow = { ...flow };
  editorSteps = [...flow.steps];
  
  const editorSection = document.getElementById('editor-section');
  if (editorSection) {
    editorSection.style.display = 'block';
    editorSection.scrollIntoView({ behavior: 'smooth' });
  }
  
  loadFlowIntoEditor(currentFlow);
  addLogEntry('info', `✏️ Editando flujo: ${flowName}`);
}

function loadFlowIntoEditor(flow) {
  const editorCanvas = document.getElementById('editor-canvas');
  if (!editorCanvas) return;
  
  editorCanvas.innerHTML = '';
  
  const dropZone = document.createElement('div');
  dropZone.className = 'canvas-drop-zone';
  dropZone.innerHTML = '<p>Arrastra componentes aquí para crear tu flujo</p>';
  editorCanvas.appendChild(dropZone);
  
  flow.steps.forEach((step, index) => {
    const stepElement = createStepElement(step, index);
    editorCanvas.appendChild(stepElement);
  });
  
  if (flow.steps.length > 0) {
    dropZone.style.display = 'none';
  }
}

function createStepElement(step, index) {
  const stepElement = document.createElement('div');
  stepElement.className = 'flow-step';
  stepElement.style.left = `${50 + (index * 200)}px`;
  stepElement.style.top = `${50 + (index % 3) * 100}px`;
  stepElement.dataset.index = index;
  
  const stepType = step.image ? 'container' : 'command';
  const stepIcon = stepType === 'container' ? '🐳' : '💻';
  
  stepElement.innerHTML = `
    <div class="flow-step__header">
      <div class="flow-step__title">${step.name}</div>
      <div class="flow-step__type">${stepIcon}</div>
    </div>
    <div class="flow-step__content">${step.command || step.image || ''}</div>
    <div class="flow-step__actions">
      <button class="btn btn--outline btn--sm" data-action="edit-step" data-index="${index}">⚙️</button>
      <button class="btn btn--outline btn--sm" data-action="delete-step" data-index="${index}">🗑️</button>
    </div>
  `;
  
  // Add event listeners for step actions
  const editBtn = stepElement.querySelector('[data-action="edit-step"]');
  const deleteBtn = stepElement.querySelector('[data-action="delete-step"]');
  
  if (editBtn) {
    editBtn.addEventListener('click', function() {
      editStepConfig(index);
    });
  }
  
  if (deleteBtn) {
    deleteBtn.addEventListener('click', function() {
      deleteStep(index);
    });
  }
  
  return stepElement;
}

// Drag and drop functionality
function setupDragAndDrop() {
  const components = document.querySelectorAll('.component-item');
  const canvas = document.getElementById('editor-canvas');
  
  if (!canvas) return;
  
  components.forEach(component => {
    component.addEventListener('dragstart', handleDragStart);
    component.addEventListener('dragend', handleDragEnd);
  });
  
  canvas.addEventListener('dragover', handleDragOver);
  canvas.addEventListener('drop', handleDrop);
}

function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.dataset.type);
  e.target.classList.add('dragging');
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
}

function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  
  const componentType = e.dataTransfer.getData('text/plain');
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  addComponentToCanvas(componentType, x, y);
}

function addComponentToCanvas(type, x, y) {
  const canvas = document.getElementById('editor-canvas');
  if (!canvas) return;
  
  const dropZone = canvas.querySelector('.canvas-drop-zone');
  if (dropZone) {
    dropZone.style.display = 'none';
  }
  
  const newStep = {
    name: `Nuevo ${type}`,
    command: type === 'container' ? 'nginx:latest' : 'echo "Hello World"',
    timeout: 30
  };
  
  if (type === 'container') {
    newStep.image = 'nginx:latest';
    delete newStep.command;
  }
  
  editorSteps.push(newStep);
  
  const stepElement = createStepElement(newStep, editorSteps.length - 1);
  stepElement.style.left = `${x - 75}px`;
  stepElement.style.top = `${y - 50}px`;
  
  canvas.appendChild(stepElement);
  
  addLogEntry('info', `➕ Componente ${type} agregado al flujo`);
}

// Modal management
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById('modal-overlay');
  
  if (modal && overlay) {
    overlay.classList.add('active');
    modal.classList.add('active');
  }
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  const overlay = document.getElementById('modal-overlay');
  
  if (modal && overlay) {
    overlay.classList.remove('active');
    modal.classList.remove('active');
  }
}

function hideAllModals() {
  const modals = document.querySelectorAll('.modal');
  const overlay = document.getElementById('modal-overlay');
  
  modals.forEach(modal => {
    modal.classList.remove('active');
  });
  
  if (overlay) {
    overlay.classList.remove('active');
  }
}

// Utility functions
function toggleTheme() {
  const body = document.body;
  const currentTheme = body.getAttribute('data-color-scheme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  body.setAttribute('data-color-scheme', newTheme);
  
  const themeButton = document.getElementById('theme-toggle');
  if (themeButton) {
    themeButton.textContent = newTheme === 'dark' ? '☀️ Tema' : '🌙 Tema';
  }
}

function createNewFlow() {
  currentFlow = {
    name: '',
    description: '',
    mode: 'native',
    steps: [],
    env_vars: {}
  };
  
  editorSteps = [];
  
  // Reset form
  const flowName = document.getElementById('flow-name');
  const flowDescription = document.getElementById('flow-description');
  const flowMode = document.getElementById('flow-mode');
  
  if (flowName) flowName.value = '';
  if (flowDescription) flowDescription.value = '';
  if (flowMode) flowMode.value = 'native';
  
  // Clear env vars
  const envVarsContainer = document.getElementById('env-vars-container');
  if (envVarsContainer) {
    envVarsContainer.innerHTML = `
      <div class="env-var-item">
        <input type="text" class="form-control" placeholder="Variable" style="width: 45%;">
        <input type="text" class="form-control" placeholder="Valor" style="width: 45%;">
        <button type="button" class="btn btn--outline btn--sm" onclick="this.parentElement.remove()">🗑️</button>
      </div>
    `;
  }
  
  showModal('flow-config-modal');
}

function saveCurrentFlow() {
  if (!currentFlow) return;
  
  currentFlow.steps = [...editorSteps];
  
  const existingFlowIndex = appData.flows.findIndex(f => f.name === currentFlow.name);
  if (existingFlowIndex !== -1) {
    appData.flows[existingFlowIndex] = currentFlow;
  } else {
    appData.flows.push(currentFlow);
  }
  
  loadFlows();
  addLogEntry('success', `✓ Flujo "${currentFlow.name}" guardado exitosamente`);
}

function testCurrentFlow() {
  if (!currentFlow || editorSteps.length === 0) {
    addLogEntry('warning', '⚠️ No hay pasos para probar');
    return;
  }
  
  addLogEntry('info', `🧪 Probando flujo: ${currentFlow.name}`);
  
  setTimeout(() => {
    const success = Math.random() > 0.3;
    if (success) {
      addLogEntry('success', '✓ Prueba exitosa - El flujo está configurado correctamente');
    } else {
      addLogEntry('error', '✗ Prueba fallida - Verifica la configuración');
    }
  }, 1000);
}

function duplicateFlow(flowName) {
  const flow = appData.flows.find(f => f.name === flowName);
  if (!flow) return;
  
  const duplicatedFlow = {
    ...flow,
    name: `${flow.name} (Copia)`,
    version: '1.0.0'
  };
  
  appData.flows.push(duplicatedFlow);
  loadFlows();
  
  addLogEntry('success', `✓ Flujo "${flowName}" duplicado exitosamente`);
}

function editStepConfig(index) {
  const step = editorSteps[index];
  if (!step) return;
  
  currentEditingStepIndex = index;
  
  const componentName = document.getElementById('component-name');
  const componentCommand = document.getElementById('component-command');
  const componentTimeout = document.getElementById('component-timeout');
  
  if (componentName) componentName.value = step.name;
  if (componentCommand) componentCommand.value = step.command || step.image || '';
  if (componentTimeout) componentTimeout.value = step.timeout || 30;
  
  showModal('component-modal');
}

function deleteStep(index) {
  if (confirm('¿Estás seguro de que quieres eliminar este paso?')) {
    editorSteps.splice(index, 1);
    loadFlowIntoEditor({ steps: editorSteps });
    addLogEntry('info', `🗑️ Paso eliminado del flujo`);
  }
}

function addEnvironmentVariable() {
  const container = document.getElementById('env-vars-container');
  if (!container) return;
  
  const envVarItem = document.createElement('div');
  envVarItem.className = 'env-var-item';
  envVarItem.innerHTML = `
    <input type="text" class="form-control" placeholder="Variable" style="width: 45%;">
    <input type="text" class="form-control" placeholder="Valor" style="width: 45%;">
    <button type="button" class="btn btn--outline btn--sm" onclick="this.parentElement.remove()">🗑️</button>
  `;
  container.appendChild(envVarItem);
}

function handleFlowConfigSubmit(e) {
  e.preventDefault();
  
  const flowName = document.getElementById('flow-name').value;
  const flowDescription = document.getElementById('flow-description').value;
  const flowMode = document.getElementById('flow-mode').value;
  
  if (!flowName.trim()) {
    addLogEntry('error', '✗ El nombre del flujo es requerido');
    return;
  }
  
  if (!currentFlow) {
    currentFlow = {
      name: flowName,
      description: flowDescription,
      mode: flowMode,
      version: '1.0.0',
      steps: [],
      env_vars: {},
      dependencies: {},
      healthcheck: {
        interval: '30s',
        timeout: '10s',
        retries: 3
      }
    };
  } else {
    currentFlow.name = flowName;
    currentFlow.description = flowDescription;
    currentFlow.mode = flowMode;
  }
  
  // Collect environment variables
  const envVarItems = document.querySelectorAll('#env-vars-container .env-var-item');
  const envVars = {};
  envVarItems.forEach(item => {
    const inputs = item.querySelectorAll('input');
    if (inputs[0].value.trim() && inputs[1].value.trim()) {
      envVars[inputs[0].value.trim()] = inputs[1].value.trim();
    }
  });
  currentFlow.env_vars = envVars;
  
  hideModal('flow-config-modal');
  
  const editorSection = document.getElementById('editor-section');
  if (editorSection) {
    editorSection.style.display = 'block';
    editorSection.scrollIntoView({ behavior: 'smooth' });
  }
  
  loadFlowIntoEditor(currentFlow);
  addLogEntry('success', `✓ Configuración del flujo "${flowName}" guardada`);
}

function handleComponentSubmit(e) {
  e.preventDefault();
  
  const componentName = document.getElementById('component-name').value;
  const componentCommand = document.getElementById('component-command').value;
  const componentTimeout = document.getElementById('component-timeout').value;
  
  if (!componentName.trim()) {
    addLogEntry('error', '✗ El nombre del componente es requerido');
    return;
  }
  
  if (currentEditingStepIndex !== -1) {
    editorSteps[currentEditingStepIndex].name = componentName;
    editorSteps[currentEditingStepIndex].command = componentCommand;
    editorSteps[currentEditingStepIndex].timeout = parseInt(componentTimeout);
    
    loadFlowIntoEditor({ steps: editorSteps });
    addLogEntry('success', `✓ Componente "${componentName}" actualizado`);
  }
  
  hideModal('component-modal');
  currentEditingStepIndex = -1;
}