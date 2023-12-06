class InputCorrector {
  constructor(input) {
    this.operators = ["(", ")", "!", "√", "^", "*", "/", "+", "-"];
    this.inputArray = input.split('');
    this.openParenthesisQuantity = 0;
    this.closedParenthesisQuantity = 0;
  }

  inOperators(currentChar) {
    for (let o of this.operators) {
      if (this.inputArray[currentChar] === o) {
        return true;
      }
    }
    return false;
  }

  correct() {
    this.inputArray = this.checkViableFirstValue();
    for (let i = 0; i < this.inputArray.length; i++) {
      this.checkThisAndNext(i);
      switch (this.inputArray[i]) {
        case ("("):
          ++this.openParenthesisQuantity;
          break;
        case (")"):
          ++this.closedParenthesisQuantity;
          break;
      }
    }
    this.checkForLeftoverParentheese();
    return this.inputArray.join('');
  }
  
  checkViableFirstValue() {
    if ((this.inOperators(this.inputArray[0]) && this.inputArray[0] !== "(") || this.inputArray[0] === ".") {
      this.inputArray.shift();
      console.log(this.inputArray);
      this.inputArray = this.checkViableFirstValue(); // Fix the method call
    }
    return this.inputArray; // Add the return statement
  }
  
  checkThisAndNext(i) {
      if (!(this.inOperators(i)) && (this.inputArray[i+1] === "(" || this.inputArray[i+1] === "!")) {
        this.inputArray.splice(i+1, 0, "*");
      }
      
      if (this.inputArray[i] === ")" && this.inputArray[i+1] !== ")" && this.inputArray[i+1] !== "*" && this.inputArray[i+1] !== "=") {
        this.inputArray.splice(i+1, 0, "*");
      }
      
      if (this.inputArray[i] === "." && this.inOperators(i+1)) {
        this.inputArray.splice(i, 1);
      }
  }

  checkForLeftoverParentheese() {
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
}