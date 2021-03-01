import { v4 as uuidv4 } from "uuid";
import uniqueWith from "lodash.uniqwith";

const factorial = (n: number): number => {
  return n !== 1 ? n * factorial(n - 1) : 1;
};

/*
Write a function
that given an array
produces an array of arrays
which are filtered
as they are being produced by a decision tree
*/

export interface Decision {
  id: string;
  parent: string;
  originalIndex: number;
  isGrowthPoint: boolean;
}

export const decisionTree = <PermutableMember extends unknown>({
  areBranchesEquivalent,
  permutable,
  shouldKeepBranch,
}: {
  permutable: PermutableMember[];
  shouldKeepBranch?: (branchContents: PermutableMember[]) => boolean;
  areBranchesEquivalent?: (
    firstBranchContents: PermutableMember[],
    secondBranchContents: PermutableMember[]
  ) => boolean;
}): PermutableMember[][] => {
  if (permutable.length === 0) return [];
  let decisions: Decision[] = [];
  permutable.forEach((member, index) => {
    decisions.push({
      id: uuidv4(),
      originalIndex: index,
      parent: "root",
      isGrowthPoint: true,
    });
  });
  const maximum = factorial(permutable.length);
  const isTip = (decision: Decision): boolean =>
    !decisions.some(
      (subjectDecision) => subjectDecision.parent === decision.id
    );
  const getTips = (): Decision[] => decisions.filter(isTip);
  const getBranch = (tip: Decision): Decision[] => {
    const branch: Decision[] = [tip];
    while (!branch.some((decision) => decision.parent === "root")) {
      const currentDecision = branch[branch.length - 1];
      const parentOfCurrentDecision = decisions.find(
        (decision) => currentDecision.parent === decision.id
      );
      if (!parentOfCurrentDecision) {
        break;
      }
      branch.push(parentOfCurrentDecision);
    }
    return branch.reverse();
  };
  const getBranchDecisionContents = (branch: Decision[]): PermutableMember[] =>
    branch.map((decision) => permutable[decision.originalIndex]);
  const pruneBranchByTip = (tip: Decision): void => {
    decisions = decisions.filter((decision) => decision.id !== tip.id);
    if (tip.parent !== "root") {
      const parentDecision = decisions.find(
        (decision) => decision.id === tip.parent
      );
      if (parentDecision && isTip(parentDecision)) {
        pruneBranchByTip(parentDecision);
      }
    }
  };
  const findAndDestroyDuplicateBranches = () => {
    if (areBranchesEquivalent) {
      const tips = getTips();
      const branches = tips.map((tip) => getBranch(tip));
      const uniqueBranches: Decision[][] = uniqueWith(
        branches,
        (firstBranch, secondBranch) =>
          areBranchesEquivalent(
            getBranchDecisionContents(firstBranch),
            getBranchDecisionContents(secondBranch)
          )
      );
      const uniqueTips = uniqueBranches.map(
        (branch) => branch[branch.length - 1]
      );
      const tipsOfDuplicateBranches = tips.filter(
        (tip) => !uniqueTips.some((uniqueTip) => uniqueTip.id === tip.id)
      );
      tipsOfDuplicateBranches.forEach(pruneBranchByTip);
    }
  };
  const findAndDestroyInvalidBranches = () => {
    if (shouldKeepBranch) {
      const tips = getTips();
      const branches = tips.map((tip) => getBranch(tip));
      const invalidBranches: Decision[][] = branches.filter(
        (branch) => !shouldKeepBranch(getBranchDecisionContents(branch))
      );
      const tipsOfInvalidBranches = invalidBranches.map(
        (branch) => branch[branch.length - 1]
      );
      tipsOfInvalidBranches.forEach(pruneBranchByTip);
    }
  };
  const growTip = (tip: Decision): void => {
    const branch = getBranch(tip);
    const usedIndexes = branch.map((branch) => branch.originalIndex);
    const unusedIndexes = permutable
      .map((member, index) => index)
      .filter((index) => !usedIndexes.includes(index));
    unusedIndexes.forEach((unusedIndex) => {
      decisions.push({
        id: uuidv4(),
        originalIndex: unusedIndex,
        parent: tip.id,
        isGrowthPoint: true,
      });
    });
    tip.isGrowthPoint = false;
  };
  const growTips = () => {
    const growthTips = decisions.filter(
      (decision) => decision.isGrowthPoint && isTip(decision)
    );
    growthTips.forEach(growTip);
  };
  for (let iteration = 0; iteration < maximum; iteration++) {
    findAndDestroyDuplicateBranches();
    findAndDestroyInvalidBranches();
    growTips();
    const tips = getTips();
    if (tips.every((tip) => !tip.isGrowthPoint)) {
      break;
    }
  }
  const tips = getTips();
  const branches = tips.map(getBranch);
  return branches.map(getBranchDecisionContents);
};
