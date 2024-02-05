function negation(place, str, operators) {
  let string = str.split('');
  console.log(str[place-1]);
  
  switch (string[place-1]) {
    case "+":
      string[place-1] = "-";
      break;
    case "-":
      if (string[place-2] !== "(") { 
        string[place-1] = "+";
      } else {
        string = string.slice(0, place-2).concat(string.slice(place));
      }
      break;
    case ")":
      let leftParenthesisPlace;
      for (let i = place-1; i > 0; i--) {
        if (string[i] === "(") {
          leftParenthesisPlace = i;
          break;
        }
      }
      string = string.slice(0, leftParenthesisPlace).concat("(-", string.slice(leftParenthesisPlace));
      break;
    default:
      if (!operators.includes(string[place-1])) {
        let numbersStart = place - 1;
        while (numbersStart > 0 && !operators.includes(string[numbersStart - 1]) && string[numbersStart - 1] !== "(") {
          numbersStart--;
        }
        console.log('Number start: ' + numbersStart);
        string = string.slice(0, numbersStart).concat("(-", string.slice(numbersStart));
      } else {
        string = string.slice(0, place).concat("(-", string.slice(place));
      }
  }
  return string.join('');
}