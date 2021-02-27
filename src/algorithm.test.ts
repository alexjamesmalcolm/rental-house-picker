import { decisionTree } from "./algorithm";

describe("decisionTree", () => {
  it("should sort into an order than when they are subtracted from each other it doesn't equal a negative number", () => {
    const permutable = [1, 2, 3];
    const result = decisionTree({
      permutable,
      scoreDecisions: (decisions) => {
        const result = decisions.map(
          (decision) => permutable[decision.originalIndex]
        );
        return result.reduce(
          (accumulator, currentValue) => accumulator - currentValue
        );
      },
      shouldKeepBranch: (decisions) => {
        const result = decisions.map(
          (decision) => permutable[decision.originalIndex]
        );
        return (
          result.reduce((previousValue, currentValue) => {
            return previousValue - currentValue;
          }) >= 0
        );
      },
      areBranchesEquivalent: () => false,
    });
    expect(result).toStrictEqual([[3, 2, 1]]);
  });
  it.todo("should should produce every permutation which");
});
