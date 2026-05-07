// DBHelpers.js

function generateSQLiteTable(schematicDefinition, tableName) {
  try {
    if (!schematicDefinition || !tableName) {
      throw new Error('Missing required parameters: schematicDefinition and tableName');
    }

    const table = schematicDefinition.table;
    const defaultValues = schematicDefinition.defaultValue;


    if (!table || typeof table !== 'object') {
      throw new Error('Invalid Table definition in schematicDefinition');
    }

    const columnDefinitions = Object.entries(table).map(([columnName, columnType]) => {
      let definition = `${columnName} ${columnType}`;

      if (defaultValues.hasOwnProperty(columnName) && defaultValues[columnName] !== null) {
        const defaultVal = defaultValues[columnName];
        const formattedValue = typeof defaultVal === 'string'
          ? `'${defaultVal}'`
          : defaultVal;

        definition += ` DEFAULT ${formattedValue}`;
      }

      return definition;
    }).join(',\n  ');

    const createTableSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (
  ${columnDefinitions}
);`;

    console.log(`✓ Generated CREATE TABLE for "${tableName}"`);
    return createTableSQL;
  } catch (error) {
    console.error(`✗ Error generating SQLite table: ${error.message}`);
    return null;
  }
}

function generateInsertDefaultRow(schematicDefinition, tableName) {
  try {
    if (!schematicDefinition || !tableName) {
      throw new Error('Missing required parameters: schematicDefinition and tableName');
    }

    const defaultValues = schematicDefinition.defaultValue;

    if (!defaultValues || typeof defaultValues !== 'object') {
      throw new Error('Invalid DefaultValue definition in schematicDefinition');
    }

    const columns = [];
    const values = [];

    Object.entries(defaultValues).forEach(([columnName, defaultVal]) => {
      if (defaultVal !== null) {
        columns.push(columnName);
        const formattedValue = typeof defaultVal === 'string' && !isSQLFunction(defaultVal)
          ? `'${defaultVal}'`
          : defaultVal;
        values.push(formattedValue);
      }
    });

    if (columns.length === 0) {
      console.log(`ℹ No default values to insert for table "${tableName}"`);
      return null;
    }

    const insertSQL = `INSERT OR REPLACE INTO ${tableName} (${columns.join(', ')})
VALUES (${values.join(', ')});`;

    console.log(`✓ Generated default INSERT OR REPLACE INTO "${tableName}"`);
    return insertSQL;
  } catch (error) {
    console.error(`✗ Error generating default insert row: ${error.message}`);
    return null;
  }
}

function generateInsertFromValues(tableName, valueObject) {
  try {
    if (!tableName || typeof tableName !== 'string') {
      throw new Error('Invalid tableName parameter');
    }

    if (!valueObject || typeof valueObject !== 'object') {
      throw new Error('Invalid valueObject parameter');
    }

    const columns = [];
    const values = [];

    Object.entries(valueObject).forEach(([columnName, value]) => {
      if (value !== null && value !== undefined) {
        columns.push(columnName);
        const formattedValue = typeof value === 'string' && !isSQLFunction(value)
          ? `'${escapeSQLString(value)}'`
          : value;
        values.push(formattedValue);
      }
    });

    if (columns.length === 0) {
      console.warn(`⚠ No values to insert for table "${tableName}" (all values are null/undefined)`);
      return null;
    }

    const insertSQL = `INSERT INTO ${tableName} (${columns.join(', ')})
VALUES (${values.join(', ')});`;

    console.log(`✓ Generated INSERT for "${tableName}" with ${columns.length} column(s)`);
    return insertSQL;
  } catch (error) {
    console.error(`✗ Error generating insert statement: ${error.message}`);
    return null;
  }
}

function generateUpdateFromValues(tableName, valueObject, whereClause = 'id = 1') {
  try {
    if (!tableName || typeof tableName !== 'string') {
      throw new Error('Invalid tableName parameter');
    }

    if (!valueObject || typeof valueObject !== 'object') {
      throw new Error('Invalid valueObject parameter');
    }

    if (!whereClause || typeof whereClause !== 'string') {
      throw new Error('Invalid whereClause parameter');
    }

    const updates = [];

    Object.entries(valueObject).forEach(([columnName, value]) => {
      if (value !== null && value !== undefined && columnName !== 'id') {
        const formattedValue = typeof value === 'string' && !isSQLFunction(value)
          ? `'${escapeSQLString(value)}'`
          : value;
        updates.push(`${columnName} = ${formattedValue}`);
      }
    });

    if (updates.length === 0) {
      console.warn(`⚠ No valid updates for table "${tableName}"`);
      return null;
    }

    const updateSQL = `UPDATE ${tableName}
SET ${updates.join(', ')}
WHERE ${whereClause};`;

    console.log(`✓ Generated UPDATE for "${tableName}" with WHERE clause: ${whereClause}`);
    return updateSQL;
  } catch (error) {
    console.error(`✗ Error generating update statement: ${error.message}`);
    return null;
  }
}

function isSQLFunction(value) {
  try {
    if (value === null || value === undefined || typeof value !== 'string') {
      return false;
    }

    const sqlFunctions = ['CURRENT_TIMESTAMP', 'CURRENT_DATE', 'CURRENT_TIME'];
    return sqlFunctions.some(fn => value.toUpperCase() === fn);
  } catch (error) {
    console.error(`✗ Error checking SQL function: ${error.message}`);
    return false;
  }
}

function escapeSQLString(value) {
  try {
    if (value === null || value === undefined) {
      return '';
    }

    return value.toString().replace(/'/g, "''");
  } catch (error) {
    console.error(`✗ Error escaping SQL string: ${error.message}`);
    return '';
  }
}

/**
 * Initialize database from table definitions
 * @param {Object} tableDefinitions - Object with table definition objects (e.g., Character, Schematic)
 * @returns {Object} Database interface with schema and defaultrow properties, plus methods
 */
export function initializeDatabaseSchema(tableDefinitions) {
  try {
    if (!tableDefinitions || typeof tableDefinitions !== 'object') {
      throw new Error('Invalid tableDefinitions parameter');
    }

    const sqlStatements = [];
    const tableMap = new Map();
    const tableNameMap = new Map();
    const schemaStatements = [];
    const defaultRowStatements = [];

    console.log(`\n📦 Initializing database schema with ${Object.keys(tableDefinitions).length} table(s)...`);

    // Process all table definitions
    Object.entries(tableDefinitions).forEach(([tableKey, tableConfig]) => {
      try {
        if (!tableConfig || typeof tableConfig !== 'object') {
          throw new Error(`Invalid table config for key: ${tableKey}`);
        }

        const nestedKey = Object.keys(tableConfig)[0];
        if (!nestedKey) {
          throw new Error(`No nested key found in table config for: ${tableKey}`);
        }

        const schematic = tableConfig[nestedKey];
        if (!schematic.tableName) {
          throw new Error(`No TableName defined for table key: ${tableKey}`);
        }

        const tableName = schematic.tableName;

        const tableInfo = {
          tableKey,
          tableName,
          definition: schematic,
          icon: schematic.icon || null,
          viewerPath: schematic.viewerPath || '',
          editorPath: schematic.editorPath || ''
        };

        tableMap.set(tableKey, tableInfo);
        tableNameMap.set(tableName, tableInfo);

        const createSQL = generateSQLiteTable(schematic, tableName);
        if (createSQL) {
          sqlStatements.push(createSQL);
          schemaStatements.push(createSQL);
        }

        const insertSQL = generateInsertDefaultRow(schematic, tableName);
        if (insertSQL) {
          sqlStatements.push(insertSQL);
          defaultRowStatements.push(insertSQL);
        }

        console.log(`✓ Registered table "${tableName}" with key "${tableKey}"`);
      } catch (error) {
        console.error(`✗ Error processing table definition for "${tableKey}": ${error.message}`);
      }
    });

    console.log(`✓ Database schema initialization complete\n`);

    return {
      // Required return format
      schema: schemaStatements.join('\n\n'),
      defaultrow: defaultRowStatements.join('\n\n'),

      // Original properties
      initSQL: sqlStatements.join('\n\n'),
      statements: sqlStatements,
      tableMap,

      TableSet(operation) {
        try {
          if (!operation || typeof operation !== 'object') {
            throw new Error('Invalid operation parameter');
          }

          const { target, insertData } = operation;

          if (!target) {
            throw new Error('TableSet requires a "target" field');
          }
          if (!insertData) {
            throw new Error('TableSet requires an "InsertData" field');
          }

          const tableInfo = tableMap.get(target);
          if (!tableInfo) {
            throw new Error(`Table not found for target: ${target}`);
          }

          const result = generateInsertFromValues(tableInfo.tableName, insertData);
          if (result) {
            console.log(`✓ TableSet operation successful for target: ${target}`);
          }
          return result;
        } catch (error) {
          console.error(`✗ TableSet error: ${error.message}`);
          return null;
        }
      },

      TableUpdate(operation) {
        try {
          if (!operation || typeof operation !== 'object') {
            throw new Error('Invalid operation parameter');
          }

          const { target, UpdateData, where = 'id = 1' } = operation;

          if (!target) {
            throw new Error('TableUpdate requires a "target" field');
          }
          if (!UpdateData) {
            throw new Error('TableUpdate requires an "UpdateData" field');
          }

          const tableInfo = tableMap.get(target);
          if (!tableInfo) {
            throw new Error(`Table not found for target: ${target}`);
          }

          const result = generateUpdateFromValues(tableInfo.tableName, UpdateData, where);
          if (result) {
            console.log(`✓ TableUpdate operation successful for target: ${target}`);
          }
          return result;
        } catch (error) {
          console.error(`✗ TableUpdate error: ${error.message}`);
          return null;
        }
      },

      TableUpsert(operation) {
        try {
          if (!operation || typeof operation !== 'object') {
            throw new Error('Invalid operation parameter');
          }

          const { target, insertData } = operation;

          if (!target) {
            throw new Error('TableUpsert requires a "target" field');
          }
          if (!insertData) {
            throw new Error('TableUpsert requires an "InsertData" field');
          }

          const tableInfo = tableMap.get(target);
          if (!tableInfo) {
            throw new Error(`Table not found for target: ${target}`);
          }

          const columns = [];
          const values = [];

          Object.entries(insertData).forEach(([columnName, value]) => {
            if (value !== null && value !== undefined) {
              columns.push(columnName);
              const formattedValue = typeof value === 'string' && !isSQLFunction(value)
                ? `'${escapeSQLString(value)}'`
                : value;
              values.push(formattedValue);
            }
          });

          if (columns.length === 0) {
            console.warn(`⚠ No values to upsert for table "${target}"`);
            return null;
          }

          const upsertSQL = `INSERT OR REPLACE INTO ${tableInfo.tableName} (${columns.join(', ')})
VALUES (${values.join(', ')});`;

          console.log(`✓ TableUpsert operation successful for target: ${target}`);
          return upsertSQL;
        } catch (error) {
          console.error(`✗ TableUpsert error: ${error.message}`);
          return null;
        }
      },

      TableBatchSet(operation) {
        try {
          if (!operation || typeof operation !== 'object') {
            throw new Error('Invalid operation parameter');
          }

          const { target, insertDataArray } = operation;

          if (!target) {
            throw new Error('TableBatchSet requires a "target" field');
          }
          if (!Array.isArray(insertDataArray)) {
            throw new Error('TableBatchSet requires an "InsertDataArray" field (must be an array)');
          }

          const tableInfo = tableMap.get(target);
          if (!tableInfo) {
            throw new Error(`Table not found for target: ${target}`);
          }

          const results = insertDataArray
            .map(obj => generateInsertFromValues(tableInfo.tableName, obj))
            .filter(sql => sql !== null);

          console.log(`✓ TableBatchSet operation successful: ${results.length} insert(s) generated for target: ${target}`);
          return results;
        } catch (error) {
          console.error(`✗ TableBatchSet error: ${error.message}`);
          return [];
        }
      },

      getTableName(tableKey) {
        try {
          if (!tableKey || typeof tableKey !== 'string') {
            throw new Error('Invalid tableKey parameter');
          }

          const tableInfo = tableMap.get(tableKey);
          if (!tableInfo) {
            throw new Error(`Table not found for key: ${tableKey}`);
          }

          console.log(`✓ Retrieved table name: ${tableInfo.tableName}`);
          return tableInfo.tableName;
        } catch (error) {
          console.error(`✗ getTableName error: ${error.message}`);
          return null;
        }
      },

      getTableDefinition(tableKey) {
        try {
          if (!tableKey || typeof tableKey !== 'string') {
            throw new Error('Invalid tableKey parameter');
          }

          const tableInfo = tableMap.get(tableKey);
          if (!tableInfo) {
            throw new Error(`Table not found for key: ${tableKey}`);
          }

          console.log(`✓ Retrieved table definition for: ${tableKey}`);
          return tableInfo.definition;
        } catch (error) {
          console.error(`✗ getTableDefinition error: ${error.message}`);
          return null;
        }
      },

      getAllTableNames() {
        try {
          const names = Array.from(tableMap.values()).map(info => info.tableName);
          console.log(`✓ Retrieved ${names.length} table name(s): ${names.join(', ')}`);
          return names;
        } catch (error) {
          console.error(`✗ getAllTableNames error: ${error.message}`);
          return [];
        }
      },

      getAllTableKeys() {
        try {
          const keys = Array.from(tableMap.keys());
          console.log(`✓ Retrieved ${keys.length} table key(s): ${keys.join(', ')}`);
          return keys;
        } catch (error) {
          console.error(`✗ getAllTableKeys error: ${error.message}`);
          return [];
        }
      }
    };
  } catch (error) {
    console.error(`✗ Critical error initializing database schema: ${error.message}`);
    return null;
  }
}


// ============ USAGE EXAMPLE ============

export const Character = {
  character: {
    tableName: "Character",
    icon: "game-icons-net/acorn.svg",
    viewerPath: "",
    editorPath: "",
    table: {
      id: "INTEGER PRIMARY KEY AUTOINCREMENT",
      name: "TEXT UNIQUE NOT NULL",
      description: "TEXT"
    },
    insertData: {
      id: null,
      name: null,
      description: null
    },
    defaultValue: {
      id: 0,
      name: null,
      description: null
    }
  }
};

export const Schematic = {
  schematic: {
    tableName: "Schematic",
    icon: "game-icons-net/castle.svg",
    viewerPath: "",
    editorPath: "",
    table: {
      id: "INTEGER PRIMARY KEY AUTOINCREMENT",
      name: "TEXT UNIQUE NOT NULL",
      description: "TEXT"
    },
    insertData: {
      id: null,
      name: null,
      description: null
    },
    defaultValue: {
      id: 0,
      name: null,
      description: null
    }
  }
};

// Initialize database with all table definitions
