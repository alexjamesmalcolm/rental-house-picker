import { decisionTree } from "./algorithm";
import convertNameToBasicIdentity from "./convert-name-to-basic-identity";
import sortStructure from "./sort-structure";
import {
  BedArrangement,
  Listing,
  ListingArrangement,
  Person,
  BuildingArrangement,
  FloorArrangement,
  RoomArrangement,
  PeopleGroup,
  Family,
} from "./types";

export const getBuildings = (
  listingArrangements: ListingArrangement[]
): BuildingArrangement[] =>
  listingArrangements.flatMap((listing) => listing.buildingArrangements);

export const getFloors = (
  listingArrangements: ListingArrangement[]
): FloorArrangement[] =>
  getBuildings(listingArrangements).flatMap(
    (building) => building.floorArrangements
  );

export const getRooms = (
  listingArrangements: ListingArrangement[]
): RoomArrangement[] => {
  const roomArrangements: RoomArrangement[] = [];
  listingArrangements.forEach((listingArrangement) => {
    listingArrangement.buildingArrangements.forEach((buildingArrangement) => {
      buildingArrangement.floorArrangements.forEach((floorArrangement) => {
        floorArrangement.roomArrangements.forEach((roomArrangement) => {
          roomArrangements.push(roomArrangement);
        });
      });
    });
  });
  return roomArrangements;
};

export const getBeds = (
  listingArrangements: ListingArrangement[]
): BedArrangement[] => {
  const bedArrangements: BedArrangement[] = [];
  listingArrangements.forEach((listingArrangement) => {
    listingArrangement.buildingArrangements.forEach((buildingArrangement) => {
      buildingArrangement.floorArrangements.forEach((floorArrangement) => {
        floorArrangement.roomArrangements.forEach((roomArrangement) => {
          roomArrangement.bedArrangements.forEach((bedArrangement) =>
            bedArrangements.push(bedArrangement)
          );
        });
      });
    });
  });
  return bedArrangements;
};

export const getPeopleStructure = (
  listingArrangements: ListingArrangement[]
): string[][][][][] => {
  return listingArrangements.map((listing) =>
    listing.buildingArrangements.map((building) =>
      building.floorArrangements.map((floor) =>
        floor.roomArrangements.map((room) =>
          room.bedArrangements.map((bed) => {
            const difference = getSpotCountOfBed(bed) - bed.people.length;
            // const people = bed.people.map((person) => person.name);
            // for (let iteration = 0; iteration < difference; iteration++) {
            //   people.push("undefined");
            // }
            // return people;
            return bed.people
              .map((person) => person.name)
              .concat(
                new Array(difference).fill(undefined).map(() => "undefined")
              );
          })
        )
      )
    )
  );
};

export const getSpotCountOfBed = (bedArrangement: BedArrangement): number => {
  if (bedArrangement.bed.name === "twin") return 1;
  if (bedArrangement.bed.name === "queen") return 2;
  return 3;
};

const getBedOfNthSpot = (
  n: number,
  bedArrangements: BedArrangement[]
): BedArrangement | undefined => {
  const foundBed = bedArrangements.find((bedArrangement, index) => {
    const currentSpotCount = bedArrangements.reduce(
      (count, bedArrangement, innerIndex) => {
        if (innerIndex < index) {
          return count + getSpotCountOfBed(bedArrangement);
        } else {
          return count;
        }
      },
      0
    );
    if (currentSpotCount === n) {
      return true;
    }
    const nextSpotCount = currentSpotCount + getSpotCountOfBed(bedArrangement);
    if (n < nextSpotCount) {
      return true;
    }
    return false;
  });
  return foundBed;
};

// const getBedOfNthSpotCache = (bedArrangements: BedArrangement[]) => {
//   const nthSpotToIndexCache: number[] = [];
//   return (
//     n: number,
//     bedArrangements: BedArrangement[]
//   ): BedArrangement | undefined => {};
// };

export const convertListingsToListingArrangements = (
  listings: Listing[]
): ListingArrangement[] =>
  listings.map((listing) => ({
    listing,
    buildingArrangements: listing.buildings.map(
      (building): BuildingArrangement => ({
        floorArrangements: building.floors.map(
          (floor): FloorArrangement => ({
            roomArrangements: floor.rooms.map(
              (room): RoomArrangement => ({
                bedArrangements: room.beds.map(
                  (bed): BedArrangement => ({ bed, people: [] })
                ),
              })
            ),
          })
        ),
      })
    ),
  }));

