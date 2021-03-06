import uniqueWith from "lodash.uniqwith";
import partition from "lodash.partition";
import uniqueIdGenerator from "./unique-id-generator";
import { Decision } from "./common-decision-tree";

export const breadthFirstSearchDecisionTree = <
  PermutableMember extends unknown,
  CommonEnvironment extends unknown
>({
  areBranchesEquivalent,
  permutable,
  shouldKeepBranch,
  getCommonEnvironment,
  branchingLimit = Number.MAX_SAFE_INTEGER,
  scoreBranch,
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
  scoreBranch?: (
    branchContents: PermutableMember[],
    commonEnvironment: CommonEnvironment
  ) => number;
  branchingLimit?: number;
}): PermutableMember[][] => {
  if (permutable.length === 0) return [];
  let decisions: Decision[] = [];
  permutable.forEach((member, index) => {
    decisions.push({
      id: uniqueIdGenerator(),
      oi: index,
      p: "root",
      gp: true,
    });
  });
  const maximum = permutable.length;
  const isTip = (decision: Decision): boolean =>
    !decisions.some((subjectDecision) => subjectDecision.p === decision.id);
  const getTips = (): Decision[] => decisions.filter(isTip);
  const getBranch = (tip: Decision): Decision[] => {
    const branch: Decision[] = [tip];
    while (!branch.some((decision) => decision.p === "root")) {
      const currentDecision = branch[branch.length - 1];
      const parentOfCurrentDecision = decisions.find(
        (decision) => currentDecision.p === decision.id
      );
      if (!parentOfCurrentDecision) {
        break;
      }
      branch.push(parentOfCurrentDecision);
    }
    return branch.reverse();
  };
  const getBranchDecisionContents = (branch: Decision[]): PermutableMember[] =>
    branch.map((decision) => permutable[decision.oi]);
  const pruneBranchByTip = (tip: Decision): void => {
    decisions = decisions.filter((decision) => decision.id !== tip.id);
    if (tip.p !== "root") {
      const parentDecision = decisions.find(
        (decision) => decision.id === tip.p
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
      console.debug(branchObjects.length, "branches to dedupe");
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
      console.debug(uniqueBranchObjects.length, "unique branches");
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
      console.debug(branchObjects.length, "branches to test for validity");
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
      console.debug(validBranchObjects.length, "branches found to be valid");
      return validBranchObjects;
    }
    return branchObjects;
  };
  const growTip = (tip: Decision): void => {
    const branch = getBranch(tip);
    const usedIndexes = branch.map((branch) => branch.oi);
    const unusedIndexes = permutable
      .map((member, index) => index)
      .filter((index) => !usedIndexes.includes(index));
    unusedIndexes.forEach((unusedIndex) => {
      decisions.push({
        id: uniqueIdGenerator(),
        oi: unusedIndex,
        p: tip.id,
        gp: true,
      });
    });
    tip.gp = false;
  };
  const limitBranches = (
    branchObjects: {
      tip: Decision;
      branch: Decision[];
      branchContents: PermutableMember[];
      commonEnvironment: CommonEnvironment;
    }[]
  ): {
    tip: Decision;
    branch: Decision[];
    branchContents: PermutableMember[];
    commonEnvironment: CommonEnvironment;
  }[] => {
    console.debug(branchObjects.length, "branches to check against limit");
    if (branchObjects.length > branchingLimit) {
      console.debug("Branch count beyond branch limit of", branchingLimit);
      if (scoreBranch) {
      } else {
        const limitedBranchObjects = branchObjects.slice(0, branchingLimit);
        const excessBranchObjects = branchObjects.slice(branchingLimit);
        excessBranchObjects.forEach((excessBranchObject) =>
          pruneBranchByTip(excessBranchObject.tip)
        );
        console.debug(
          limitedBranchObjects.length,
          " branches left after limiting branches"
        );
        return limitedBranchObjects;
      }
    }
    return branchObjects;
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
      if (tip.gp) {
        growTip(tip);
      }
    });
    return branchObjects;
  };
  for (let iteration = 0; iteration <= maximum; iteration++) {
    console.time(`iteration ${iteration}`);
    const branchObjects = getTips().map((tip) => {
      const branch = getBranch(tip);
      const branchContents = getBranchDecisionContents(branch);
      const commonEnvironment = getCommonEnvironment(branchContents);
      return {
        tip,
        branch,
        commonEnvironment,
        branchContents,
      };
    });
    const validBranchObjects = findAndDestroyInvalidBranches(branchObjects);
    const uniqueBranchObjects = findAndDestroyDuplicateBranches(
      validBranchObjects
    );
    if (uniqueBranchObjects.every(({ tip }) => !tip.gp)) {
      break;
    }
    const limitedBranchObjects = limitBranches(uniqueBranchObjects);
    growTips(limitedBranchObjects);
    console.timeEnd(`iteration ${iteration}`);
    console.debug((iteration / maximum) * 100, "%");
  }
  const tips = getTips();
  const branches = tips.map(getBranch);
  return branches.map(getBranchDecisionContents);
};
