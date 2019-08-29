// Given a 2D array (matrix) inputMatrix of integers, create a function spiralCopy that copies inputMatrix’s values into a 1D array in a clockwise spiral order. Your function then should return that array.

// Examples:

// input:  inputMatrix  = [   col
//                     row  [1, 2, 3, 4, 5],
//                         [6, 7, 8, 9, 10],
//                         [11, 12, 13, 14, 15],
//                         [16, 17, 18, 19, 20]
//                        ]

// output: [1, 2, 3, 4, 5, 10, 15, 20, 19, 18, 17, 16, 11, 6, 7, 8, 9, 14, 13, 12]
// Analyze the time and space complexities of your solution.
// create new []
function spiralCopy(input) {
  const arr = [];
  const firstRow = input.shift();
  for (let number of firstRow) {
    arr.push(number);
  }
  for (let innerArr of input) {
    const lastNumber = innerArr.pop();
    arr.push(lastNumber);
  }
  const lastRow = input[input.length - 1].reverse();
  input.pop();
  for (let number of lastRow) {
    arr.push(number);
  }
  for (let i = input.length - 1; i >= 0; i--) {
    const firstNumber = input[i].shift();
    arr.push(firstNumber);
  }
  for (let number of input.shift()) {
    arr.push(number);
  }
  for (let number of input[0].reverse()) {
    console.log(number);
    arr.push(number);
  }
  return arr;
}
