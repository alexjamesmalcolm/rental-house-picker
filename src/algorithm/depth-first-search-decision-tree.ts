import uniqueIdGenerator from "./unique-id-generator";

interface Decision {
  id: string;
  p?: Decision;
  oi: number;
}

const createDecision = ({
  index: oi,
  parent: p,
}: {
  index: number;
  parent: Decision;
}): Decision => ({
  id: uniqueIdGenerator(),
  oi,
  p,
});

const getBranchIndexes = (decision: Decision): Decision["oi"][] => {
  if (decision.p) {
    return [...getBranchIndexes(decision.p), decision.oi];
  } else {
    return [decision.oi];
  }
};

export function* depthFirstSearchDecisionTree<PermutableMember>({
  permutable,
  shouldKeepBranch,
  areBranchesEquivalent,
}: {
  permutable: PermutableMember[];
  shouldKeepBranch?: (
    branchContents: PermutableMember[]
    // commonEnvironment: CommonEnvironment
  ) => boolean;
  areBranchesEquivalent?: (
    first: {
      branchContents: PermutableMember[];
      // commonEnvironment: CommonEnvironment;
    },
    second: {
      branchContents: PermutableMember[];
      // commonEnvironment: CommonEnvironment;
    }
  ) => boolean;
}) {
  const decisionQueue: Decision[] = [];
  const finishedIndices: number[][] = [];
  const permutableIndexes = permutable.map((member, index) => index);
  // const maximum = factorial(permutable.length);
  // Make all decisions off of root
  permutable.forEach((member, index) => {
    decisionQueue.push({ id: uniqueIdGenerator(), oi: index });
  });
  while (decisionQueue.length > 0) {
    // Grab the latest decision off of the queue
    const latestDecision = decisionQueue.pop();
    if (!latestDecision) return;

    // Get its branch
    const branchIndexes = getBranchIndexes(latestDecision);
    const branchContents: PermutableMember[] = branchIndexes.map(
      (index) => permutable[index]
    );

    const isBranchValid = !shouldKeepBranch || shouldKeepBranch(branchContents);
    const isBranchFinished = () => branchContents.length === permutable.length;
    const isBranchDuplicate = () =>
      !!areBranchesEquivalent &&
      finishedIndices.some((finishedIndex) => {
        const finishedContents = finishedIndex.map(
          (index) => permutable[index]
        );
        return areBranchesEquivalent(
          { branchContents },
          { branchContents: finishedContents }
        );
      });

    if (isBranchValid) {
      if (isBranchFinished() && !isBranchDuplicate()) {
        // Add branch indexes to finishedindices
        finishedIndices.push(branchIndexes);
        yield branchContents;
      } else {
        // GROW branch and add decisions to queue
        const remainingIndexes = permutableIndexes.filter(
          (index) => !branchIndexes.includes(index)
        );
        remainingIndexes.forEach((index) =>
          decisionQueue.push(createDecision({ index, parent: latestDecision }))
        );
      }
    }
  }
}
