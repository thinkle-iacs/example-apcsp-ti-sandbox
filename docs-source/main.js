import { TextInterface } from "text-interface";
let app = document.querySelector("#app");
const ti = new TextInterface(app);

async function hello() {
  await ti.output("Hello there!");
  await ti.output("What is your name?");
  let name = await ti.readText();
  await ti.output("It is lovely to meet you, " + name);
}

async function showImages() {
  const url =
    "https://upload.wikimedia.org/wikipedia/commons/c/c1/Asteracea_poster_3.jpg";
  await ti.output("Here is an image:");
  await ti.showImage(url, "Daisy Picture");
  ti.output("Image courtesy of Wikipedia, uploaded by Tony Wills Alvesgaspar");
  ti.showHTML(
    `<a href="https://creativecommons.org/licenses/by-sa/3.0">CC BY-SA 3.0</a>
    by <a href="https://commons.wikimedia.org/wiki/User:Alvesgaspar">Alvesgaspar</a>
    and <a href="https://commons.wikimedia.org/wiki/User:Tony_Wills">Tony Wills</a>`
  );
}

async function showHTML() {
  await ti.output("What is your name?");
  const name = await ti.readText();
  await ti.output("How old are you?");
  const age = await ti.readNumber();
  await ti.showHTML(
    ` <style> table td, table th {border: 1px solid green; } </style>
      <table>
        <tr>
          <th>Name</th>
          <td>${name}</td>
        </tr>
        <tr>
          <th>Age</th>
          <td>${age}</td>
        </tr>
      </table>
    `
  );
}

async function showElement() {
  let c = document.createElement("canvas");
  let ctx = c.getContext("2d");
  ctx.fillStyle = "pink";
  ctx.arc(50, 50, 50, 0, Math.PI * 2);
  ctx.fill();
  await ti.output("I am going to add a canvas with a drawing!");
  await ti.showElement(c);
}

async function multipleChoice() {
  const choices = ["Vanilla", "Chocolate", "Strawberry", "Rocky Road"];
  let selection = await ti.readChoice(
    choices, // list of choices
    "What is your favorite ice cream flavor?", // prompt (optional)
    "I only know the four flavors I listed silly!" // custom error message (optional)
  );
  if (selection == "Chocolate") {
    ti.output("Chocolate is my favorite too!");
  } else {
    ti.output(`Ok, I guess. Chocolate is better, but I like ${selection} too.`);
  }
}

async function yesNo() {
  await ti.output("Do you want to continue?");
  let keepGoing = await ti.readYesOrNo();
  while (keepGoing) {
    await ti.output("Ok then, let us continue...");
    await ti.output("Shall we keep going?");
    keepGoing = await ti.readYesOrNo();
  }
  await ti.output("Ok, we are done for today then!");
}

const functions = {
  hello,
  showImages,
  showHTML,
  showElement,
  multipleChoice,
  yesNo,
};

let sourceDiv = document.querySelector("#source");
for (let a of document.querySelectorAll("aside a")) {
  a.addEventListener("click", () => {
    let name = a.getAttribute("href").replace("#", "");
    let func = functions[name];
    let menuName = a.textContent;
    showAndRun(func, menuName);
  });
}

function showAndRun(func, name) {
  let fullFunctionString = func.toString();
  const functionBody = fullFunctionString.slice(
    fullFunctionString.indexOf("{") + 1,
    fullFunctionString.lastIndexOf("}")
  );
  sourceDiv.textContent = functionBody;
  document.querySelector("#example-title").textContent = `${name} Example`;
  ti.clear();
  func();
}

showAndRun(hello, "Hello World");
