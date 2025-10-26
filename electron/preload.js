// 👨‍💻 Michael Santos - Tech Lead
// Bridge seguro entre Electron e React - Expõe apenas APIs necessárias

const { contextBridge, ipcRenderer } = require('electron');

/**
 * API segura exposta para o renderer process (React)
 */
contextBridge.exposeInMainWorld('electron', {
  // Informações do sistema
  getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
  
  // Licenciamento
  validateLicense: (licenseKey) => ipcRenderer.invoke('validate-license', licenseKey),
  
  // Sistema de arquivos
  getPath: (name) => ipcRenderer.invoke('get-path', name),
  openBackupsFolder: () => ipcRenderer.invoke('open-backups-folder'),
  
  // App
  restartApp: () => ipcRenderer.invoke('restart-app'),
  
  // Versão
  version: process.versions.electron,
});

console.log('✅ Preload script carregado');