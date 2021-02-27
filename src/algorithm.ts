import {
  Listing,
  PeopleGroup,
  ListingArrangement,
  Person,
  BedArrangement,
} from "./types";
import { permutator } from "./utils";

const getNumberOfBeds = (listingArrangements: ListingArrangement[]): number =>
  listingArrangements.reduce(
    (count, ListingArrangement) =>
      count +
      ListingArrangement.listing.buildings.reduce(
        (count, building) =>
          count +
          building.floors.reduce(
            (count, floor) =>
              count +
              floor.rooms.reduce((count, room) => count + room.beds.length, 0),
            0
          ),
        0
      ),
    0
  );

const getNthBed = (
  n: number,
  listingArrangements: ListingArrangement[]
): BedArrangement | undefined => {
  let i = 0;
  let result: BedArrangement | undefined = undefined;
  listingArrangements.forEach((listingArrangement) => {
    listingArrangement.buildingArragements.forEach((buildingArrangement) => {
      buildingArrangement.floorArrangements.forEach((floorArrangement) => {
        floorArrangement.roomArrangements.forEach((roomArrangement) => {
          roomArrangement.bedArrangements.forEach((bedArrangement) => {
            if (n === i) {
              result = bedArrangement;
            }
            i++;
          });
        });
      });
    });
  });
  return result;
};

const getAllPossibleListingArrangementGroups = (
  person: Person,
  listings: ListingArrangement[]
): ListingArrangement[][] => {};

export const fillListing = (
  group: PeopleGroup,
  listings: Listing[]
): ListingArrangement[] => {
  const allPeople = group.people.concat(
    group.families.flatMap((family) =>
      [family.couple.husband, family.couple.wife].concat(family.children)
    )
  );
};
