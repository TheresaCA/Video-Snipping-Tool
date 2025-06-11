const { app, BrowserWindow, ipcMain, desktopCapturer, dialog } = require('electron');
const path = require('path');
const os = require('os');

// Disable hardware acceleration to avoid GPU cache issues
app.disableHardwareAcceleration();

// Set a custom user data directory to avoid cache conflicts
const userDataPath = path.join(os.tmpdir(), 'screen-recorder-app');
app.setPath('userData', userDataPath);

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: false,
    },
  });

  mainWindow.loadFile('index.html');
  
  // Open DevTools for debugging (remove in production)
  // mainWindow.webContents.openDevTools();
});

// Handle app window closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('get-sources', async () => {
  try {
    console.log('get-sources handler called');
    const sources = await desktopCapturer.getSources({ types: ['window', 'screen'] });
    console.log('Sources found:', sources.length);
    return sources;
  } catch (error) {
    console.error('Error getting sources:', error);
    throw error;
  }
});

ipcMain.handle('save-dialog', async () => {
  try {
    console.log('save-dialog handler called');
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save Recording',
      defaultPath: path.join(os.homedir(), 'Desktop', `recording-${Date.now()}.webm`),
      filters: [
        { name: 'WebM Video', extensions: ['webm'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    console.log('Selected file path:', filePath);
    return filePath;
  } catch (error) {
    console.error('Error showing save dialog:', error);
    throw error;
  }
});

// Alternative: Auto-save to Desktop without dialog
ipcMain.handle('auto-save-path', async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `screen-recording-${timestamp}.webm`;
  return path.join(os.homedir(), 'Desktop', fileName);
});