import getKeywords from "./getKeywords.js";

export default async function LoadData(event, setDialogText) {
    try {
        const files = Array.from(event.target.files);
        if (files.length === 0) {
            return;
        }

        const formatColumn = (column) => {
          return column.replace("'", "\\qu").replace('"', "\\dqu").trim();
        };

        let nFile = 0;
        for (const file of files) {

            const fileContent = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.onerror = (error) => reject(error);
                reader.readAsText(file);
            });

            const lines = fileContent.split("\n");
            let nLine = 0;
            for (let line of lines) {
                line = line.replace(';', ',');
                const columns = line.split(",");

                const plantName = formatColumn(columns[0]);
                const symptoms = formatColumn(columns[1]);
                const keywords = getKeywords(symptoms);
                const contradication = formatColumn(columns[2]);
                const parts = formatColumn(columns[3]);

                let plant = await window.electron.getPlant(plantName);
                if (!plant) {
                    await window.electron.insertPlant({plantName: plantName, symptoms: symptoms, contradication: contradication, parts: parts});
                    plant = await window.electron.getPlant(plantName);
                } else {
                    await window.electron.updatePlant({plant: plant, symptoms: symptoms, contradication: contradication, parts: parts});
                }
                await window.electron.updateKeywords({ plant: plant, keywords: keywords });
                nLine += 1;
                setDialogText(`Chargement des données de <b>${file.name}</b> : <i>${(nLine * 100 / lines.length).toFixed(1)}%</i>`);
            }
            nFile++;
        }

        event.target.value = "";
    } catch (e) {
        console.error('Erreur lors du chargement du fichier csv :', e.message);
    }
}