import { depthFirstSearchDecisionTree } from "./depth-first-search-decision-tree";

describe("depthFirstSearchDecisionTree", () => {
  it("should sort into an order than when they are subtracted from each other it doesn't equal a negative number", () => {
    const permutable = [1, 2, 3];
    const generator = depthFirstSearchDecisionTree({
      permutable,
      shouldKeepBranch: (contents) => {
        const result =
          contents.reduce(
            (previousValue, currentValue) => previousValue - currentValue
          ) >= 0;
        return result;
      },
    });
    expect(generator.next().value).toStrictEqual([3, 2, 1]);
    expect(generator.next().value).toStrictEqual([3, 1, 2]);
  });
  it("should reverse the order of the array", () => {
    const permutable = [1, 2, 3];
    const generator = depthFirstSearchDecisionTree({
      permutable,
      shouldKeepBranch: (contents) => {
        if (contents.length > 1 && contents[0] !== 3) return false;
        if (contents.length > 2 && contents[1] !== 2) return false;
        if (contents.length > 3 && contents[2] !== 1) return false;
        return true;
      },
    });
    expect(generator.next().value).toStrictEqual([3, 2, 1]);
  });
  it("should should produce every unique permutation", () => {
    const permutable = [1, 2, 2, 2, 2];
    const generator = depthFirstSearchDecisionTree({
      permutable,
      areBranchesEquivalent: (
        { branchContents: first },
        { branchContents: second }
      ) =>
        first.length === second.length &&
        first.every((firstElement, index) => second[index] === firstElement),
    });
    expect(generator.next().value).toStrictEqual([2, 2, 2, 2, 1]);
    expect(generator.next().value).toStrictEqual([2, 2, 2, 1, 2]);
    expect(generator.next().value).toStrictEqual([2, 2, 1, 2, 2]);
    expect(generator.next().value).toStrictEqual([2, 1, 2, 2, 2]);
    expect(generator.next().value).toStrictEqual([1, 2, 2, 2, 2]);
  });
});
