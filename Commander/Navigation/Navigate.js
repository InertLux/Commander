// commands/navigation/navigateEditor.js
import "../../src/config.js"
import { AllPages,ClientEnvironments} from "../../src/config.js";






  export const command = 
{
  name: "navigate",
  aliases: ["nav"],
  allowedME:Object.keys(ClientEnvironments),
  category: "navigation",
  tags: ["navigation", "nav"],
  description:"navigate,nav to different pages accross application. Use: nav [Location Page], nav edit [location Page]",
        args: [
        ],
        async execute(ctx) {
          return await PrintStringExecute(ctx);
        },
  methods:{
    editpage:{
      aliases: ["edit", "editor"],
      category: "navigation",
      tags: ["navigation", "nav"],
      description:"nav edit [location Page], nav edit ? (returns navagatable locations)",
      args: [
        {
          name: "location",
          required: true,
          options: Object.keys(AllPages),
        },
        {
          name:"page",
          required: false
        }
      ],
      async execute(ctx) {
        return await NavigateEditExecute(ctx);
      }
    },
    viewpage:{
      aliases: ["to", "view"],
      category: "navigation",
      tags: ["navigation", "nav", "view"],
      description:"nav view [location Page], nav view ? (returns navagatable locations)",
      args: [
        {
          name: "location",
          required: true,
          options: Object.keys(AllPages),
        },
        {
          name:"page",
          required: false
        }
      ],
      async execute(ctx) {
        return await NavigateViewExecute(ctx);
      }
    },
  }
};


  export async function NavigateViewExecute(ctx) 
  {
    const { args, me, events } = ctx;
    const environment = me?.environment.toLowerCase || "universe";
    if(args.length < 1)
    {
        return {
        text: "Not enough arguments for navigate viewpage"
      };
    }

    //If we have a valid target. 
    const Target = args[0];
    if(!command.methods.viewpage.args[0].options.includes(Target))
    {
      return { 
        text: `Invalid nav target. Valid targets: ${command.methods.viewpage.args[0].options.join(", ")}`
      };
    }

    //If we are allowed to navigate from this environment. (always true).
    if (!command.allowedME.includes(environment)) {
      return {
        text: `Unknown environment '${environment}'. Valid environments: ${command.allowedME.join(", ")}`
      };
    }

    // Update micro‑environment
    me.editor = me.editor || {};
    me.editor.mode = Target;

    return {
      text: `Success. Navigating to '${Target}'.`,
      events: [
        events.editorModeChanged(Target)
      ],
      meUpdate: {
        me: me,
        update:"false"
      }
    };
  };

  export async function NavigateEditExecute(ctx) 
  {
    const { args, me, events } = ctx;
      const environment = me?.environment.toLowerCase || "universe";
    if(args.length < 1)
    {
        return {
        text: "Not enough arguments for navigate editpage"
      };
    }

    //If we have a valid target. 
    const Target = args[0];
    if(!command.methods.editpage.args[0].options.includes(Target))
    {
      return { 
        text: `Invalid nav target. Valid targets: ${command.methods.editpage.args[0].options.join(", ")}`
      };
    }

    //If we are allowed to navigate from this environment. (always true).
    if (!command.allowedME.includes(environment)) {
      return {
        text: `Unknown environment '${environment}'. Valid environments: ${command.allowedME.join(", ")}`
      };
    }

    // Update micro‑environment
    me.editor = me.editor || {};
    me.editor.mode = Target;

    return {
      text: `Editor mode set to '${Target}'.`,
      events: [
        events.editorModeChanged(Target)
      ],
      meUpdate: {
        editor: me.editor
      }
    };
  };