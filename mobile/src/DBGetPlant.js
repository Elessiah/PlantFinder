const DBGetPlant = async (db, plantName) => {
       return (await db.getFirstAsync(`SELECT * FROM Plant WHERE name = ?`, [plantName]));
}

module.exports = DBGetPlant;