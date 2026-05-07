//DataTables.js
import { Encyclopedia } from "./DataTables/Encyclopedia.js"
import { Universe } from "./DataTables/Domain/Universe.js"
import { World } from "./DataTables/Domain/World.js"
import { Region } from"./DataTables/Domain/Region.js"

import { Schematic } from"./DataTables/Blueprints/Schematic.js"

import { Character } from"./DataTables/Objects/Character.js"
import { Crop } from"./DataTables/Objects/Crop.js"
import { Item } from"./DataTables/Objects/Item.js"
import { Object } from"./DataTables/Objects/Object.js"
import { Shrub } from"./DataTables/Objects/Shrub.js"
import { Tree } from"./DataTables/Objects/Tree.js"

//Maps
import {Biome} from "./DataTables/Map/Biome.js"

//Location
import {City} from "./DataTables/Map/Location/City.js"
import {Town} from "./DataTables/Map/Location/Town.js"
import {Dungeon} from "./DataTables/Map/Location/Dungeon.js"
import {Camp} from "./DataTables/Map/Location/Camp.js"

//Vaults
import {Den} from "./DataTables/Map/Vault/Den.js"
import {Rift} from "./DataTables/Map/Vault/Rift.js"
import {Vault} from "./DataTables/Map/Vault/Vault.js"

//Way
import {Cave} from "./DataTables/Map/Way/Cave.js"
import {Path} from "./DataTables/Map/Way/Path.js"
import {Road} from "./DataTables/Map/Way/Road.js"
import {SkelterWay} from "./DataTables/Map/Way/SkelterWay.js"


export const AllTables = {
    
    encyclopedia:Encyclopedia.encyclopedia,

    universe: Universe.universe,
    world: World.world,
    region: Region.region,
  
    //Blueprints
    schematic: Schematic.schematic,

    //Objects
    character: Character.character,
    item: Item.item,
    object: Object.object,

    crops: Crop.crop,
    shrubs: Shrub.shrub,
    trees: Tree.Tree,
  
    //Map
    biome: Biome.biome,


    //Vaults
    den:Den.den,
    rift:Rift.rift,
    vault:Vault.vault,

    //Way
    cave:Cave.cave,
    path:Path.path,
    road:Road.road,
    skelterWay:SkelterWay.skelterway,

    //Location
    town:Town.town,
    city:City.city,
    dungeon:Dungeon.dungeon,
    camp:Camp.camp,

};


export const MetaDataBase = {
    encyclopedia:Encyclopedia.encyclopedia,
}
export const UniverseDataBase = {
    
    universe: Universe.universe,
    world: World.world,
    region: Region.region,
  
    //Blueprints
    schematic: Schematic.schematic,

    //Objects
    character: Character.character,
    item: Item.item,
    object: Object.object,

    crops: Crop.crop,
    shrubs: Shrub.shrub,
    trees: Tree.Tree,
  
    //Map
    biome: Biome.biome,


    //Vaults
    den:Den.den,
    rift:Rift.rift,
    vault:Vault.vault,

    //Way
    cave:Cave.cave,
    path:Path.path,
    road:Road.road,
    skelterWay:SkelterWay.skelterway,

    //Location
    town:Town.town,
    city:City.city,
    dungeon:Dungeon.dungeon,
    camp:Camp.camp,

};