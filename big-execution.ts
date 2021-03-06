import {
  getAllPossibleArrangements,
  getSpotCountOfListing,
} from "./src/better-house-algorithm";
import { Listing, PeopleGroup } from "./src/types";
import { writeFile } from "fs";
import { homechurch } from "./src/homechurch";

const run = () => {
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
  const generator = getAllPossibleArrangements({
    listings,
    peopleGroup: homechurch,
  });
  writeFile(
    "./output.json",
    JSON.stringify(generator.next().value, null, 2),
    () => {
      console.log("Done!");
    }
  );
};

run();
