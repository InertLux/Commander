import express from "express";
import { registry } from "./index.js";

const CommandRouter = express.Router();

CommandRouter.post("/", async (req, res) => {
  const { name, args = [], me = {} } = req.body;

  // 1. Lookup main command
  const cmd = registry.get(name);
  if (!cmd) {
    return res.json({ text: `Unknown command '${name}'` });
  }

  // 2. Determine method (args[0])
  let method = null;
  let methodName = args[0];

  if (cmd.methods && methodName) {
    // Direct match
    method = cmd.methods[methodName];

    // Alias match
    if (!method) {
      method = Object.values(cmd.methods).find(m =>
        m.aliases?.includes(methodName)
      );
    }
  }

  // 3. Select executor (method or main command)
  const executor = method || cmd;

  // 4. Determine allowed micro-environments
  const allowedME = executor.allowedME || cmd.allowedME;
  const currentME = me?.environment || "universe";

  if (allowedME && !allowedME.includes(currentME)) {
    return res.json({
      text: `Command '${name}' not allowed in '${currentME}' environment.`
    });
  }

  // 5. Build execution context
  const ctx = {
    raw: name,
    args: method ? args.slice(1) : args, // remove method name
    me,
    events: {},   // your event factory
    db: {},       // your db
    world: {}     // your world state
  };

  // 6. Execute
  try {
    const result = await executor.execute(ctx);
    res.json(result);
  } catch (err) {
    console.error("CommandExecutor error:", err);
    res.json({ text: "Error: " + err.message });
  }
});

export default CommandRouter;
