// Commander/types.js

export const CommandDefinitionShape = {
  name: "string",
  aliases: ["string"],
  category: "string",
  allowedME: ["string"],

  args: [
    {
      name: "string",
      type: "string|number|boolean",
      required: false
    }
  ],

  // async (ctx) => { text, events, meUpdate }
  execute: "function"
};

// Optional: runtime validator
export function validateCommand(cmd) {
  if (!cmd.name) throw new Error("Command missing name");
  if (!cmd.execute) throw new Error(`Command ${cmd.name} missing execute()`);
  if (!cmd.category) throw new Error(`Command ${cmd.name} missing category`);
  if (!Array.isArray(cmd.allowedME))
    throw new Error(`Command ${cmd.name} missing allowedME[]`);
}
