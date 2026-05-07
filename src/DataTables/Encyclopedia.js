

export const Encyclopedia =
{

  encyclopedia: 
  {
    tableName: "Encyclopedia",
    icon: "game-icons-net/bookshelf.svg",
    viewerPath: "",
    editorPath: "",
    table:{
        id: "INTEGER PRIMARY KEY AUTOINCREMENT",
        source: "TEXT UNIQUE NOT NULL",
        name: "TEXT",
        description: "TEXT",
        types: "TEXT",
        tags: "TEXT",
        text: "TEXT"
    },
    typeDef:{
        id:"int",
        source: "string",
        name:"string",
        description:"string",
        types:"[string]",
        tags:"[string]",
        text:"string"
    },
    insertData:{
        id:null,
        source: "TEXT",
        name:null,
        description:null,
        types:null,
        tags:null,
        text:null
    },
    defaultValue:{
        id:0,
        source: "none",
        name:"default",
        description:"",
        types:"",
        tags:"",
        text:""
    }
  }
}