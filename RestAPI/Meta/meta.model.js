require("../../src/app");
const MetaDB = require("../../src/DB/MetaDB");

//For Type data is used to add component data to Universe Types. Valid Targets: Universe, World, Region, Character... ect. 
//definition must be a json file defining a C++ struct type. which will then be parsed into a table definiton using interal type match/remap function.
//Example: { "Type" : ["int", "string", "object"]]} subject to change.
MetaDB.prepare('CREATE TABLE IF NOT EXISTS TypeData (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, target TEXT, tags TEXT, definition TEXT)'
).run();
MetaDB.prepare('CREATE TABLE IF NOT EXISTS encyclopedia (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT,tags TEXT, text TEXT)'
).run();

module.exports = {
    getAllEncyclopediaEntries: () => {
        return MetaDB.prepare("SELECT id, name, description,tags FROM encyclopedia").all();
    },    
    getEncyclopediaEntry: (id) => {
            return MetaDB
        .prepare("SELECT id, name, description, tags, text FROM encyclopedia WHERE id = ?")
        .get(id);
    },
    addEncyclopediaEntry: (name, description, tags, text) => {
        const result = MetaDB
        .prepare("INSERT INTO encyclopedia (name, description, tags, text) VALUES (?, ?, ?, ?)")
        .run(name, description, tags, text);

        return result.lastInsertRowid;
    },
    removeEncyclopediaEntry: (id) => {
      return MetaDB
        .prepare("DELETE FROM encyclopedia WHERE id = ?")
        .run(id);
    },
    getEncyclopediaEntryText: (id) => {
            return MetaDB
        .prepare("SELECT text FROM encyclopedia WHERE id = ?")
        .get(id);
    },
    setEncyclopediaEntryText: (id, text) => {
     return MetaDB
        .prepare("UPDATE encyclopedia SET text = ? WHERE id = ?")
        .run(text, id);
    },
    setEncyclopediaEntryDescription: (id, text) => {
    return MetaDB
        .prepare("UPDATE encyclopedia SET description = ? WHERE id = ?")
        .run(description, id);
    },
    setEncyclopediaEntryTags: (id, text) => {
    return MetaDB
        .prepare("UPDATE encyclopedia SET tags = ? WHERE id = ?")
        .run(tags, id);
    }
};