import { getAllPossibleArrangements } from "./house-algorithm";
import { Listing, PeopleGroup } from "./types";

test("short build", () => {
  const peopleGroup: PeopleGroup = {
    families: [],
    people: [
      {
        name: "Noodle",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Larry",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Hanaan",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Serena",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Kaila",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
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
                // {
                //   beds: [{ name: "king" }, { name: "twin" }],
                // },
                // {},
                // {},
              ],
            },
          ],
        },
      ],
    },
  ];
  const results = getAllPossibleArrangements({ listings, peopleGroup });
  console.log(results.length);
});

test("long build", () => {
  const peopleGroup: PeopleGroup = {
    families: [],
    people: [
      {
        name: "Noodle",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Larry",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Deon",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Hanaan",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Isaac",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Kwinton",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Mackenzie",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Sam DeVine",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Sicquan",
        gender: "male",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Bethany",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Caroline",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Mara",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Molly",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Pearl",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Sam Donermeyer",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Sam Knight",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Serena",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
      },
      {
        name: "Kaila",
        gender: "female",
        howManyOthersCanShareBed: { twin: 0, queen: 1, king: 1 },
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
  const results = getAllPossibleArrangements({ listings, peopleGroup });
  console.log(results.length);
});
