function updateData(db, keywords, setData) {
    let query = "SELECT id_plant FROM keywords WHERE";
    for (let i = 0; i < keywords.length; i++) {
        query += ` word = '${keywords[i]}'`;
        if (i + 1 < keywords.length) {
            query += ' OR';
        }
    }
    const matchs = db.getAllSync(query);
    if (matchs.length === 0)
        return;
    let plants = new Map();
    for (const match of matchs) {
        plants.set(match.id_plant, (plants.get(match.id_plant) || 0) + 1);
    }
    // Maintenant format trié : [["id": count]]
    plants = Array.from(plants)
        .sort((a, b) => b[1] - a[1])
        .map(item => item[0]);
    query = "SELECT * FROM Plant WHERE";
    for (let i = 0; i < plants.length; i++) {
        query += ` id = ${plants[i]}`;
        if (i + 1 < plants.length) {
            query += ' OR';
        }
    }
    setData(db.getAllSync(query).sort((x, y) => plants.indexOf(x.id) - plants.indexOf(y.id)));
}

module.exports = updateData;