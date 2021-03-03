import { v4 as uuidv4 } from "uuid";
import uniqueWith from "lodash.uniqwith";
import partition from "lodash.partition";

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

export const decisionTree = <
  PermutableMember extends unknown,
  CommonEnvironment extends unknown
>({
  areBranchesEquivalent,
  permutable,
  shouldKeepBranch,
  getCommonEnvironment,
}: {
  permutable: PermutableMember[];
  shouldKeepBranch?: (
    branchContents: PermutableMember[],
    commonEnvironment: CommonEnvironment
  ) => boolean;
  getCommonEnvironment: (
    branchContents: PermutableMember[]
  ) => CommonEnvironment;
  areBranchesEquivalent?: (
    first: {
      branchContents: PermutableMember[];
      commonEnvironment: CommonEnvironment;
    },
    second: {
      branchContents: PermutableMember[];
      commonEnvironment: CommonEnvironment;
    }
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
  const findAndDestroyDuplicateBranches = (
    branchObjects: {
      tip: Decision;
      branch: Decision[];
      branchContents: PermutableMember[];
      commonEnvironment: CommonEnvironment;
    }[]
  ) => {
    if (areBranchesEquivalent) {
      const uniqueBranchObjects = uniqueWith(
        branchObjects,
        (firstBranch, secondBranch) =>
          areBranchesEquivalent(firstBranch, secondBranch)
      );
      branchObjects.forEach((branchObject) => {
        const isUnique = uniqueBranchObjects.some(
          (uniqueBranchObject) =>
            uniqueBranchObject.tip.id === branchObject.tip.id
        );
        if (!isUnique) {
          pruneBranchByTip(branchObject.tip);
        }
      });
      return uniqueBranchObjects;
    }
    return branchObjects;
  };
  const findAndDestroyInvalidBranches = (
    branchObjects: {
      tip: Decision;
      branch: Decision[];
      branchContents: PermutableMember[];
      commonEnvironment: CommonEnvironment;
    }[]
  ) => {
    if (shouldKeepBranch) {
      const [
        validBranchObjects,
        invalidBranchObjects,
      ] = partition(branchObjects, (branchObject) =>
        shouldKeepBranch(
          branchObject.branchContents,
          branchObject.commonEnvironment
        )
      );
      invalidBranchObjects.forEach((invalidBranchObject) => {
        pruneBranchByTip(invalidBranchObject.tip);
      });
      return validBranchObjects;
    }
    return branchObjects;
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
  const growTips = (
    branchObjects: {
      tip: Decision;
      branch: Decision[];
      branchContents: PermutableMember[];
      commonEnvironment: CommonEnvironment;
    }[]
  ) => {
    branchObjects.forEach(({ tip }) => {
      if (tip.isGrowthPoint) {
        growTip(tip);
      }
    });
    // tips.forEach((tip) => {
    //   if (tip.isGrowthPoint) {
    //     growTip(tip);
    //   }
    // });
    return branchObjects;
  };
  for (let iteration = 0; iteration < maximum; iteration++) {
    const branchObjects = findAndDestroyInvalidBranches(
      findAndDestroyDuplicateBranches(
        getTips().map((tip) => {
          const branch = getBranch(tip);
          const branchContents = getBranchDecisionContents(branch);
          const commonEnvironment = getCommonEnvironment(branchContents);
          return {
            tip,
            branch,
            commonEnvironment,
            branchContents,
          };
        })
      )
    );
    if (branchObjects.every(({ tip }) => !tip.isGrowthPoint)) {
      break;
    }
    growTips(branchObjects);
  }
  const tips = getTips();
  const branches = tips.map(getBranch);
  return branches.map(getBranchDecisionContents);
};
