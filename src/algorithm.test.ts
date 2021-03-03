import { decisionTree } from "./algorithm";

describe("decisionTree", () => {
  it("should sort into an order than when they are subtracted from each other it doesn't equal a negative number", () => {
    const permutable = [1, 2, 3];
    const result = decisionTree({
      permutable,
      getCommonEnvironment: () => {},
      shouldKeepBranch: (contents) =>
        contents.reduce(
          (previousValue, currentValue) => previousValue - currentValue
        ) >= 0,
    });
    expect(result.length).toEqual(2);
    expect(result).toStrictEqual([
      [3, 1, 2],
      [3, 2, 1],
    ]);
  });
  it("should should produce every unique permutation", () => {
    const permutable = [1, 2, 2, 2, 2];
    const result = decisionTree({
      permutable,
      getCommonEnvironment: () => {},
      areBranchesEquivalent: (
        { branchContents: first },
        { branchContents: second }
      ) =>
        first.length === second.length &&
        first.every((firstElement, index) => second[index] === firstElement),
    });
    expect(result).toStrictEqual([
      [1, 2, 2, 2, 2],
      [2, 1, 2, 2, 2],
      [2, 2, 1, 2, 2],
      [2, 2, 2, 1, 2],
      [2, 2, 2, 2, 1],
    ]);
  });
});
