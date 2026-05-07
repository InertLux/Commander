import { UniverseDB } from "../../src/DB/UniverseDB.js";
import "../../src/app.js";

// Create tables if they don't exist
UniverseDB.prepare('CREATE TABLE IF NOT EXISTS universe (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, tags TEXT, types TEXT)').run();
UniverseDB.prepare('CREATE TABLE IF NOT EXISTS world (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, tags TEXT, types TEXT)').run();
UniverseDB.prepare('CREATE TABLE IF NOT EXISTS region (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, tags TEXT, types TEXT)').run();
UniverseDB.prepare('CREATE TABLE IF NOT EXISTS characters (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, tags TEXT, types TEXT)').run();
UniverseDB.prepare('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, description TEXT, tags TEXT, types TEXT)').run();

// Export database query functions
export const getAllCharacters = () => {
    return UniverseDB.prepare("SELECT id, name, description FROM characters").all();
};

export const getAllItems = () => {
    return UniverseDB.prepare("SELECT id, name, description FROM items").all();
};

export const getAllUniverses = () => {
    return UniverseDB.prepare("SELECT id, name, description FROM universe").all();
};

export const getAllWorldsInUniverse = (universe) => {
    return UniverseDB.prepare("SELECT id, name, description FROM world WHERE universe = ?").all(universe);
};

export const getAllRegionsInWorld = (world) => {
    return UniverseDB.prepare("SELECT id, name, description FROM region").all();
};

export const createUser = (world) => {
    return UniverseDB.prepare("SELECT id, name, description FROM region").all();
};export const getAllUsers = (world) => {
    return UniverseDB.prepare("SELECT id, name, description FROM region").all();
};



export default {
    createUser,
    getAllUsers
};