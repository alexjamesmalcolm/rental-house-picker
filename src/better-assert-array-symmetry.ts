export const assertArraySymmetry = <
  MultiDimensionalArray extends (MultiDimensionalArray | string)[]
>(
  a: MultiDimensionalArray,
  b: MultiDimensionalArray,
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
        subA as MultiDimensionalArray,
        subB as MultiDimensionalArray,
        transform
      )
    );
  });
};
