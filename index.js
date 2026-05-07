// Commander/index.js

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { validateCommand } from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const registry = new Map();

export async function loadCommands() {
  const base = path.join(__dirname);

  for (const folder of fs.readdirSync(base)) {
    const folderPath = path.join(base, folder);

    // Skip root files (types.js, index.js)
    if (!fs.statSync(folderPath).isDirectory()) continue;

    for (const file of fs.readdirSync(folderPath)) {
      if (!file.endsWith(".js")) continue;

      const modPath = path.join(folderPath, file);
      const mod = await import(modPath);

      if (!mod.command) {
        console.warn(`Skipping ${file}: no exported 'command'`);
        continue;
      }

      console.log(`Building Command list from ${file}`);

      const cmd = mod.command;
      validateCommand(cmd);

      // Register ONLY the main command
      registerCommand(cmd.name, cmd);

      // Register main aliases
      if (cmd.aliases) {
        for (const alias of cmd.aliases) {
          registerCommand(alias, cmd);
        }
      }

      console.log(`Loaded command: ${cmd.name}`);
    }
  }
}

function registerCommand(name, cmd) {
  if (registry.has(name)) {
    console.warn(`Duplicate command name/alias detected: '${name}'`);
  }
  registry.set(name, cmd);
}
