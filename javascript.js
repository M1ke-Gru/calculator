class Calculator {
  constructor() {
    this.buttons = document.querySelector("#buttons");
    this.currentInput = document.querySelector("#currentInput");
    this.currentString = "0";
    this.lastInputed = document.querySelector("#lastInputed");
    this.keys = [...["(", ")", "DEL"], ..."C!^√/123*456+789-±0.=".split('')];
    this.createKeyboard();
  }

  createKeyboard() {
    for (let i = 0; i < 24; ++i) {
      const buttonElement = new Button(this.keys[i], this, i % 4, i / 6);
    }
  }

  clicked(value) {
    if (this.currentString === "0") {
      this.currentString = "";
    }
    switch (value) {
      case "=":
        this.currentString = this.currentString.concat(value);
        this.correctInputMistakes(this.currentString);
        this.lastInputed.innerHTML = this.currentString;
        this.currentString = "";
        this.calculate(this.lastInputed.innerHTML);
        break;
      case "C":
        this.lastInputed.innerHTML = "";
        this.currentString = "0";
        break;
      case "DEL":
        this.currentString = this.currentString.slice(0, this.currentString.length - 1);
        break;
      default:
        this.currentString = this.currentString.concat(value);
        break;
    }
    this.currentInput.innerHTML = this.currentString;
  }

  correctInputMistakes(input) {
    const operators = ["(", ")", "!", "√", "^", "*", "/", "+", "-"];
    let inputArray = input.split('');
    function inOperators(currentChar) {
      for (let o of operators) {
        if (inputArray[currentChar] === o) {
          return true;
        }
      }
      return false;
    }
    let openParenthesisQuantity = 0;
    let closedParenthesisQuantity = 0;
    function checkViableFirstValue(inputArray) {
      if ((inOperators(inputArray[0]) && inputArray[0] !== "(")  || inputArray[0] === ".") {
        inputArray.shift();
        console.log(inputArray);
        inputArray = checkViableFirstValue(inputArray);
      }
      return inputArray;
    }
    inputArray = checkViableFirstValue(inputArray);
    for (let i = 0; i < inputArray.length; i++) {
      if (!(inOperators(i)) && (inputArray[i+1] === "(" || inputArray[i+1] === "!")) {
        inputArray.splice(i+1, 0, "*");
      }
      
      if (inputArray[i] === ")" && inputArray[i+1] !== ")" && inputArray[i+1] !== "*" && inputArray[i+1] !== "=") {        
        inputArray.splice(i+1, 0, "*");
      } 
      
      if (inputArray[i] === "." && inOperators(i+1)) {
        inputArray.splice(i, 1);
      }

      if (inputArray[i] === "(") {
        ++openParenthesisQuantity;
      }

      if (inputArray[i] === ")") {
        ++closedParenthesisQuantity;
      }
    }
    if (openParenthesisQuantity > closedParenthesisQuantity) {
      for (let i = 0; i < (openParenthesisQuantity - closedParenthesisQuantity); i++) {
        inputArray.splice(inputArray.length - 1, 0, ")");
      }
    } else if (openParenthesisQuantity < closedParenthesisQuantity) {
      for (let i = 0; i < (closedParenthesisQuantity - openParenthesisQuantity); i++) {
        inputArray.unshift("(");
      }
    }     
    this.currentString = inputArray.join('');

  }

  calculate(expression) {
    const priority = [["("], [")"], ["!", "√"], ["^"], ["*", "/"], ["+", "-"]];
    const operationExecutionOrder = this.createOperationExecutionOrder(expression, priority);

  }

  createOperationExecutionOrder(expression, priority) {
    const operationExecutionOrder = [[], [], [], [], [], []];

    for (let charPos = 0; charPos < expression.length; charPos++) {
      for (let i = 0; i < priority.length; i++) {
        for (let j = 0; j < priority[i].length; j++) {
          if (expression[charPos] === priority[i][j]) {
            operationExecutionOrder[i].push(charPos);
            break; // Break out of the inner loop once a match is found
          }
        }
      }
    }

    return operationExecutionOrder;
  }

  calculateOperation(operation) {

  }
}

class Button {
  constructor(value, calculator, pos_x, pos_y, height = 1, width = 1) {
    const button = document.createElement("button");
    this.value = value;
    button.type = "button";
    button.innerHTML = value;
    this.addCSS(button, height, width, pos_x, pos_y);
    calculator.buttons.appendChild(button);
    button.addEventListener('click', () => calculator.clicked(this.value))
  }

  addCSS(button, height, width, pos_x, pos_y) {
    button.style.width = "100%";
    button.style.height = "100%";
    button.style.fontSize = "20px";
    button.style.borderRadius = "10px";
    button.style.backgroundColor = "aliceblue";
    const rightBorder = pos_x + height;
    const bottomBorder = pos_y + width;
    button.style.gridArea = "${pos_x} / ${pos_y} / ${rightBorder} / ${bottomBorder}";
  }
}

const calculator = new Calculator();