import "./style.css";
import { TextInterface } from "text-interface";

let app = document.querySelector("#app");
// Create a new "Text Interface"
let ti = new TextInterface(app, "Example Text Interface");
ti.promptNumber("What is your favorite number?");
let favoriteNumber = await ti.readNumber();
ti.output("What is your name?");
let name = await ti.readText();
if (name === "Alice" || name === "Bob") {
  ti.output(`Hello, ${name}!`);
}
else if (name > "M") {
  ti.output("Wow your name is late in the alphabet");
} else {
  ti.output("What a pretty name!");
}
