const UpdatePlant = async (db, plant, symptoms, contradication, parts) => {
    symptoms = symptoms.split('/').filter(item => !plant.symptoms.includes(item)).join(' ');
    contradication = contradication.split('/').filter(item => !plant.contradication.includes(item)).join(' ');
    parts = parts.split('/').filter(item => !plant.parts.includes(item)).join(' ');
    await db.runAsync(`UPDATE Plant SET symptoms = ?, contradication = ?, parts = ? WHERE name = ?`,
        plant.symptoms + " " + symptoms,
        plant.contradication + " " + contradication,
        plant.parts + " " + parts,
        plant.name);
}

module.exports = UpdatePlant;