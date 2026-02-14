// This file is intentionally NOT an ES module so the prototype can run
// by simply opening `index.html` (file://) without a local dev server.
//
// IMPORTANT: Wrap in an IIFE to avoid polluting the global scope with
// top-level `const` names (which would conflict with other scripts).
(() => {
const SOURCE = {
  website: "https://switzerland2029.ch/en/",
  facts:
    "Facts used in this prototype (dates + sports by location) are based on the official Switzerland 2029 website.",
};

const EVENT = {
  name: "Special Olympics World Winter Games 2029",
  host: "Switzerland",
  dates: {
    start: "2029-03-10",
    end: "2029-03-17",
    display: "March 10–17, 2029",
  },
  note:
    "Prototype guide for guests/athletes: pick your location for a quick overview (schedule, map, activities, emergency).",
  context: [
    "Competitions are held in the canton of Graubünden.",
    "Around 3,200 delegation members (approx. 2,500 athletes and 700 coaches) from 100+ countries (per official site).",
    "Roughly 12,000 people are expected to be active around events daily (per official site).",
    "Opening ceremony is planned at Letzigrund Stadium in Zurich on March 10, 2029.",
    "Host Town Program happens before the opening ceremony (prototype placeholder).",
  ],
};

/**
 * Coordinates are approximate town centers, used only for the map embed.
 */
const LOCATIONS = [
  {
    id: "arosa",
    name: "Arosa",
    region: "Graubünden",
    sports: ["Alpine skiing", "Snowboarding"],
    description:
      "Mountain resort host area for alpine skiing and snowboarding competitions.",
    coords: { lat: 46.7837, lon: 9.6793 },
    map: {
      embedUrl:
        "https://www.openstreetmap.org/export/embed.html?bbox=9.618%2C46.750%2C9.743%2C46.815&layer=mapnik&marker=46.7837%2C9.6793",
      openUrl:
        "https://www.openstreetmap.org/?mlat=46.7837&mlon=9.6793#map=13/46.7837/9.6793",
    },
    quick: {
      hotels: [
        "Hotel (placeholder)",
        "Athlete-friendly accommodation (placeholder)",
        "Accessible lodging (placeholder)",
      ],
      venues: [
        "Competition venue: slopes (placeholder)",
        "Athlete check-in point (placeholder)",
      ],
    },
    activities: {
      food: ["Restaurant (placeholder)", "Café (placeholder)", "Quick bites (placeholder)"],
      thingsToDo: [
        "Scenic walk (placeholder)",
        "Sledding / winter fun (placeholder)",
        "Family activity (placeholder)",
      ],
      services: ["Pharmacy (placeholder)", "Grocery store (placeholder)", "ATM (placeholder)"],
    },
  },
  {
    id: "chur",
    name: "Chur",
    region: "Graubünden",
    sports: ["Figure skating", "Short track", "Floorball"],
    description:
      "City hub host area for indoor and ice sports competitions.",
    coords: { lat: 46.8508, lon: 9.5329 },
    map: {
      embedUrl:
        "https://www.openstreetmap.org/export/embed.html?bbox=9.470%2C46.820%2C9.585%2C46.885&layer=mapnik&marker=46.8508%2C9.5329",
      openUrl:
        "https://www.openstreetmap.org/?mlat=46.8508&mlon=9.5329#map=13/46.8508/9.5329",
    },
    quick: {
      hotels: [
        "Hotel near venue (placeholder)",
        "Accessible hotel (placeholder)",
        "Budget option (placeholder)",
      ],
      venues: [
        "Ice arena (placeholder)",
        "Indoor hall (placeholder)",
        "Accreditation desk (placeholder)",
      ],
    },
    activities: {
      food: ["Restaurant (placeholder)", "Food court (placeholder)", "Bakery (placeholder)"],
      thingsToDo: [
        "Old town stroll (placeholder)",
        "Museum visit (placeholder)",
        "Family-friendly activity (placeholder)",
      ],
      services: ["Pharmacy (placeholder)", "Train station info (placeholder)", "ATM (placeholder)"],
    },
  },
  {
    id: "lenzerheide",
    name: "Lenzerheide",
    region: "Graubünden",
    sports: ["Cross-country skiing", "Snowshoeing", "Dance"],
    description:
      "Mountain host area for endurance and outdoor activities (plus dance).",
    coords: { lat: 46.7278, lon: 9.5572 },
    map: {
      embedUrl:
        "https://www.openstreetmap.org/export/embed.html?bbox=9.495%2C46.695%2C9.620%2C46.760&layer=mapnik&marker=46.7278%2C9.5572",
      openUrl:
        "https://www.openstreetmap.org/?mlat=46.7278&mlon=9.5572#map=13/46.7278/9.5572",
    },
    quick: {
      hotels: [
        "Hotel (placeholder)",
        "Accessible lodging (placeholder)",
        "Team accommodation (placeholder)",
      ],
      venues: [
        "Cross-country trail start (placeholder)",
        "Snowshoe course (placeholder)",
        "Dance venue (placeholder)",
      ],
    },
    activities: {
      food: ["Restaurant (placeholder)", "Mountain hut (placeholder)", "Café (placeholder)"],
      thingsToDo: [
        "Snowshoe loop (placeholder)",
        "Lake view point (placeholder)",
        "Family sledding (placeholder)",
      ],
      services: ["Pharmacy (placeholder)", "Grocery store (placeholder)", "ATM (placeholder)"],
    },
  },
];

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "schedule", label: "Schedule" },
  { id: "map", label: "Map" },
  { id: "activities", label: "Activities" },
  { id: "emergency", label: "Emergency" },
];

