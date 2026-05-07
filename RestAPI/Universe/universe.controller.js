import userService from "./universe.service.js";

export const createUser = (req, res) => {
    const user = userService.createUser(req);
    res.status(201).json(user);
};

export const getUsers = (req, res) => {
    const users = userService.getUsers();
    res.json(users);
};

console.log("Controller exports:", { createUser, getUsers });
export default {
    createUser,
    getUsers
};