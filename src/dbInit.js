const dbInit = (db) => {
    db.execSync("CREATE TABLE IF NOT EXISTS Plant (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, symptoms TEXT, contradication TEXT, parts TEXT);" +
                "CREATE TABLE IF NOT EXISTS keywords (id INTEGER PRIMARY KEY AUTOINCREMENT, id_plant INTEGER, word TEXT);");
}

module.exports = dbInit;