const EMERGENCY_CONTACTS = [
  { label: "Emergency (EU)", number: "112", note: "Any emergency (if unsure, call this)." },
  { label: "Police", number: "117", note: "Police assistance." },
  { label: "Fire", number: "118", note: "Fire & rescue." },
  { label: "Ambulance", number: "144", note: "Medical emergency." },
  { label: "Rega (air rescue)", number: "1414", note: "Air rescue / helicopter." },
  { label: "Tox Info Suisse", number: "145", note: "Poisoning advice." },
  { label: "Event help desk", number: "+41 00 000 00 00", note: "Prototype placeholder." },
];

const SCHEDULE_DAYS = [
  {
    date: "2029-03-10",
    label: "Sat, Mar 10",
    items: [
      "Arrivals & accreditation (placeholder)",
      "Opening day briefings (placeholder)",
      "Opening Ceremony (Zurich) — reference from official site",
    ],
  },
  {
    date: "2029-03-11",
    label: "Sun, Mar 11",
    items: [
      "Competition sessions (placeholder)",
      "Welcome activities in each location (placeholder)",
    ],
  },
  {
    date: "2029-03-12",
    label: "Mon, Mar 12",
    items: [
      "Competition sessions (placeholder)",
      "Community inclusion event (placeholder)",
    ],
  },
  {
    date: "2029-03-13",
    label: "Tue, Mar 13",
    items: [
      "Competition sessions (placeholder)",
      "Evening fan zone / cultural program (placeholder)",
    ],
  },
  {
    date: "2029-03-14",
    label: "Wed, Mar 14",
    items: [
      "Competition sessions (placeholder)",
      "Healthy Athletes / wellness (placeholder)",
    ],
  },
  {
    date: "2029-03-15",
    label: "Thu, Mar 15",
    items: [
      "Finals (some sports) (placeholder)",
      "Awards & celebrations (placeholder)",
    ],
  },
  {
    date: "2029-03-16",
    label: "Fri, Mar 16",
    items: [
      "Finals (some sports) (placeholder)",
      "Delegation gatherings (placeholder)",
    ],
  },
  {
    date: "2029-03-17",
    label: "Sat, Mar 17",
    items: [
      "Wrap-up activities (placeholder)",
      "Closing events (placeholder)",
      "Departures (placeholder)",
    ],
  },
];

// Expose data globally for `app.js`.
window.WS2029_DATA = {
  SOURCE,
  EVENT,
  LOCATIONS,
  TABS,
  EMERGENCY_CONTACTS,
  SCHEDULE_DAYS,
};
})();

