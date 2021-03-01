import { PeopleGroup } from "./types";

const convertNameToBasicIdentity = (
  name: string,
  peopleGroup: PeopleGroup
): string => {
  if (name === "undefined") return name;
  const person = peopleGroup.people.find((person) => person.name === name);
  if (person) {
    if (person.gender === "male") return "SINGLE MALE";
    return "SINGLE FEMALE";
  }
  return name;
};

export default convertNameToBasicIdentity;
