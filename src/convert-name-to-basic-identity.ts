import { PeopleGroup } from "./types";

const convertNameToBasicIdentity = (
  name: string,
  peopleGroup: PeopleGroup
): string => {
  if (name === "undefined") return name;
  const person = peopleGroup.people.find((person) => person.name === name);
  if (person) {
    return `${person.gender}-${person.howManyOthersCanShareBed.twin}-${person.howManyOthersCanShareBed.queen}-${person.howManyOthersCanShareBed.king}`;
  }
  return name;
};

export default convertNameToBasicIdentity;
