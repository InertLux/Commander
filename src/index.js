import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import appModule from "./app.js";
import "dotenv/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pidFile = '/tmp/qute-dev-server.pid';
const port = 5000;

appModule.appStart();

// Start server
const server = appModule.app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);

});

// Keep the process alive
process.stdin.resume();

// Catch any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit, just log it
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit, just log it
});

// ========== SHUTDOWN HOOKS ==========

// Listen for shutdown signals
process.on('SIGINT', shutdown);   // Ctrl+C
process.on('SIGTERM', shutdown);  // Kill signal
process.on('exit', shutdown);     // Any exit

// Handle graceful shutdown
function shutdown() {
  console.log('Shutting down server...');
  
  // Kill qutebrowser
  try {
    if (fs.existsSync(pidFile)) {
      const pid = parseInt(fs.readFileSync(pidFile, 'utf8'));
      process.kill(pid);
      fs.unlinkSync(pidFile);
      console.log('Closed qutebrowser');
    }
  } catch (e) {
    // Process already closed or PID file missing
  }
  
  // Close server
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}
