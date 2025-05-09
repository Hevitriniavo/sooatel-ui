export const  generateRandomNumbers = (min = 1, max = 10, count = 10) => {
  const numbers = [];
  for (let i = 0; i < count; i++) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.push(randomNum);
  }
  return numbers;
}


export const generateUniqueRandomNumbers = (min = 1, max = 10, count = 10) => {
  const numbers = new Set();
  while (numbers.size < count) {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(randomNum);
  }
  return Array.from(numbers);
};
