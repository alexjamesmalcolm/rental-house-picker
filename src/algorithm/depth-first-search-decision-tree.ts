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

const getBranchIndexes = (decision: Decision): Decision["oi"][] =>
  decision.p ? [...getBranchIndexes(decision.p), decision.oi] : [decision.oi];

export function* depthFirstSearchDecisionTree<PermutableMember>({
  permutable,
  shouldKeepBranch,
  areBranchesEquivalent,
}: {
  permutable: PermutableMember[];
  shouldKeepBranch?: (branchContents: PermutableMember[]) => boolean;
  areBranchesEquivalent?: (
    first: {
      branchContents: PermutableMember[];
    },
    second: {
      branchContents: PermutableMember[];
    }
  ) => boolean;
}) {
  const decisionQueue: Decision[] = [];
  const finishedIndices: number[][] = [];
  const permutableIndexes = permutable.map((member, index) => index);

  // Make all decisions off of root
  permutable.forEach((member, index) => {
    decisionQueue.push({ id: uniqueIdGenerator(), oi: index });
  });
  while (decisionQueue.length > 0) {
    // Grab the latest decision off of the queue
    const latestDecision = (decisionQueue.pop() as unknown) as Decision;

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
      if (isBranchFinished()) {
        if (!isBranchDuplicate()) {
          // Add branch indexes to finishedindices
          finishedIndices.push(branchIndexes);
          if (decisionQueue.length === 0) return branchContents;
          else yield branchContents;
        }
      } else {
        // GROW branch and add decisions to queue
        permutableIndexes.forEach((index) => {
          if (!branchIndexes.includes(index)) {
            decisionQueue.push(
              createDecision({ index, parent: latestDecision })
            );
          }
        });
      }
    }
  }
}
