/**
 * Execute migration pipeline with provided SQL statements
 * Works with better-sqlite3 synchronous Database instances
 * Executes pre-built SQL statements from schema initialization
 */

export class DatabaseMigrator {
  constructor(mainDb, backupDb) {
    this.mainDb = mainDb;
    this.backupDb = backupDb;
    this.lastMigration = null;
    this.executionLog = [];
  }

  /**
   * Execute migration using pre-built SQL statement pair (synchronous)
   * @param {Database} mainDb - Main database connection
   * @param {Database} backupDb - Backup database connection
   * @param {string} createTableStatement - CREATE TABLE SQL statement
   * @param {string|null} insertDefaultRowStatement - INSERT default row SQL statement
   * @returns {Object} Migration result
   */
  static migrate(mainDb, backupDb, createTableStatement, insertDefaultRowStatement = null) {
    const instance = new DatabaseMigrator(mainDb, backupDb);
    return instance.executeMigration(createTableStatement, insertDefaultRowStatement);
  }

  /**
   * Execute migration for a single table with its default rows
   * @param {string} createTableStatement - CREATE TABLE SQL statement
   * @param {string|null} insertDefaultRowStatement - INSERT default row(s) SQL statement
   * @returns {Object} Migration result
   */
  executeMigration(createTableStatement, insertDefaultRowStatement = null) {
    this.executionLog = [];
    const results = {
      success: true,
      tableCreated: false,
      defaultRowsInserted: false,
      executedStatements: [],
      failedStatements: [],
      timestamp: new Date()
    };

    try {
      // Step 1: Execute CREATE TABLE statement
      try {
        this.mainDb.exec(createTableStatement);
        results.tableCreated = true;
        results.executedStatements.push({
          type: 'CREATE TABLE',
          statement: createTableStatement.substring(0, 100) + '...',
          success: true
        });
        console.log(`✓ CREATE TABLE executed successfully`);
        this.executionLog.push({ 
          statement: createTableStatement, 
          type: 'CREATE TABLE', 
          success: true 
        });
      } catch (error) {
        results.success = false;
        results.failedStatements.push({
          type: 'CREATE TABLE',
          statement: createTableStatement,
          error: error.message
        });
        console.error(`✗ CREATE TABLE failed: ${error.message}`);
        this.executionLog.push({ 
          statement: createTableStatement, 
          type: 'CREATE TABLE', 
          success: false, 
          error: error.message 
        });
        throw error;
      }

      // Step 2: Execute INSERT DEFAULT statement (if provided)
      if (insertDefaultRowStatement) {
        try {
          this.mainDb.exec(insertDefaultRowStatement);
          results.defaultRowsInserted = true;
          results.executedStatements.push({
            type: 'INSERT DEFAULT',
            statement: insertDefaultRowStatement.substring(0, 100) + '...',
            success: true
          });
          console.log(`✓ INSERT DEFAULT executed successfully`);
          this.executionLog.push({ 
            statement: insertDefaultRowStatement, 
            type: 'INSERT DEFAULT', 
            success: true 
          });
        } catch (error) {
          results.success = false;
          results.failedStatements.push({
            type: 'INSERT DEFAULT',
            statement: insertDefaultRowStatement,
            error: error.message
          });
          console.error(`✗ INSERT DEFAULT failed: ${error.message}`);
          this.executionLog.push({ 
            statement: insertDefaultRowStatement, 
            type: 'INSERT DEFAULT', 
            success: false, 
            error: error.message 
          });
          throw error;
        }
      }

      this.lastMigration = results;
      return results;

    } catch (error) {
      console.error(`\n✗ Migration failed: ${error.message}`);
      return {
        success: false,
        tableCreated: results.tableCreated,
        defaultRowsInserted: results.defaultRowsInserted,
        executedStatements: results.executedStatements,
        failedStatements: results.failedStatements,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Get full execution log
   * @returns {Array} Log of all statement executions
   */
  getExecutionLog() {
    return this.executionLog;
  }

  /**
   * Get last migration result
   * @returns {Object|null}
   */
  getLastMigration() {
    return this.lastMigration;
  }

  /**
   * Print formatted migration report
   * @returns {void}
   */
  printMigrationReport() {
    if (!this.lastMigration) {
      console.log('No migration has been executed yet.');
      return;
    }

    const report = this.lastMigration;
    console.log('\n========== MIGRATION REPORT ==========');
    console.log(`Timestamp: ${report.timestamp}`);
    console.log(`Status: ${report.success ? '✓ SUCCESS' : '✗ FAILED'}`);
    console.log(`Table Created: ${report.tableCreated ? '✓' : '✗'}`);
    console.log(`Default Rows Inserted: ${report.defaultRowsInserted ? '✓' : '✗'}`);
    
    if (report.failedStatements.length > 0) {
      console.log('\nFailed Statements:');
      report.failedStatements.forEach(fail => {
        console.log(`  Type: ${fail.type}`);
        console.log(`  Error: ${fail.error}`);
        console.log(`  SQL: ${fail.statement.substring(0, 80)}...`);
      });
    }
    console.log('=====================================\n');
  }
}

export default DatabaseMigrator;
