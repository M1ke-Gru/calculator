class InputCorrector {
  constructor(input) {
    this.operators = ["(", ")", "!", "√", "^", "*", "/", "+", "-"];
    this.inputArray = input.split('');
    this.openParenthesisQuantity = 0;
    this.closedParenthesisQuantity = 0;
  }

  correct() {
    for (let i = 0; i < this.inputArray.length; i++) {
      if (this.inputArray[this.inputArray.length] === NaN) {
        break;
      }
      this.checkThisAndNext(i);
    }
    this.checkForLeftoverParentheese();
    this.checkLastValue();
    return this.inputArray.join('');
  }

  inOperators(currentChar) {
    for (let o of this.operators) {
      if (this.inputArray[currentChar] === o) {
        return true;
      }
    }
    return false;
  }
  
  checkThisAndNext(i) {
      this.writeAdditionalMultiplication(i);
      
      if (this.inputArray[i] === "." && this.inOperators(i+1)) {
        this.inputArray.splice(i, 1);
      }
  }

  writeAdditionalMultiplication(i) {
    if ((!this.operators.includes(this.inputArray[i]) || this.inputArray[i] === "!") && (this.inputArray[i+1] === "(" || this.inputArray[i+1] === "√")) {
      console.log("Conditional");
      this.inputArray.splice(i+1, 0, '*');
      console.log(this.inputArray);
    }

    if (!this.operators.includes(this.inputArray[i+1]) && (this.inputArray[i] === ")" || this.inputArray[i] === "!")) {
      this.inputArray.splice(i+1, 0, '*');
    }
  }

  checkForLeftoverParentheese() {
    for (let i = 0; i < this.inputArray.length; i++) {
      switch (this.inputArray[i]) {
        case ("("):
          ++this.openParenthesisQuantity;
          break;
        case (")"):
          ++this.closedParenthesisQuantity;
          break;
      }      
    }
    if (this.openParenthesisQuantity > this.closedParenthesisQuantity) {
      for (let i = 0; i < (this.openParenthesisQuantity - this.closedParenthesisQuantity); i++) {
        this.inputArray.splice(this.inputArray.length - 1, 0, ")");
      }
    } else if (this.openParenthesisQuantity < this.closedParenthesisQuantity) {
      for (let i = 0; i < (this.closedParenthesisQuantity - this.openParenthesisQuantity); i++) {
        this.inputArray.unshift("(");
      }
    }     
  }

  checkLastValue() {
    const lastValuePosition = this.inputArray.length-2
    const lastValue = this.inputArray[lastValuePosition];
    if (lastValue !== ")" && lastValue !== "!" && this.operators.includes(lastValue)) {
      this.inputArray.splice(lastValuePosition, 1);
    }
  }
}