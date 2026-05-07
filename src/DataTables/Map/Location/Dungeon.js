export const Dungeon =
{

  dungeon: 
  {
    tableName: "Dungeon",
    icon: "game-icons-net/acorn.svg",
    viewerPath: "",
    editorPath: "",
    table:{
        id: "INTEGER PRIMARY KEY AUTOINCREMENT",
        name: "TEXT UNIQUE NOT NULL",
        description: "TEXT",
    },
    insertData:{
        id:null,
        name:null,
        description:null,
    },
    defaultValue:{
        id:0,
        name:"Default",
        description:null,
    }
  }
}