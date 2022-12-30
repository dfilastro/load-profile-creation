export function avg(x: number[]) {
  const sum = x.reduce((partialSum, i) => partialSum + i, 0);
  const avg = sum / x.length;

  return avg;
}
