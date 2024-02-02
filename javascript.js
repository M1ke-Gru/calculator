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
        //const inputCorrector = new InputCorrector(this.currentString);
        //this.currentString = inputCorrector.correct();
        this.lastInputed.innerHTML = this.currentString;
        this.currentString = "";
        this.currentString = this.calculate(this.lastInputed.innerHTML);
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
    let expressionArray = [...expression].slice(0, -1);
    expressionArray = this.identifyNumbers(expressionArray);
    expressionArray = this.correctForCalculation(expressionArray);
    let operationExecutionOrder = this.createOperationExecutionOrder(expressionArray);
    for (let i = 0; i < operationExecutionOrder.length; i++) {
      if (expressionArray.length === 1) {
        break;
      }
      expressionArray = this.calculateOperation(operationExecutionOrder[i], expressionArray)[0];
      console.log(expressionArray);
      operationExecutionOrder = this.operationMover(operationExecutionOrder, i, this.calculateOperation(operationExecutionOrder[i], expressionArray)[1]);
    }
    console.log(expressionArray[0]);
    return expressionArray[0];
  }
  
  calculateOperation(operationNumber, expressionArray) {
    let result = 0;
    let removedArrayItems = 0;
    switch(expressionArray[operationNumber]) {
      case "(":
        console.log("In braces");
        let i = operationNumber;
        while (expressionArray[i] !== ")") {
          i++;
        }
        let resultInParentheseese = this.calculate(expressionArray.slice(operationNumber + 1, i+1));
        console.log("rip: " + resultInParentheseese);
        removedArrayItems = i+2-operationNumber;
        result = expressionArray.splice(operationNumber, i+1, resultInParentheseese);
        break;
      case "!":
        removedArrayItems = 1;
        let opResult = 1;
        if (expressionArray[operationNumber-1] !== 0) {
          for (let i = 1; i < expressionArray[operationNumber - 1] + 1; i++) {
            opResult *= i;
          }
        }
        result = expressionArray.splice(operationNumber-1, operationNumber + 1, opResult);
        break;
      case "√":
        if (expressionArray(operationNumber+1) < 0) {
          result = "Cannot make the calculation";
        }
        removedArrayItems = 1;
        result = expressionArray.splice(operationNumber, operationNumber + 2, Math.sqrt(expressionArray[operationNumber+1]));
        break;
      case "*":
        removedArrayItems = 2;
        result = expressionArray.splice(operationNumber - 1, operationNumber + 2, expressionArray[operationNumber-1] * expressionArray[operationNumber+1]);
        console.log(expressionArray);
        break;
      case "/":
        removedArrayItems = 2;
        result = expressionArray.splice(operationNumber - 1, operationNumber + 2, expressionArray[operationNumber-1] / expressionArray[operationNumber+1]);
        break;
      case "+":
        removedArrayItems = 2;
        result = expressionArray.splice(operationNumber - 1, operationNumber + 2, expressionArray[operationNumber-1] + expressionArray[operationNumber+1]);
        console.log("addition:" + result);
        break;
      case "-":
        removedArrayItems = 2;
        result = expressionArray.splice(operationNumber - 1, operationNumber + 2, expressionArray[operationNumber-1] - expressionArray[operationNumber+1]);
        break;
      case "^":
        removedArrayItems = 2;
        result = expressionArray.splice(operationNumber - 1, operationNumber + 2, expressionArray[operationNumber-1] ** expressionArray[operationNumber+1]);
        break;
    }
    console.log("result" + result);
    return [result, removedArrayItems];
  }

  operationMover(operationExecutionOrder, operationNumber, numberToTheLeft) {
    console.log("Pre Mover: " + operationExecutionOrder);
    for (let i = operationNumber + 1; i < operationExecutionOrder.length; i++) {
      operationExecutionOrder[i] -= numberToTheLeft;
    }
    console.log("Operation Mover Exec Order: " + operationExecutionOrder + ", " + numberToTheLeft);
    return operationExecutionOrder;
  }
  
  createOperationExecutionOrder(expressionArray) {
    const priority = [["("], ["!", "√"], ["^"], ["*", "/"], ["+", "-"]];
    let operationExecutionOrder = [];

    for (let charPos = 0; charPos < expressionArray.length; charPos++) {
      for (let i = 0; i < priority.length; i++) {
        for (let j = 0; j < priority[i].length; j++) {
          if (expressionArray[charPos] === priority[i][j]) {
            operationExecutionOrder.push(charPos);
            break; // Break out of the inner loop once a match is found
          }
        }
      }
    }

    operationExecutionOrder = this.parenthesisExecutionOrderReverser(expressionArray, operationExecutionOrder);
    console.log(operationExecutionOrder);
    return operationExecutionOrder;
  }

  parenthesisExecutionOrderReverser(expressionArray, operationExecutionOrder) {
    let parenthesisNumber = 0;
    for (let i of expressionArray) {
      if (i === "(") {
        parenthesisNumber++;
      }
    }
    if (parenthesisNumber > 1) {
      let portionToReverse = operationExecutionOrder.slice(0, parenthesisNumber);
      portionToReverse.reverse();
      operationExecutionOrder.splice(0, portionToReverse.length, ...portionToReverse);
    }
    return operationExecutionOrder;
  }

  identifyNumbers(expressionArray) {
    const operators = ["(", ")", "!", "√", "^", "*", "/", "+", "-"];
    let number = null;
    let numIsFloat = false;
    let afterDot = 0;
    let outputArray = [];
    for (let i = 0; i < expressionArray.length; i++) {
      if (operators.includes(expressionArray[i])) {
        if (number !== null) {
          outputArray.push(number);
          numIsFloat = false;
          afterDot = 0;
          number = null;
        }
        outputArray.push(expressionArray[i]);
      } else {
        if (expressionArray[i] === ".") {
          numIsFloat = true;
          number = parseFloat(number);
        } else {
          if (number != null) {
            if (!numIsFloat) {
              number *= 10;
              number += parseInt(expressionArray[i]);
            } else {
              afterDot++;
              number += parseInt(expressionArray[i]) / (10*afterDot);
            }  
          } else {
            number = parseInt(expressionArray[i]);
          }
        }
      }
    }
    if (number !== null) {
      outputArray.push(numIsFloat ? parseFloat(number) : parseInt(number));
    }
    return outputArray;
  }
  
  correctForCalculation(expressionArray) {
    const operators = ["(", ")", "!", "√", "^", "*", "/", "+", "-"];
    for (let i = 0; i < expressionArray.length; i++) {
      if (expressionArray[i] === "√" && !operators.includes(expressionArray[i-1])) {
        expressionArray.splice(i, 0, "*");
      }
    }
    return expressionArray;
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