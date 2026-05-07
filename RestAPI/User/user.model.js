require("../../src/app");
const UserDB = require("../../src/DB/UserDB");


module.exports = {
    createUser: (name, email) => {
        const stmt = UserDB.prepare("INSERT INTO users (name,email) VALUES (?,?)");
        const result = stmt.run(name, email);
        return { id: result.lastInsertRowid,name,email};
    },
    getAllUsers: () => {
        return UserDB.prepare("SELECT id, name FROM users").all();
    }
};