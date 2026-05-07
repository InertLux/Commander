//UniverseDB.js

import Database from "better-sqlite3";
import { initializeDatabaseSchema } from "./DBObjectHelpers.js"; // Object based SQLite Database Operations
import {DatabaseMigrator} from "./DBHelpers.js"
import { UniverseDataBase } from "../DataTables.js";

// Create database connection
const UniverseDB = new Database("database_universe.sqlite", {
  verbose: console.log,
});
// Create database connection
const UniverseBackup = new Database("database_universe_backup.sqlite", {
  verbose: console.log,
});

export async function BuildUniverse(){
  // Build table definitions object from UniverseDataBase
  const tableDefinitions = Object.entries(UniverseDataBase).reduce((acc, [key, tableConfig]) => {
    acc[key] = { [key]: tableConfig };
    return acc;
  }, {});

  // Initialize database schema
  const db = initializeDatabaseSchema(tableDefinitions);
  // Execute migration with pre-built statements
  const migrator = new DatabaseMigrator(UniverseDB, UniverseBackup);

// Do this:
db.statements.forEach((statement, index) => {
  if(false)console.log(`\n[${index}] Executing:\n${statement}\n`);
  try {

  const defaultRow = db.defaultInserts ? db.defaultInserts:null;
  const schema = db.schema ? db.schema:null;
  const result = migrator.executeMigration(schema, defaultRow);


  } catch (error) {
    console.error(`✗ FAILED at statement ${index}:`);
    console.error(`Statement:\n${statement}`);
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
});
}


// Export both the raw database connection and the schema interface
export {UniverseDB};
