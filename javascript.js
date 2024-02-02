class Calculator {
  constructor() {
    this.buttons = document.querySelector("#buttons");
    this.currentInput = document.querySelector("#currentInput");
    this.currentString = "0";
    this.lastInputed = document.querySelector("#lastInputed");
    this.keys = [...["(", ")", "DEL"], ..."C!^√/123*456+789-±0.=".split('')];
    this.operators = ["(", ")", "!", "√", "^", "*", "/", "+", "-"];
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
    if (this.currentString === ".") {
      this.currentString = "0."
    }
    const cantBeFirst = [")", "!", " ^", "*", "/", "+"];
    for (let i of cantBeFirst) {
      if (i === this.currentString) {
        this.currentString = "0";
        break;
      }
    }
    
    this.currentInput.innerHTML = this.currentString;
  }

  calculate(expression) {
    let expressionArray = [...expression].slice(0, -1);
    expressionArray = this.identifyNumbers(expressionArray);
    expressionArray = this.correctForCalculation(expressionArray);
    let i = 0;
    while (expressionArray.length > 1) {
      expressionArray = this.calculateOperation(this.findNextOperation(expressionArray), expressionArray);
      console.log(expressionArray);
      i++;
    }
    console.log("End result: " + expressionArray);
    return expressionArray[0];
  }
  
  calculateOperation(operationNumber, expressionArray) {
    let exprArr = expressionArray;
    const numbers = [exprArr[operationNumber - 1], exprArr[operationNumber + 1]];
    let operationResult;
    let eraseNumbersInDirection = [];
    switch(expressionArray[operationNumber]) {
      case "(":
        break;
      case "!":
        operationResult = 1;
        let i = 1;
        while (i < numbers[0] + 1 && i !== 0) {
          operationResult *= i;
          i++;
        }
        eraseNumbersInDirection = [1, 0];
        break;
      case "√":
        operationResult = Math.sqrt(numbers[1]);
        eraseNumbersInDirection = [0, 1];
        break;
      case "^":
        operationResult = numbers[0] ** numbers[1];
        eraseNumbersInDirection = [1, 1];
        break;
      case "*":
        operationResult = numbers[0] * numbers[1];
        eraseNumbersInDirection = [1, 1];
        break;
      case "/":
        operationResult = numbers[0] / numbers[1];
        eraseNumbersInDirection = [1, 1];
        break;
      case "+":
        operationResult = numbers[0] + numbers[1];
        console.log(operationResult);
        eraseNumbersInDirection = [1, 1];
        break;
      case "-":
        if (isNaN(numbers[0])) {
          operationResult = numbers[1] * -1;
          eraseNumbersInDirection = [0, 1];
        } else {
          operationResult = numbers[0] - numbers[1];
          eraseNumbersInDirection = [1, 1];
        }
        break;
    }
    const eraseStart = operationNumber - eraseNumbersInDirection[0];
    const eraseLength = eraseNumbersInDirection[1] + eraseNumbersInDirection[0] + 1;
    exprArr.splice(eraseStart, eraseLength, operationResult);
    console.log("Erase start: " + eraseStart);
    console.log("Calculate operation" + exprArr);
    return exprArr;
  }
  
  findNextOperation(expressionArray) {
    const priority = [["("], ["!", "√"], ["^"], ["*", "/"], ["+", "-"]];
    let nextOperationPosition = -1;
    let currentExprArrPosition = expressionArray.length; // because first the code needs to detect all the parenthese, which you do from the end
    for (currentExprArrPosition; currentExprArrPosition >= 0; currentExprArrPosition--) {
      if (expressionArray[currentExprArrPosition] === "(") {
        nextOperationPosition = currentExprArrPosition;
        break;
      }
    }
    if (nextOperationPosition < 0) {
      for (let currentExprArrPosition = 0; currentExprArrPosition < expressionArray.length; currentExprArrPosition++) {  
        for (let i = 1; i < priority.length; i++) {
          if (priority[i][0] === expressionArray[currentExprArrPosition] || priority[i][1] === expressionArray[currentExprArrPosition]) {
            nextOperationPosition = currentExprArrPosition;
            break;
          }
        }
      }
    }
    console.log("Next operation position: " + nextOperationPosition);
    return nextOperationPosition;
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
    let number = null;
    let numIsFloat = false;
    let afterDot = 0;
    let outputArray = [];
    for (let i = 0; i < expressionArray.length; i++) {
      if (this.operators.includes(expressionArray[i])) {
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
    for (let i = 0; i < expressionArray.length; i++) {
      if (expressionArray[i] === "√" && !this.operators.includes(expressionArray[i-1])) {
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