export interface Listing {
  buildings: Building[];
  price: number;
}

export interface ListingArrangement {
  buildingArrangements: BuildingArrangement[];
  listing: Listing;
}

export interface Building {
  floors: Floor[];
}

export interface BuildingArrangement {
  floorArrangements: FloorArrangement[];
}

export interface Floor {
  rooms: Room[];
}

export interface FloorArrangement {
  roomArrangements: RoomArrangement[];
}

export interface Room {
  beds: Bed[];
}

export interface RoomArrangement {
  bedArrangements: BedArrangement[];
}

export interface KingBed {
  name: "king";
}

export interface QueenBed {
  name: "queen";
}

export interface TwinBed {
  name: "twin";
}

export type Bed = KingBed | QueenBed | TwinBed;

export interface BedArrangement {
  bed: Bed;
  people: Person[];
}

export interface Couple {
  husband: Man;
  wife: Woman;
}

export interface Family {
  couple: Couple;
  children: Person[];
}

export type Gender = "male" | "female";

export interface Man extends BasePerson {
  gender: "male";
}
export interface Woman extends BasePerson {
  gender: "female";
}
export type Person = Man | Woman;

interface BasePerson {
  name: string;
  howManyOthersCanShareBed: {
    king: number;
    queen: number;
    twin: number;
  };
}

export interface PeopleGroup {
  families: Family[];
  people: Person[];
}
