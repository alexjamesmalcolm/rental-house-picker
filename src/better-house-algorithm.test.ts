import { fillBeds, getAllPossibleArrangements } from "./better-house-algorithm";
import { Listing } from "./types";
import { homechurch } from "./homechurch";

test("SPECTACULAR NEW BEACH HOUSE WITH 4TH LEVEL SKYDECK & CUSTOM POOL/SPA", () => {
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
  const generator = getAllPossibleArrangements({
    peopleGroup: homechurch,
    listings,
  });
  const people = generator.next().value;
  expect(fillBeds(listings, people)).toMatchSnapshot();
});
