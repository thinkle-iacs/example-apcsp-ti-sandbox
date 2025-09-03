(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const textInterface = "";
const yesWords = ["yes", "yeah", "yep", "yup", "true", "t", "y", "aye", "yup"];
const noWords = ["no", "n", "false", "f", "nope", "nah"];
class TextInterface {
  constructor(element = document.body, title = "Text Interface") {
    this.outputAnimationLength = 800;
    this.outputDelay = 300;
    this.outputQueue = [];
    this.div = document.createElement("div");
    this.div.classList.add("text-interface");
    element.appendChild(
      this.div
    );
    this.div.innerHTML = `
      <h2 class="ti-title">${title}</h2>
      <div class="output">
      </div>
      <div class="input-wrap">
          <div 
             class="input" 
             contenteditable 
             placeholder="Type here...">
          </div>
          <div class="placeholder">Type and hit return...</div>
      </div>
    `;
    this.inputWrap = this.div.querySelector(".input-wrap");
    this.inputEl = this.div.querySelector(".input");
    this.outputEl = this.div.querySelector(".output");
    this.placeholderEl = this.div.querySelector(".placeholder");
    this.setupInputListener();
  }
  setTitle(text) {
    this.div.querySelector(".ti-title").textContent = text;
  }
  clear() {
    this.outputEl.innerHTML = "";
  }
  async readChoice(choices, prompt = "Choose one of the following:", error = "You must choose one of the options!") {
    this.output(prompt);
    for (let n = 0; n < choices.length; n++) {
      this.output(`${n + 1}. ${choices[n]}`);
    }
    let textInput = await this.readText();
    if (choices.indexOf(textInput) > -1) {
      return textInput;
    }
    textInput = textInput.replace(/\D/g, "");
    if (textInput != "") {
      let number = Number(textInput);
      if (!isNaN(number) && number <= choices.length && number > 0) {
        return choices[Math.floor(number) - 1];
      }
    }
    this.output(error);
    let correction = await this.readChoice(choices, prompt, error);
    return correction;
  }
  async readYesOrNo(errorMessage = "Say yes or no!") {
    let text = await this.readText();
    text = text.toLowerCase();
    text = text.replace(/\s+/, "");
    if (yesWords.indexOf(text) > -1) {
      return true;
    }
    if (noWords.indexOf(text) > -1) {
      return false;
    } else {
      this.output(errorMessage);
      return await this.readYesOrNo(errorMessage);
    }
  }
  async readNumber(errorMessage = "Please type a number") {
    let text = await this.readText();
    let number = Number(text);
    if (isNaN(number)) {
      this.output(errorMessage);
      return this.readNumber(errorMessage);
    } else {
      return number;
    }
  }
  readText() {
    this.inputEl.focus();
    this.inputWrap.classList.add("active");
    this.inputWrap.scrollIntoView();
    return new Promise(
      (resolve, reject) => {
        this.listener = resolve;
      }
    );
  }
  showElement(element) {
    if (this.outputting) {
      this.outputQueue.push(["element", element]);
    } else {
      this.outputting = true;
      this.outputEl.appendChild(element);
      element.scrollIntoView({ behavior: "smooth" });
      setTimeout(
        () => {
          this.outputting = false;
          this.doNextOutput();
        },
        this.outputDelay
      );
    }
  }
  showHTML(arbitraryHTML) {
    let div = document.createElement("div");
    div.innerHTML = arbitraryHTML;
    this.showElement(div);
  }
  showImage(src, alt = "An image") {
    let img = document.createElement("img");
    img.setAttribute("src", src);
    img.setAttribute("alt", alt);
    this.showElement(img);
  }
  output(text, echo = false) {
    text = "" + text;
    if (this.outputting) {
      this.outputQueue.push(["text", text, echo]);
    } else {
      let output = document.createElement("div");
      output.classList.add("output");
      if (echo) {
        output.classList.add("echo");
      }
      if (!this.outputAnimationLength || echo) {
        output.textContent = text;
      } else {
        this.outputting = true;
        let delay = this.outputAnimationLength / text.length;
        const animateOutput = () => {
          output.textContent += text[0] || "";
          text = text.substring(1);
          if (text.length) {
            setTimeout(
              animateOutput,
              delay
            );
          } else {
            this.outputting = false;
            this.doNextOutput();
          }
        };
        setTimeout(animateOutput, this.outputDelay);
      }
      this.outputEl.appendChild(output);
      output.scrollIntoView({ behavior: "smooth" });
    }
  }
  doNextOutput() {
    if (this.outputQueue.length) {
      let next = this.outputQueue[0];
      this.outputQueue = this.outputQueue.slice(1);
      let nextMode = next[0];
      let nextArgs = next.slice(1);
      if (nextMode == "text") {
        this.output(...nextArgs);
      } else {
        this.showElement(...nextArgs);
      }
    }
  }
  setupInputListener() {
    this.inputEl.addEventListener(
      "keypress",
      (event) => {
        let isEnter = event.code == "Enter";
        if (isEnter) {
          let input = this.inputEl.textContent.replace(/\n$/, "");
          this.output(input, true);
          if (this.listener) {
            this.listener(input);
            this.listener = null;
          }
          this.inputWrap.classList.remove("active");
          setTimeout(
            () => {
              this.inputEl.textContent = "";
            },
            1
          );
        }
      }
    );
    this.placeholderEl.addEventListener(
      "click",
      () => this.inputEl.focus()
    );
  }
}
let app = document.querySelector("#app");
const ti = new TextInterface(app);
async function hello() {
  await ti.output("Hello there!");
  await ti.output("What is your name?");
  let name = await ti.readText();
  await ti.output("It is lovely to meet you, " + name);
}
async function showImages() {
  const url = "https://upload.wikimedia.org/wikipedia/commons/c/c1/Asteracea_poster_3.jpg";
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
    choices,
    // list of choices
    "What is your favorite ice cream flavor?",
    // prompt (optional)
    "I only know the four flavors I listed silly!"
    // custom error message (optional)
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
  yesNo
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
