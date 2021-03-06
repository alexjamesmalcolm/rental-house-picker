import uniqueWith from "lodash.uniqwith";
import partition from "lodash.partition";
import uniqueIdGenerator from "./unique-id-generator";
import { Decision } from "./common-decision-tree";

export const depthFirstSearchDecisionTree = <
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
  const decisionQueue: Decision[] = [];
};
