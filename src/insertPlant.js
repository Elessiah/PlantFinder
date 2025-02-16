const DBGetPlant = require("./DBGetPlant");

const InsertPlant = async (db, plantName, symptoms, contradication, parts) => {
    await db.runAsync(`INSERT INTO Plant (name, symptoms, contradication, parts) VALUES (?, ?, ?, ?)`, plantName, symptoms, contradication, parts);
    return await DBGetPlant(db, plantName);
}

module.exports = InsertPlant;