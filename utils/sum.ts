export function sum(x: number[]) {
  const sum = x.reduce((partialSum, i) => partialSum + i, 0);

  return sum;
}
