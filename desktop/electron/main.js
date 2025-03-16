import {app, BrowserWindow, ipcMain} from 'electron';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

let win;
const db = new Database('./plantFinder.db');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const preloadPath = path.resolve(__dirname, 'preload.cjs');

db.exec("CREATE TABLE IF NOT EXISTS Plant (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, symptoms TEXT, contradication TEXT, parts TEXT);" +
    "CREATE TABLE IF NOT EXISTS keywords (id INTEGER PRIMARY KEY AUTOINCREMENT, id_plant INTEGER, word TEXT);");

function createWindow() {
    win = new BrowserWindow({
        width: 900,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, 'preload.cjs'),
            nodeIntegration: true,
            contextIsolation: true,
        },
    });

    // win.loadURL('http://localhost:5173');
    win.loadFile(path.join(__dirname, '../dist', 'index.html'));
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle('reset', async (event) => {
    db.exec('DROP TABLE IF EXISTS Plant; DROP TABLE IF EXISTS keywords;');
    db.exec("CREATE TABLE IF NOT EXISTS Plant (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, symptoms TEXT, contradication TEXT, parts TEXT);" +
        "CREATE TABLE IF NOT EXISTS keywords (id INTEGER PRIMARY KEY AUTOINCREMENT, id_plant INTEGER, word TEXT);");
    return true;
});

ipcMain.handle('getPlant', async (event, plantName) => {
    const request = db.prepare('SELECT * FROM Plant WHERE name = ?;');
    return request.get(plantName);
});

ipcMain.handle('insertPlant', async (event, params) => {
    const { plantName, symptoms, contradication, parts } = params;
    const request = db.prepare('INSERT INTO Plant (name, symptoms, contradication, parts) VALUES (?, ?, ?, ?)');
    request.run(plantName, symptoms, contradication, parts);
});

ipcMain.handle('getPlantsFromKeywords', async (event, keywords) => {
    let query = "SELECT id_plant FROM keywords WHERE ";
    for (let i = 0; i < keywords.length; i++) {
        query += `word = '${keywords[i]}'`;
        if (i + 1 < keywords.length) {
            query += ' OR ';
        }
    }
    let request = db.prepare(query);
    const matchs = request.all();
    if (matchs.length === 0)
        return null;
    let plants = new Map();
    for (const match of matchs) {
        plants.set(match.id_plant, (plants.get(match.id_plant) || 0) + 1);
    }
    // Maintenant format trié : [["id": count]]
    plants = Array.from(plants)
        .sort((a, b) => b[1] - a[1])
        .map(item => item[0]);
    query = "SELECT * FROM Plant WHERE ";
    for (let i = 0; i < plants.length; i++) {
        query += ` id = ${plants[i]}`;
        if (i + 1 < plants.length) {
            query += ' OR';
        }
    }
    request = db.prepare(query);
    return (request.all().sort((x, y) => plants.indexOf(x.id) - plants.indexOf(y.id)));
});

ipcMain.handle('getPlantFromID', async (event, id) => {
   const request = db.prepare("SELECT * FROM Plant WHERE plant.id=?");
   return request.get(id);
});

ipcMain.handle('updateKeywords', async (event, params) => {
    const {plant, keywords} = params;
    if (keywords.length === 0) {
        console.log("No Keywords updated !");
        return;
    }
    let request = db.prepare('SELECT word FROM keywords WHERE id_plant = ?');
    let currentKeywords = request.all(plant.id);
    currentKeywords = currentKeywords.map(obj => obj.word);
    let newKeywords = keywords;
    if (currentKeywords.length > 0) {
        newKeywords = newKeywords.concat(keywords.filter(item => !currentKeywords.includes(item)));
    }
    request = db.prepare('INSERT INTO keywords (id_plant, word) VALUES (?, ?);');
    for (const keyword of newKeywords) {
        request.run(plant.id, keyword);
    }
});

ipcMain.handle('updatePlant', async (event, params) => {
    let { plant, symptoms, contradication, parts } = params;

    const filterNewValues = (existing, input) => {
        const newValues = input.split('/').filter(item => !existing.includes(item));
        return newValues.length ? newValues.join(' ') : '';
    }

    symptoms = filterNewValues(plant.symptoms, symptoms);
    contradication = filterNewValues(plant.contradication, contradication);
    parts = filterNewValues(plant.parts, parts);

    const joinValues = (existing, newValues) => newValues ? `${existing} ${newValues}`.trim() : existing;

    const request = db.prepare('UPDATE Plant SET symptoms = ?, contradication = ?, parts = ? WHERE name = ?');
    request.run(
        joinValues(plant.symptoms, symptoms),
        joinValues(plant.contradication, contradication),
        joinValues(plant.parts, parts),
        plant.name,
    );
});
