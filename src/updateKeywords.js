const updateKeywords = async (db, plant, keywords) => {
    if (keywords.length === 0) {
        console.log("No Keywords updated !");
        return;
    }
    let currentKeywords = await db.getAllAsync(`SELECT word
                                                  FROM keywords
                                                  WHERE id_plant = ?`, plant.id);
    currentKeywords = currentKeywords.map(obj => obj.word);
    let newKeywords = keywords;
    if (currentKeywords.length > 0) {
        newKeywords = keywords.filter(item => !currentKeywords.includes(item));
    }
    let query = "";
    for (const keyword of newKeywords) {
        query += `INSERT INTO keywords (id_plant, word)
                  VALUES (${plant.id}, '${keyword}');  `;
    }
    await db.execAsync(query);
}

module.exports = updateKeywords;