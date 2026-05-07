const userService = require("./user.service");

module.exports = {

createUser: (req,res) => {
const user = userService.createUser(req);
res.status(201).json(user);
},
getUsers: (req, res) => {
const users = userService.getUsers();
res.json(users);
}






};
console.log("Controller exports:", module.exports);