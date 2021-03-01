export const sortArrays = <Element extends unknown>(
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

// export const fasterSortArrays = <Element extends unknown>(
//   a: Element[],
//   b: Element[]
// ): number => {
//   if (a.length > b.length) {
//     return 1;
//   } else if (b.length > a.length) {
//     return -1;
//   }
//   const aString = a.join("DELIMITER");
//   const bString = b.join("DELIMITER");
//   if (aString > bString) {
//     return 1;
//   } else if (aString === bString) {
//     return 0;
//   }
//   return -1;
// };

export default sortArrays;
