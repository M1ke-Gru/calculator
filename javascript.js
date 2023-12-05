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
  
calculate(expression) {
    const priority = [ ["("], [")"], ["!", "√"], ["^"], ["*", "/"], ["+", "-"]];
    const operationExecutionOrder = this.buildOperationExecutionOrder(expression, priority);
}

buildOperationExecutionOrder(expression, priority) {
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