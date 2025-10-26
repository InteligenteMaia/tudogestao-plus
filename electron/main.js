// 👨‍💻 Michael Santos - Tech Lead
// Processo principal do Electron - Gerencia janelas e ciclo de vida do app

const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const Store = require('electron-store');
const licenseManager = require('../backend/services/security/license');

// Store para configurações persistentes
const store = new Store();

let mainWindow;
let backendProcess;

// Configuração da aplicação
const isDev = process.env.NODE_ENV === 'development';
const APP_URL = isDev ? 'http://localhost:5173' : `file://${path.join(__dirname, '../dist/index.html')}`;

/**
 * Cria a janela principal da aplicação
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#F5F5F7',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hiddenInset', // macOS style
    frame: true,
    show: false, // Não mostrar até carregar
  });

  // Remove menu padrão
  Menu.setApplicationMenu(null);

  // Carrega a aplicação
  mainWindow.loadURL(APP_URL);

  // Mostra janela quando pronta
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // DevTools em desenvolvimento
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // Evento de fechar
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Inicia o servidor backend Node.js
 */
function startBackend() {
  if (isDev) {
    // Em dev, o backend roda separadamente via npm run dev:backend
    return;
  }

  const { spawn } = require('child_process');
  const backendPath = path.join(__dirname, '../backend/server.js');
  
  backendProcess = spawn('node', [backendPath], {
    stdio: 'inherit',
  });

  backendProcess.on('error', (err) => {
    console.error('❌ Erro ao iniciar backend:', err);
  });
}

/**
 * Inicializa a aplicação
 */
app.whenReady().then(() => {
  // Verifica licença antes de iniciar
  const license = licenseManager.loadLicense();
  
  if (!license || !license.valid) {
    // Mostra tela de ativação
    createActivationWindow();
    return;
  }

  // Inicia backend
  startBackend();

  // Cria janela principal
  createWindow();

  // macOS - Recria janela ao clicar no dock
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

/**
 * Fecha aplicação quando todas as janelas forem fechadas
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * Cleanup ao sair
 */
app.on('quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

/**
 * Janela de ativação da licença
 */
function createActivationWindow() {
  const activationWindow = new BrowserWindow({
    width: 600,
    height: 400,
    resizable: false,
    frame: false,
    backgroundColor: '#FFFFFF',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const activationURL = isDev 
    ? 'http://localhost:5173/activation' 
    : `file://${path.join(__dirname, '../dist/activation.html')}`;

  activationWindow.loadURL(activationURL);
}

// ========== IPC HANDLERS ==========

/**
 * Valida licença
 */
ipcMain.handle('validate-license', async (event, licenseKey) => {
  try {
    const result = licenseManager.saveLicense(licenseKey);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

/**
 * Retorna informações do sistema
 */
ipcMain.handle('get-system-info', async () => {
  const { machineId } = require('node-machine-id');
  
  return {
    platform: process.platform,
    arch: process.arch,
    version: app.getVersion(),
    hwid: machineId.machineIdSync(),
  };
});

/**
 * Obtém caminho para salvar arquivos
 */
ipcMain.handle('get-path', async (event, name) => {
  return app.getPath(name);
});

/**
 * Abre diretório de backups
 */
ipcMain.handle('open-backups-folder', async () => {
  const { shell } = require('electron');
  const backupsPath = path.join(app.getPath('userData'), 'backups');
  
  if (!fs.existsSync(backupsPath)) {
    fs.mkdirSync(backupsPath, { recursive: true });
  }
  
  shell.openPath(backupsPath);
});

/**
 * Reinicia aplicação
 */
ipcMain.handle('restart-app', () => {
  app.relaunch();
  app.exit();
});

console.log('✅ TudoGestão+ Electron inicializado');