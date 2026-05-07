// commands/navigation/navigateEditor.js
import "../../src/config.js"
import { AllPages,ClientEnvironments} from "../../src/config.js";






  export const command = 
{
  name: "print",
  aliases: [],
  allowedME:Object.keys(ClientEnvironments),
  category: "print",
  tags: ["print", "string", "dialogue"],
  description:"Print text to terminal",
      args: [
      ],
      async execute(ctx) {
        return await PrintStringExecute(ctx);
      },
  methods:{
    string:{
      aliases: ["str"],
      category: "print",
      tags: ["navigation", "nav"],
      description:"nav edit [location Page], nav edit ? (returns navagatable locations)",
      args: [
      ],
      async execute(ctx) {
        return await PrintStringExecute(ctx);
      }
    }
  }
};


export async function PrintStringExecute(ctx) {
  const { args, me } = ctx;

  // args[0] was the method name ("string" or "str")
  // Dispatcher already removed it, so args = ["hello", "world"]

  if (!args.length) {
    return {
      text: "Nothing to print. Provide text after the method name."
    };
  }

  // Join all args into a single string
  const output = args.join(" ");

  return {
    text: output
  };
}
