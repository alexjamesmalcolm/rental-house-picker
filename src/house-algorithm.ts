import { decisionTree } from "./algorithm";
import { assertArraySymmetry } from "./better-assert-array-symmetry";
import convertNameToBasicIdentity from "./convert-name-to-basic-identity";
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
  Woman,
  Man,
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
            const people = bed.people.map((person) => person.name);
            for (let iteration = 0; iteration < difference; iteration++) {
              people.push("undefined");
            }
            return people;
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

export const getSpotCountOfListing = (listings: Listing[]): number =>
  getBeds(convertListingsToListingArrangements(listings)).reduce(
    (count, bed) => count + getSpotCountOfBed(bed),
    0
  );

const getBedOfNthSpotCache = (bedArrangements: BedArrangement[]) => {
  const nthSpotToIndexCache: number[] = [];
  bedArrangements.forEach((bedArrangement, index) => {
    const spotCount = getSpotCountOfBed(bedArrangement);
    for (let iteration = 0; iteration < spotCount; iteration++) {
      nthSpotToIndexCache.push(index);
    }
  });
  return (
    n: number,
    bedArrangements: BedArrangement[]
  ): BedArrangement | undefined => bedArrangements[nthSpotToIndexCache[n]];
};

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
  const getBedOfNthSpot = getBedOfNthSpotCache(bedArrangements);
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
  const results = decisionTree<
    Man | Woman | undefined,
    { listingArrangements: ListingArrangement[] }
  >({
    permutable: people,
    getCommonEnvironment: (people) => {
      const listingArrangements = fillBeds(listings, people);
      return {
        listingArrangements,
      };
    },
    shouldKeepBranch: (people, { listingArrangements }) => {
      const bedArrangements = getBeds(listingArrangements);
      const isBedArrangementValid = bedArrangements.every((bedArrangement) => {
        const isEveryoneComfortableWithHowManyPeopleAreInTheBed = bedArrangement.people.every(
          (person) => {
            const howManyOthersCanShareBed =
              person.howManyOthersCanShareBed[bedArrangement.bed.name];
            return howManyOthersCanShareBed + 1 >= bedArrangement.people.length;
          }
        );
        if (!isEveryoneComfortableWithHowManyPeopleAreInTheBed) {
          return false;
        }
        const arePeopleProperlySegregated = determineIfPeopleAreSegregatedByGender(
          bedArrangement.people
        );
        if (arePeopleProperlySegregated) {
          const areChildrenOnlySleepingInBedWithOtherFamilyMembers = bedArrangement.people.every(
            (person) => {
              const familyOfChild = peopleGroup.families.find((family) =>
                family.children.some((child) => child.name === person.name)
              );
              return (
                !familyOfChild ||
                bedArrangement.people.every((person) => {
                  return (
                    person.name === familyOfChild.couple.wife.name ||
                    person.name === familyOfChild.couple.husband.name ||
                    familyOfChild.children.some(
                      (child) => child.name === person.name
                    )
                  );
                })
              );
            }
          );
          return areChildrenOnlySleepingInBedWithOtherFamilyMembers;
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
          const isEveryChildWithAParent = people.every((person) => {
            const familyOfChild = peopleGroup.families.find((family) =>
              family.children.some((child) => child.name === person.name)
            );
            return (
              !familyOfChild ||
              people.some(
                (person) =>
                  person.name === familyOfChild.couple.husband.name ||
                  person.name === familyOfChild.couple.wife.name
              )
            );
          });
          if (!isEveryChildWithAParent) {
            return false;
          }
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
    areBranchesEquivalent: (
      {
        branchContents: firstPeople,
        commonEnvironment: { listingArrangements: firstListingArrangements },
      },
      {
        branchContents: secondPeople,
        commonEnvironment: { listingArrangements: secondListingArrangements },
      }
    ) => {
      const convertPersonToBasicIdentity = (person?: Person): string => {
        const name = person ? person.name : "undefined";
        return convertNameToBasicIdentity(name, peopleGroup);
      };

      const isEveryIdentityEquivalent = firstPeople.every(
        (firstPerson, index) => {
          const firstBasicIdentity = convertPersonToBasicIdentity(firstPerson);
          const secondBasicIdentity = convertPersonToBasicIdentity(
            secondPeople[index]
          );
          return firstBasicIdentity === secondBasicIdentity;
        }
      );

      if (isEveryIdentityEquivalent) {
        return true;
      }

      const firstPeopleStructure = getPeopleStructure(firstListingArrangements);
      const secondPeopleStructure = getPeopleStructure(
        secondListingArrangements
      );

      const isSortedEquivalent = assertArraySymmetry(
        firstPeopleStructure,
        secondPeopleStructure,
        (input) => convertNameToBasicIdentity(input, peopleGroup)
      );

      if (isSortedEquivalent) {
        return true;
      }

      const firstBedArrangements = getBeds(firstListingArrangements);
      const secondBedArrangements = getBeds(secondListingArrangements);
      const isEveryBedArrangementEquivalent = firstBedArrangements.every(
        (firstBed, index): boolean => {
          const secondBed = secondBedArrangements[index];
          const firstPeople = firstBed.people;
          const secondPeople = secondBed.people;
          return firstPeople.every((firstPerson) => {
            const firstIdentity = convertPersonToBasicIdentity(firstPerson);
            return secondPeople.find(
              (secondPerson) =>
                firstIdentity === convertPersonToBasicIdentity(secondPerson)
            );
          });
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
          const areTwinBedsEquivalent = firstTwinBeds.every((firstTwinBed) => {
            return secondTwinBeds.some((secondTwinBed) => {
              return firstTwinBed.people.every((firstPerson) => {
                return secondTwinBed.people.some(
                  (secondPerson) => firstPerson.name === secondPerson.name
                );
              });
            });
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
          const areKingBedsEquivalent = firstRoomArrangement.bedArrangements.every(
            (firstBed) => {
              return (
                firstBed.bed.name !== "king" ||
                secondRoomArrangement.bedArrangements.some((secondBed) => {
                  return (
                    secondBed.bed.name === "king" &&
                    firstBed.people.every((firstPerson) => {
                      return secondBed.people.some(
                        (secondPerson) => firstPerson.name === secondPerson.name
                      );
                    })
                  );
                })
              );
            }
          );
          if (!areKingBedsEquivalent) {
            return false;
          }
          return true;
        }
      );

      if (!isEveryRoomEquivalent) {
        return false;
      }

      return false;
    },
  });
  return results;
  // return results.map((people) => fillBeds(listings, people));
};
