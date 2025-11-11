const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('show-open-dialog'),
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args)
});
