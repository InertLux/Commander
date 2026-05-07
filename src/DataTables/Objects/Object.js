export const Object =
{

  object: 
  {
    tableName: "Object",
    icon: "game-icons-net/acorn.svg",
    viewerPath: "",
    EditorPath: "",
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