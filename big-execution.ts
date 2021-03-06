import {
  getAllPossibleArrangements,
  getSpotCountOfListing,
} from "./src/house-algorithm";
import { Listing, PeopleGroup } from "./src/types";
import { writeFile } from "fs";

const run = () => {
  const peopleGroup: PeopleGroup = {
    families: [
      {
        couple: {
          husband: {
            name: "Travis Davis",
            gender: "male",
            howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
          },
          wife: {
            name: "Andrea Davis",
            gender: "female",
            howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
          },
        },
        children: [],
      },
      {
        couple: {
          husband: {
            name: "Alec Brickey",
            gender: "male",
            howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
          },
          wife: {
            name: "Christa Brickey",
            gender: "female",
            howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
          },
        },
        children: [],
      },
      {
        couple: {
          husband: {
            name: "Danny Marchese",
            gender: "male",
            howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
          },
          wife: {
            name: "Carrie Marchese",
            gender: "female",
            howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
          },
        },
        children: [
          {
            name: "Hope",
            gender: "female",
            howManyOthersCanShareBed: {
              twin: 1,
              queen: 2,
              king: 2,
            },
          },
        ],
      },
      {
        couple: {
          husband: {
            name: "Daniel Branaghan",
            gender: "male",
            howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
          },
          wife: {
            name: "Sarah Branaghan",
            gender: "female",
            howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
          },
        },
        children: [],
      },
      {
        couple: {
          husband: {
            name: "Eric Taylor",
            gender: "male",
            howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
          },
          wife: {
            name: "Jessica Taylor",
            gender: "female",
            howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
          },
        },
        children: [],
      },
    ],
    people: [
      {
        name: "Noodle",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
      },
      {
        name: "Larry",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
      },
      {
        name: "Deon",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
      },
      {
        name: "Hanaan",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
      },
      {
        name: "Isaac",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
      },
      {
        name: "Kwinton",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
      },
      {
        name: "Mackenzie",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
      },
      {
        name: "Sam DeVine",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
      },
      {
        name: "Sicquan",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
      },
      {
        name: "Bethany",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
      },
      {
        name: "Caroline",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
      },
      {
        name: "Mara",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
      },
      {
        name: "Molly",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
      },
      {
        name: "Pearl",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
      },
      {
        name: "Sam Donermeyer",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
      },
      {
        name: "Sam Knight",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
      },
      {
        name: "Serena",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
      },
      {
        name: "Kaila",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
      },
    ],
  };
  const listings: Listing[] = [
    {
      price: 0,
      buildings: [
        {
          floors: [
            {
              rooms: [
                {
                  beds: [{ name: "king" }, { name: "twin" }, { name: "twin" }],
                },
                { beds: [{ name: "queen" }, { name: "queen" }] },
              ],
            },
            {
              rooms: [
                {
                  beds: [{ name: "king" }, { name: "twin" }, { name: "twin" }],
                },
              ],
            },
            {
              rooms: [
                {
                  beds: [{ name: "king" }, { name: "twin" }],
                },
                {
                  beds: [{ name: "king" }, { name: "twin" }],
                },
                {
                  beds: [{ name: "king" }],
                },
                {
                  beds: [
                    { name: "twin" },
                    { name: "twin" },
                    { name: "twin" },
                    { name: "twin" },
                    { name: "twin" },
                    { name: "twin" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  console.log("Starting");
  const results = getAllPossibleArrangements({ listings, peopleGroup });
  writeFile("./output.json", JSON.stringify(results, null, 2), () => {
    console.log("Done!");
  });
};

run();