export const fillBeds = (
  listings: Listing[],
  people: (Person | undefined)[]
): ListingArrangement[] => {
  const listingArrangements = convertListingsToListingArrangements(listings);
  const bedArrangements = getBeds(listingArrangements);
  people.forEach((person, index) => {
    const bedArrangement = getBedOfNthSpot(index, bedArrangements);
    if (bedArrangement && person) {
      bedArrangement.people.push(person);
    }
  });
  return listingArrangements;
};

export const convertPeopleGroupToPeople = (
  peopleGroup: PeopleGroup
): Person[] =>
  peopleGroup.people.concat(
    peopleGroup.families.flatMap((family) =>
      family.children.concat(family.couple.husband, family.couple.wife)
    )
  );

export const getAllPossibleArrangements = ({
  peopleGroup,
  listings,
}: {
  peopleGroup: PeopleGroup;
  listings: Listing[];
}) => {
  const people: (Person | undefined)[] = convertPeopleGroupToPeople(
    peopleGroup
  );
  const listingArrangements = convertListingsToListingArrangements(listings);
  const bedArrangements = getBeds(listingArrangements);
  const spotCount = bedArrangements.reduce(
    (count, bedArrangement) => count + getSpotCountOfBed(bedArrangement),
    0
  );
  const difference = spotCount - people.length;
  if (difference > 0) {
    new Array(difference)
      .fill(undefined)
      .forEach(() => people.unshift(undefined));
  }
  const determineIfPeopleAreSegregatedByGender = (
    peopleInSpace: Person[]
  ): boolean => {
    const men = peopleInSpace.filter((person) => person.gender === "male");
    const women = peopleInSpace.filter((person) => person.gender === "female");
    if (men.length === 0 || women.length === 0) {
      return true;
    }
    return false;
  };
  const getFamilyOfPerson = (person: Person): Family | undefined =>
    peopleGroup.families.find(
      (family) =>
        family.couple.husband.name === person.name ||
        family.couple.wife.name === person.name ||
        family.children.find((child) => child.name === person.name)
    );
  const determineIfEveryPersonInSpaceIsInTheSameFamily = (
    peopleInSpace: Person[]
  ) =>
    peopleInSpace.every((person) => {
      const family = getFamilyOfPerson(person);
      if (!family) return false;
      return peopleInSpace.every((otherPerson) => {
        const otherFamily = getFamilyOfPerson(otherPerson);
        return (
          family.couple.husband.name === otherFamily?.couple.husband.name &&
          family.couple.wife.name === otherFamily?.couple.wife.name
        );
      });
    });
  const results = decisionTree({
    permutable: people,
    shouldKeepBranch: (people) => {
      const listingArrangements = fillBeds(listings, people);
      const bedArrangements = getBeds(listingArrangements);
      const isBedArrangementValid = bedArrangements.every((bedArrangement) => {
        const arePeopleProperlySegregated = determineIfPeopleAreSegregatedByGender(
          bedArrangement.people
        );
        if (arePeopleProperlySegregated) {
          return true;
        }
        const isEveryPersonInSpaceInTheSameFamily = determineIfEveryPersonInSpaceIsInTheSameFamily(
          bedArrangement.people
        );
        if (isEveryPersonInSpaceInTheSameFamily) {
          return true;
        }
        return false;
      });
      if (!isBedArrangementValid) {
        return false;
      }
      const roomArrangements = getRooms(listingArrangements);
      const isRoomArrangementValid = roomArrangements.every(
        (roomArrangement) => {
          const people = roomArrangement.bedArrangements.flatMap(
            (bed) => bed.people
          );
          const arePeopleSegregatedByGender = determineIfPeopleAreSegregatedByGender(
            people
          );
          if (arePeopleSegregatedByGender) return true;
          const isEveryPersonInSpaceInTheSameFamily = determineIfEveryPersonInSpaceIsInTheSameFamily(
            people
          );
          if (isEveryPersonInSpaceInTheSameFamily) return true;
          return false;
        }
      );
      if (!isRoomArrangementValid) {
        return false;
      }
      return true;
    },
    areBranchesEquivalent: (firstPeople, secondPeople) => {
      const convertPersonToBasicIdentity = (person?: Person): string => {
        const name = person ? person.name : "undefined";
        return convertNameToBasicIdentity(name, peopleGroup);
      };

      const firstBasicIdentities = firstPeople.map(
        convertPersonToBasicIdentity
      );
      const secondBasicIdentities = secondPeople.map(
        convertPersonToBasicIdentity
      );

      const isEveryIdentityEquivalent = firstBasicIdentities.every(
        (firstBasicIdentity, index) => {
          const secondBasicIdentity = secondBasicIdentities[index];
          return firstBasicIdentity === secondBasicIdentity;
        }
      );

      if (isEveryIdentityEquivalent) {
        return true;
      }

      const firstListingArrangements = fillBeds(listings, firstPeople);
      const secondListingArrangements = fillBeds(listings, secondPeople);

      const firstBedArrangements = getBeds(firstListingArrangements);
      const secondBedArrangements = getBeds(secondListingArrangements);
      const isEveryBedArrangementEquivalent = firstBedArrangements.every(
        (firstBed, index): boolean => {
          const secondBed = secondBedArrangements[index];
          const firstPeople = firstBed.people;
          const secondPeople = secondBed.people;
          const firstPeopleIdentities = firstPeople.map(
            convertPersonToBasicIdentity
          );
          const secondPeopleIdentities = secondPeople.map(
            convertPersonToBasicIdentity
          );
          return firstPeopleIdentities.every((firstIdentity) =>
            secondPeopleIdentities.find(
              (secondIdentity) => firstIdentity === secondIdentity
            )
          );
        }
      );
      if (isEveryBedArrangementEquivalent) {
        return true;
      }

      const firstRoomArrangements = getRooms(firstListingArrangements);
      const secondRoomArrangements = getRooms(secondListingArrangements);
      const isEveryRoomEquivalent = firstRoomArrangements.every(
        (firstRoomArrangement, index) => {
          const secondRoomArrangement = secondRoomArrangements[index];
          const firstTwinBeds = firstRoomArrangement.bedArrangements.filter(
            (bedArrangement) => bedArrangement.bed.name === "twin"
          );
          const secondTwinBeds = secondRoomArrangement.bedArrangements.filter(
            (bedArrangement) => bedArrangement.bed.name === "twin"
          );
          const firstTwinBedPeople = firstTwinBeds.flatMap((bed) => bed.people);
          const secondTwinBedPeople = secondTwinBeds.flatMap(
            (bed) => bed.people
          );
          const areTwinBedsEquivalent =
            firstTwinBedPeople.length === secondTwinBedPeople.length &&
            firstTwinBedPeople.every((firstPerson) => {
              const secondPerson = secondTwinBedPeople.find(
                (secondPerson) => firstPerson.name === secondPerson.name
              );
              return !!secondPerson;
            });
          if (!areTwinBedsEquivalent) {
            return false;
          }
          const firstQueenBeds = firstRoomArrangement.bedArrangements.filter(
            (bedArrangement) => bedArrangement.bed.name === "queen"
          );
          const secondQueenBeds = secondRoomArrangement.bedArrangements.filter(
            (bedArrangement) => bedArrangement.bed.name === "queen"
          );
          const areQueenBedsEquivalent = firstQueenBeds.every(
            (firstQueenBed) => {
              return secondQueenBeds.some((secondQueenBed) => {
                return firstQueenBed.people.every((firstPerson) => {
                  return secondQueenBed.people.some(
                    (secondPerson) => firstPerson.name === secondPerson.name
                  );
                });
              });
            }
          );
          if (!areQueenBedsEquivalent) {
            return false;
          }
          return true;
        }
      );

      if (!isEveryRoomEquivalent) {
        return false;
      }

      const firstPeopleStructure = getPeopleStructure(firstListingArrangements);
      const secondPeopleStructure = getPeopleStructure(
        secondListingArrangements
      );
      const firstSortedPeopleStructure = sortStructure(
        firstPeopleStructure,
        peopleGroup
      );
      const secondSortedPeopleStructure = sortStructure(
        secondPeopleStructure,
        peopleGroup
      );

      const isSortedEquivalent =
        firstSortedPeopleStructure === secondSortedPeopleStructure;

      if (isSortedEquivalent) {
        return true;
      }
      return false;
    },
  });
  return results;
  // return results.map((people) => fillBeds(listings, people));
};
