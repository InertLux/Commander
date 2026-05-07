//config.js
import "./DataTables.js"
import { AllTables } from "./DataTables.js";
export const AllPages = {
  encyclopedia: {table: AllTables.encyclopedia, label: "Encyclopedia", icon: "game-icons-net/bookshelf.svg" },
  universe: {table: AllTables.universe, label: "Universe", icon: "game-icons-net/acorn.svg" },
  world: {table: AllTables.world, label: "World", icon: "game-icons-net/acorn.svg" },
  regions: {table: AllTables.region, label: "Regions", icon: "game-icons-net/acorn.svg" },
  schematics: {table: AllTables.schematic, label: "Schematics", icon: "game-icons-net/castle.svg" },
  objects: {table: AllTables.object, label: "Objects", icon: "game-icons-net/acorn.svg" },
  items: {table: AllTables.item, label: "Items", icon: "game-icons-net/acorn.svg" },
  characters: {table: AllTables.character, label: "Characters", icon: "game-icons-net/acorn.svg" },
  biomes: {table: AllTables.biome, label: "Biomes", icon: "game-icons-net/acorn.svg" },

  dens: {table: AllTables.den, label: "Dens", icon: "game-icons-net/goblin-camp.svg" },
  caves: {table: AllTables.cave, label: "Caves", icon: "game-icons-net/cave-entrance.svg" },
  dungeons: {table: AllTables.dungeon, label: "Regions", icon: "game-icons-net/crypt-entrance.svg" },
  vaults: {table: AllTables.vault, label: "Vaults", icon: "game-icons-net/airtight-hatch.svg" },
  skelterWays: {table: AllTables.skelterWay, label: "SkelterWays", icon: "game-icons-net/bleeding-heart.svg" },
  rifts: {table: AllTables.rift, label: "Rifts", icon: "game-icons-net/alien-stare.svg" }
};



export const ClientEnvironments = {
  global:{
    Session:234987609689234,
    User:"default"
  },
  universe:{
    universe:"default",
    galaxy:"none"
  },
  world:{
    world:"default",
    location:[0, 0, 0],

  },
  region:{
    region:"default"

  },
  locality:{
    viewbounds:[50,50,1],
  },
  combat:{
    allies:{
      fred:{
        name:"Fred",
        health:100
      }},
    enemies:{
      goblin:{
        name: "Garg",
        health:100
      }},
  },
  dialouge:{
    script:"test",
    line:0,
    env:{}
  },
}