import {
  getAllPossibleArrangements,
  getSpotCountOfListing,
} from "./better-house-algorithm";
import { Listing, PeopleGroup } from "./types";

const homechurch: PeopleGroup = {
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
    // {
    //   couple: {
    //     husband: {
    //       name: "Eric Taylor",
    //       gender: "male",
    //       howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
    //     },
    //     wife: {
    //       name: "Jessica Taylor",
    //       gender: "female",
    //       howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
    //     },
    //   },
    //   children: [],
    // },
  ],
  people: [
    // BEGINNING OF MARRIED COUPLES AS SINGLES
    // {
    //   name: "Eric Taylor",
    //   gender: "male",
    //   howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
    // },
    // {
    //   name: "Jessica Taylor",
    //   gender: "female",
    //   howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
    // },
    // END OF MARRIED COUPLES AS SINGLES
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
    // {
    //   name: "Hanaan",
    //   gender: "male",
    //   howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
    // },
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
    // {
    //   name: "Mackenzie",
    //   gender: "male",
    //   howManyOthersCanShareBed: { twin: 0, queen: 1, king: 2 },
    // },
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

const details = `
DETAILS: "Let's Rendezvous" is a luxurious vacation home where the name speaks for itself! With lakefront views and a short bike ride to the beach—it offers the best of both worlds. This professionally decorated home comfortably sleeps 20 guests, with 7 bedrooms and 5.5 baths. Some of the most notable features include a 6-seater golf cart, an outdoor shower, a private Carriage House, incredible waterfront views, and an outdoor entertaining area with a kitchen and television. Located in Destiny East's gated community, this home expands its' privacy in a quiet cul-de-sac. It was designed with an open floor plan to capture the natural lighting throughout. On the first level of the home, you'll get the full coastal experience in the chef's kitchen with commercial-grade appliances. This area is ideal for entertaining, from stainless steel appliances to a beautiful island opening to the living room. Off the kitchen is a large dining room area that seats up to 8 guests overlooking the water. The living room connects the kitchen and dining, offering plenty of comfortable seating with a large flat-screen TV. Also on this level is the master bedroom with a private shower and Jacuzzi tub. Lastly, you'll enjoy the huge mudroom with a stacked washer and dryer with an additional stainless steel refrigerator.

On the second floor, you'll find 4 additional guest bedrooms that still captivate the natural lighting throughout. Two of the rooms each have a king bed that shares a bathroom with a shower/tub combo. The neighboring guest room has a beautifully designed king bed sharing a bathroom as well. The fourth bedroom is designed to sleep multiple guests throughout three twin-over-twin built-in bunk beds. Right outside of the home is a private Carriage House that includes 2 bedrooms and 2 baths. The first bedroom has a king bed, and the second includes another set of twin-over-twin build in bunks. With a private entrance and kitchen, this guest home provides its own additional space to accommodate anyone.`;

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
