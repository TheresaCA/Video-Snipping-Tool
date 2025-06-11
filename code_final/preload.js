const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getSources: () => {
    console.log('getSources called from renderer');
    return ipcRenderer.invoke('get-sources');
  },
  saveDialog: () => {
    console.log('saveDialog called from renderer');
    return ipcRenderer.invoke('save-dialog');
  },
  writeFile: (filePath, buffer) => {
    console.log('writeFile called with path:', filePath);
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, buffer, (err) => {
        if (err) {
          console.error('Error writing file:', err);
          reject(err);
        } else {
          console.log('File written successfully');
          resolve();
        }
      });
    });
  },
  // Expose Buffer to renderer process
  Buffer: {
    from: (data) => Buffer.from(data)
  }
});

// Add error handling for the context bridge
window.addEventListener('DOMContentLoaded', () => {
  console.log('Preload script loaded');
  console.log('electronAPI available:', !!window.electronAPI);
});