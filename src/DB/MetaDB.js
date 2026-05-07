const Database = require("better-sqlite3");

const MetaDB = new Database("database_meta.sqlite", {
    verbose: console.log,
});

//For Type data is used to add component data to Universe Types. Valid Targets: Universe, World, Region, Character... ect. 
//definition must be a json file defining a C++ struct type. which will then be parsed into a table definiton using interal type match/remap function.
//Example: { "Type" : ["int", "string", "object"]]} subject to change.
MetaDB.prepare('CREATE TABLE IF NOT EXISTS TypeData (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, target TEXT, tags TEXT, definition TEXT)'
).run();
MetaDB.prepare('CREATE TABLE IF NOT EXISTS encyclopedia (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT,tags TEXT, text TEXT)'
).run();

module.exports = MetaDB;
