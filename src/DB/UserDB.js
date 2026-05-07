const Database = require("better-sqlite3");

const UserDB = new Database("database_user.sqlite", {
    verbose: console.log,
});

UserDB.prepare('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT,tags TEXT,permissions INTEGER)'
).run();

module.exports = UserDB;
