import {
  getAllPossibleArrangements,
  getSpotCountOfListing,
} from "./better-house-algorithm";
import { Listing, PeopleGroup } from "./types";
import { homechurch } from "./homechurch";

test("Lake Front! Custom Built! Carriage House! Gated Community!", () => {
  const generator = getAllPossibleArrangements({
    peopleGroup: homechurch,
    listings: [
      {
        price: 0,
        buildings: [
          {
            floors: [
              {
                rooms: [
                  {
                    beds: [
                      { name: "king" },
                      { name: "twin" },
                      { name: "twin" },
                    ],
                  },
                  { beds: [{ name: "queen" }, { name: "queen" }] },
                ],
              },
              {
                rooms: [
                  {
                    beds: [
                      { name: "king" },
                      { name: "twin" },
                      { name: "twin" },
                    ],
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
    ],
  });
  expect(generator.next().value).toMatchSnapshot();
});
