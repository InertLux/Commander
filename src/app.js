import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { loadCommands } from "../Commander/index.js";
import CommandRouter from "../Commander/Dispatch.js";
import { BuildUniverse } from "./DB/UniverseDB.js";
import {FrameBundler} from "./FrameBundler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();








export async function appStart() {
  console.log("Initializing Database");
  //BuildUniverse();

  console.log("Building Commander");
  loadCommands();

  app.use(express.json());
  console.log("__dirname =", __dirname);

  // Serve cytoscape assets
  app.use("/lib/cytoscape", express.static("node_modules/cytoscape/dist"));

  // Serve EasyMDE assets
  app.use('/easymde', express.static("node_modules/easymde/dist"));

  // Serve the bundled render library
  app.use("/lib", express.static("dist"));

  // Used for world
  app.use('/pixi', express.static("node_modules/pixi.js/dist"));
  app.use('/konva', express.static("node_modules/konva"));

  // Serve xterm.js and xterm.css
  app.use("/xterm", express.static("node_modules/xterm"));

  // Serve AppStyle
  app.use("/AppStyle", express.static("Public/AppStyle"));

  // Serve used GameIcons.net SVGs under /game-icons-net
  app.use("/game-icons-net", express.static(path.join(__dirname, "../Resources/game-icons-net")));

  // Serve static Web components from /HTML
  app.use("/WebComponents", express.static(path.join(__dirname, "/HTML/WebComponents")));

  // Serve static HTML/JS/CSS from /HTML
  app.use(express.static(path.join(__dirname, "Public")));

  // === HARDCODED FRAME LIST ===
  const FRAMES = ['Character', 'CharacterInfo', 'Combat', 'Inventory', 'MapView', 'RegionView', 'UserInfo'];

  // === FRAME BUNDLING ===
  const framesDir = path.join(__dirname, '/HTML/SimulatorFrames');  // ← Create Frames path here
  const frameBundler = new FrameBundler(framesDir);

  app.get('/frame/:sceneName', (req, res) => {
    const { sceneName } = req.params;
    const { path: gamePath } = req.query;

    if (!FRAMES.includes(sceneName)) {
      return res.status(404).send(`Frame "${sceneName}" not found`);
    }

    try {
      const config = {
        frameType: sceneName,
        gamePath: gamePath || '/',
      };

      const html = frameBundler.buildFrame(sceneName, config);
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (err) {
      console.error(`❌ Error building frame ${sceneName}:`, err.message);
      res.status(500).send(`Error building frame: ${err.message}`);
    }
  });


  // Commander terminal router
  app.use("/Commander/terminal.js", CommandRouter);

  console.log("Serving RestAPI");

  //const UserRoutes = await import("../RestAPI/User/user.routes.js");
  //const MetaRoutes = await import("../RestAPI/Meta/meta.routes.js");
  //const UniverseRoutes = await import("../RestAPI/Universe/universe.routes.js");

  //app.use("/user", UserRoutes.default);
  //app.use("/encyclopedia", MetaRoutes.default);
  //app.use("/universe", UniverseRoutes.default);
}

export default {app,appStart};
