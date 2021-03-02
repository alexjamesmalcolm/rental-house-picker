type MultiDimensionalArray = string[][][][][][];

const sortArrays = <Element extends unknown>(
  a: Element[],
  b: Element[]
): number => {
  const aString = JSON.stringify(a);
  const bString = JSON.stringify(b);
  if (aString > bString) {
    return 1;
  } else if (aString === bString) {
    return 0;
  }
  return -1;
};

const convertToStructure = (
  array: MultiDimensionalArray,
  transform: (input: string) => string
): string => {
  return JSON.stringify(
    array
      .map((a) =>
        a
          .map((a) =>
            a
              .map((a) =>
                a
                  .map((a) =>
                    a
                      .map((a) => a.map((a) => transform(a)).sort())
                      .sort(sortArrays)
                  )
                  .sort(sortArrays)
              )
              .sort(sortArrays)
          )
          .sort(sortArrays)
      )
      .sort(sortArrays)
  );
};

export const assertArraySymmetry = (
  a: MultiDimensionalArray,
  b: MultiDimensionalArray,
  transform: (input: string) => string
): boolean =>
  convertToStructure(a, transform) === convertToStructure(b, transform);
