import getKeywords from "./getKeywords.js";

export default async function LoadData(event) {
    try {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = async (parser) => {
            const lines = parser.target.result.split("\n");
            for (let line of lines) {
                line = line.replace(';', ',');
                const columns = line.split(',');
                const plantName = columns[0].replace("'", "\\qu").replace('"', "\\dqu").trimStart().trimEnd();
                const symptoms = columns[1].replace("'", "\\qu").replace('"', "\\dqu").trimStart().trimEnd();
                const keywords = getKeywords(columns[1]);
                const contradication = columns[2].replace("'", "\\qu").replace('"', "\\dqu").trimStart().trimEnd();
                const parts = columns[3].replace("'", "\\qu").replace('"', "\\dqu").trimStart().trimEnd();
                let plant = await window.electron.getPlant(plantName);
                if (plant === null || plant === undefined) {
                    await window.electron.insertPlant({
                        plantName: plantName,
                        symptoms: symptoms,
                        contradication: contradication,
                        parts: parts,
                    });
                    plant = await window.electron.getPlant(plantName);
                }
                else {
                    await window.electron.updatePlant({
                        plant: plant,
                        symptoms: symptoms,
                        contradication: contradication,
                        parts: parts,
                    });
                }
                await window.electron.updateKeywords({
                    plant: plant,
                    keywords: keywords,
                });
            }
        }
        reader.readAsText(file);
    } catch (e) {
        console.log('Erreur lors du chargement du fichier csv :', e.message);
    }
}