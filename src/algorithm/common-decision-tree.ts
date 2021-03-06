export const factorial = (n: number): number => {
  return n !== 1 ? n * factorial(n - 1) : 1;
};

export interface Decision {
  id: string;
  p: string;
  oi: number;
  gp: boolean;
}
