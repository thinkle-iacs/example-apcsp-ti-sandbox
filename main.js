import "./style.css";
import { TextInterface } from "text-interface";

let app = document.querySelector("#app");
// Create a new "Text Interface"
let ti = new TextInterface(app, "Example Text Interface");

ti.output("What is your name?");
let name = await ti.readText();
await ti.output("Hello, " + name);


