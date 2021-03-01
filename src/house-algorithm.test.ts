import { getAllPossibleArrangements } from "./house-algorithm";
import { Listing, PeopleGroup } from "./types";

test("thing", () => {
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
