export const assertArraySymmetry = <MultiDimensionalArray extends unknown[]>(
  a: MultiDimensionalArray | string[],
  b: MultiDimensionalArray | string[],
  transform?: (input: string) => string
): boolean => {
  const isStringArray = a.some((aElement) => typeof aElement === "string");
  if (isStringArray) {
    const aTransformed = (a as string[])
      .map(transform || ((input) => input))
      .sort();
    const bTransformed = (b as string[])
      .map(transform || ((input) => input))
      .sort();
    return aTransformed.sort().every((aString, index) => {
      const bString = bTransformed[index];
      return aString === bString;
    });
  }
  return a.every((subA) => {
    return b.some((subB) =>
      assertArraySymmetry(
        (subA as unknown) as MultiDimensionalArray,
        (subB as unknown) as MultiDimensionalArray,
        transform
      )
    );
  });
};
