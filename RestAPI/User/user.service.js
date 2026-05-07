const User = require("./user.model");

module.exports = {
    createUser: (data) => {
        return User.createUser(data.name, data.email);
    },

    getUsers: () => {
        return User.getAllUsers();
    }
}