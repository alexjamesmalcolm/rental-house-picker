import convertNameToBasicIdentity from "./convert-name-to-basic-identity";
import sortArrays from "./sort-arrays";
import { PeopleGroup } from "./types";

export const sortStructure = (
  structure: string[][][][][][],
  peopleGroup: PeopleGroup
): string => {
  return JSON.stringify(
    structure
      .map((a) =>
        a
          .map((a) =>
            a
              .map((a) =>
                a
                  .map((a) =>
                    a
                      .map((a) =>
                        a
                          .map((a) =>
                            convertNameToBasicIdentity(a, peopleGroup)
                          )
                          .sort()
                      )
                      .sort(sortArrays)
                  )
                  .sort(sortArrays)
              )
              .sort(sortArrays)
          )
          .sort(sortArrays)
      )
      .sort(sortArrays)
  );
};

export default sortStructure;
