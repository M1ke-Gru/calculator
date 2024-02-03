class Calculate {
  constructor() {
    this.operators = ["(", ")", "!", "√", "^", "*", "/", "+", "-"];
  }

  main(expression) {
    let expressionArray;
    if (Array.isArray(expression)) {
      expressionArray = expression;
    } else {
      expressionArray = [...expression].slice(0, -1);
    }
    expressionArray = this.identifyNumbers(expressionArray);
    expressionArray = this.correctForCalculation(expressionArray);
    let i = 0;
    while (expressionArray.length > 1) {
      expressionArray = this.calculateOperation(this.findNextOperation(expressionArray), expressionArray);
      i++;
    }
    return expressionArray[0];
  }
  
  calculateOperation(operationNumber, expressionArray) {
    let exprArr = expressionArray;
    const numbers = [exprArr[operationNumber - 1], exprArr[operationNumber + 1]];
    console.log(exprArr);
    console.log("Numbers:" + numbers);
    let operationResult;
    let eraseNumbersInDirection = [];
    switch(exprArr[operationNumber]) {
      case "(":
        let closingParenthesisLocation = operationNumber;
        console.log(closingParenthesisLocation);
        while (expressionArray[closingParenthesisLocation] !== ")") {
          closingParenthesisLocation++;
          console.log(exprArr);
          console.log(closingParenthesisLocation);
        }
        let subExpression = exprArr.slice(operationNumber+1, closingParenthesisLocation);
        operationResult = this.main(subExpression);
        eraseNumbersInDirection = [0, closingParenthesisLocation - operationNumber];
        break;
      case "!":
        if (numbers[0] > 0 && Number.isInteger(numbers[0]) && !this.operators.includes(numbers[0])) {
          operationResult = 1;
          let i = 1;
          while (i < numbers[0] + 1 && i !== 0) {
            operationResult *= i;
            i++;
          }
          eraseNumbersInDirection = [1, 0];
        } else {
          operationResult = "Error in factorial";
        }
        break;
      case "√":
        let number = parseFloat(numbers[1]); // Parse as float
        if (number >= 0) {
          if (!isNaN(Math.sqrt(number))) { // Check if number is valid
              operationResult = Math.sqrt(number);
          } else {
              operationResult = number;
          }
          eraseNumbersInDirection = [0, 1];
        } else {
          operationResult = "Error in square root";
        }
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
    if (typeof operationResult !== "string") {
      const eraseStart = operationNumber - eraseNumbersInDirection[0];
      const eraseLength = eraseNumbersInDirection[1] + eraseNumbersInDirection[0] + 1;
      exprArr.splice(eraseStart, eraseLength, operationResult);
    } else {
      exprArr = [operationResult];
    }
    return exprArr;
  }
  
  findNextOperation(expressionArray) {
    const priority = [["("], ["!", "√"], ["^"], ["*", "/"], ["+", "-"]];
    let nextOperationPosition = -1;
    let currentExprArrPosition = expressionArray.length; // because first the code needs to detect all the parenthese, which you do from the end
    for (currentExprArrPosition; currentExprArrPosition >= 0; currentExprArrPosition--) {
      if (expressionArray[currentExprArrPosition] === "(") {
        nextOperationPosition = currentExprArrPosition;
        console.log("Next operation position: " + nextOperationPosition);
        return nextOperationPosition;
      }
    }
    if (nextOperationPosition < 0) {
      for (let i = 1; i < priority.length; i++) {
        for (let currentExprArrPosition = 0; currentExprArrPosition < expressionArray.length; currentExprArrPosition++) {  
          if (priority[i][0] === expressionArray[currentExprArrPosition] || priority[i][1] === expressionArray[currentExprArrPosition]) {
            nextOperationPosition = currentExprArrPosition;
            return nextOperationPosition;
          }
        }
      }
    }
    
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
    for (let i = 1; i < expressionArray.length; i++) {
      if (expressionArray[i] === "√" && !this.operators.includes(expressionArray[i-1])) {
        expressionArray.splice(i, 0, "*");
      }
      const operatorsExcludedForMinus = ["(", ")", "!"];
      if (expressionArray[i] === "-" && this.operators.includes(expressionArray[i-1]) && !operatorsExcludedForMinus.includes(expressionArray[i-1])) {
        expressionArray.splice[i-1, 0, "("];
        expressionArray.splice[i+2, 0, ")"];
      }
    }
    return expressionArray;
  }
}