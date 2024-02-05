function negation(place, str, operators) {
  let string = str.split(''); // Convert string to an array for easier manipulation
  console.log(str[place-1]);
  
  switch (string[place-1]) {
    case "+":
      string[place-1] = "-";
      break;
    case "-":
      if (string[place-2] !== "(") { 
        string[place-1] = "+";
      } else {
        string = string.slice(0, place-2).concat(string.slice(place)); // Remove the last two characters
      }
      break;
    case ")":
      let leftParenthesisPlace;
      for (let i = place-1; i > 0; i--) {
        if (string[i] === "(") {
          leftParenthesisPlace = i+1;
          break;
        }
      }
      negation(leftParenthesisPlace, string.join(''), operators); // Pass the array 'string' to the recursive call
      break;
    default:
      if (!operators.includes(string[place-1])) {
        let numbersStart;
        for (let i = place-1; i > 0; i--) {
          if (operators.includes(string[i])) {
            numbersStart = i+1;
            break;
          }
        }
        console.log('Number start: ' + numbersStart);
        negation(numbersStart, string.join(''), operators); // Pass the array 'string' to the recursive call
      } else {
        string = string.slice(0, place).concat("(-", string.slice(place)); // Insert "(-" at the specified position
      }
  }
  return string.join(''); // Convert the array back to a string
}