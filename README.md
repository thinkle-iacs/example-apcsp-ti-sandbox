Hello friends. This is a very simple interface, designed to help you practice some basic flow control and make a very simple text game.

## Creating a Text Interface 

To create a text interface, you'll need to import my code
with the line:

```ts
import {TextInterface} from './textInterface'
```

Then you will need to create your interface with a constructor call, which looks like this:

```ts
const ti = new TextInterface();
```

That code is creating a new constant variable, named `ti` which will store your "Text Interface" object created by my library. You don't have to worry about it too much (it's what we call "boilerplate" for now -- some code you'll have to write to get started).

## Using your text interface

### Writing text

Your text interface has some methods which will be handy. To write text onto the screen, you can use the `output` method, which looks like this in practice:

```typescript
ti.output("Hello World!");
```

Some important elements of this to understand are:

1. You are *calling* the method named *output* which is part of the *object* *ti*.
2. You are *passing* an *argument* which tells output *what* to output.
3. The argument you pass to *output* needs to be a string, which is a representation of a word or words. In JavaScript, strings are written between quotes. You can use double or single quotes, or you can use backticks, which have special properties we'll learn about later. So any of the following would work:

```typescript
ti.output('Hello world');
ti.output("Hello world");
ti.output(`Hello world`);
```

If you want to make the text appear slower or faster, you can change the outputAnimationLength property of your Text Interface, which determines how many milliseconds the computer will take to "type" the output. To make it faster, you could do this:

```typescript
ti.outputAnimationLength = 50;
ti.output('Wow now I am typing really fast');
```

### Reading Text

Reading input is a little bit trickier. Typically, you will want to *store* the value the user types in a variable, so you'll need to declare a variable. You can do this with the *let* keyword, which is used for variables that change, or with the *const* keyword, which is used for variables that don't change. The advantage of using *const* is that you will get an error if you accidentally try to change a variable later in your code. 

When we *read* text, we need to wait for the user to respond -- because this takes time, we need to use a special keyword `await` before any `read` calls on our *TextInterface* object. This will make the code wait until the user is done typing before moving to the next line.

```typescript
ti.output('What is your name?');
let name = await ti.readText();
```

#### Reading Other Values

I build TextInterface to have a few other convenient reading methods.

* ti.readNumber() - returns a number
* ti.readYesOrNo() - returns a true or false value
* ti.readChoice(['A','B','C','D']); - takes a list of choices as an argument and returns one of the choices.

Each of these methods also needs to be called with the special *await* keyword to make sure the computer waits for the user to type a result before continuing on with the next line of your code.

## Writing an if statement

You can write an *if* statement in JavaScript like this:

```typescript
if (condition) {
  // statement if condition is truthy
} else {
  // statement if condition is falsy
}
```

Here's what that looks like in practice with our text interface.

```typescript
ti.output('What is 2 + 2');
let answer = await ti.readNumber();
if (answer == 4) {
   ti.output('Correct!');
} else {
   ti.output("I'm afraid that is wrong");
}
```

## Writing Other Output

You can also write some other output using

```typescript
ti.showImage("https://upload.wikimedia.org/wikipedia/commons/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg");
```

Or arbitrary HTML with

```typescript
ti.showHTML(`
<ul>
  <li>Here is a list</li>
  <li>of items</li>
  <li>in html</li>
</ul>`
  );
  ```

## Writing Functions

Most functions written with the text library should be *async* functions so that you can use await. Especially if you
are going to use an infinite while loop, make *sure* to remember **await** or you will crash your browser.

For example:

```
const ti = new TextInterface();
const askQuestion = async (question, answer) => {
  await ti.output(question);
  let userAnswer = await ti.readText();
  if (userAnswer === answer) {
    return true;
  } else {
    return false;
  }
}

let isCorrect = await askQuestion('Who is the best Quarterback in the NFL?', 'Josh Allen');
```