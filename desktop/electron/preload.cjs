const { contextBridge, ipcRenderer } = require('electron');

console.log("Début de preload !");
window.addEventListener('DOMContentLoaded', () => {
    console.log('Preload script chargé !');
});

contextBridge.exposeInMainWorld('electron', {
    reset: () => ipcRenderer.invoke('reset'),
    getPlant: (plantName) => ipcRenderer.invoke('getPlant', plantName),
    insertPlant: (params) => ipcRenderer.invoke('insertPlant', params),
    getPlantsFromKeywords: (keywords) => ipcRenderer.invoke('getPlantsFromKeywords', keywords),
    getPlantFromID: (id) => ipcRenderer.invoke('getPlantFromID', id),
    updateKeywords: (params) => ipcRenderer.invoke('updateKeywords', params),
    updatePlant: (params) => ipcRenderer.invoke('updatePlant', params),
});
