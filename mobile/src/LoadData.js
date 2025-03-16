import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import getKeywords from "./getKeywords";
import DBGetPlant from "./DBGetPlant";
import insertPlant from "./insertPlant";
import updatePlant from "./updatePlant";
import updateKeywords from "./updateKeywords";

async function LoadData (db) {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: 'text/csv',
            copyToCacheDirectory: true,
        });
        if (result.canceled === false) {
            try {
                for (const asset of result.assets) {
                    const content = await FileSystem.readAsStringAsync(asset.uri);
                    const lines = content.split('\n');
                    for (let line of lines) {
                        line = line.replace(';', ',');
                        const columns = line.split(',');
                        const plantName = columns[0].replace("'", "\\qu").replace('"', "\\dqu").trimStart().trimEnd();
                        const symptoms = columns[1].replace("'", "\\qu").replace('"', "\\dqu").trimStart().trimEnd();
                        const keywords = getKeywords(columns[1]);
                        const contradication = columns[2].replace("'", "\\qu").replace('"', "\\dqu").trimStart().trimEnd();
                        const parts = columns[3].replace("'", "\\qu").replace('"', "\\dqu").trimStart().trimEnd();
                        let plant = await DBGetPlant(db, plantName);
                        if (plant === null)
                            plant = await insertPlant(db, plantName, symptoms, contradication, parts);
                        else
                            await updatePlant(db, plant, symptoms, contradication, parts);
                        await updateKeywords(db, plant, keywords);
                    }
                }
            } catch (e) {
                console.error("Erreur lors du traitement des donnée" , e.message);
            }
        }
        else
            console.log("No data found.");
    } catch (error) {
        console.log('Erreur lors du chargement du fichier csv :', error.message);
    }
}

module.exports = LoadData;