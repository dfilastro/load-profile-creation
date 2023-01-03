export function sum(x: number[]) {
  const number = x.map((i) => {
    return Number(i);
  });
  const sum = number.reduce((partialSum, i) => partialSum + i, 0);

  return sum;
}
