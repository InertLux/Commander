import User from "./universe.model.js";

export const createUser = (data) => {
    return User.createUser(data.name, data.email);
};

export const getUsers = () => {
    return User.getAllUsers();
};
export default {
    createUser,
    getUsers
};