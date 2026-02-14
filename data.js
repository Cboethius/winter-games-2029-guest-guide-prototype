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
  { id: "athletes", label: "Athletes" },
  { id: "emergency", label: "Emergency" },
];

/**
 * Prototype athlete roster (placeholder).
 * Use fictional sample data for the meeting demo.
 */
const ATHLETES = [
  // Arosa
  { id: "a1", name: "Lina Meier", country: "Switzerland", sport: "Alpine skiing", locationId: "arosa" },
  { id: "a2", name: "Mateo Rossi", country: "Italy", sport: "Snowboarding", locationId: "arosa" },
  { id: "a3", name: "Sofia Novak", country: "Austria", sport: "Alpine skiing", locationId: "arosa" },
  { id: "a4", name: "Ethan Carter", country: "Canada", sport: "Snowboarding", locationId: "arosa" },
  { id: "a5", name: "Noor Al‑Hassan", country: "Jordan", sport: "Alpine skiing", locationId: "arosa" },
  { id: "a6", name: "Mika Tanaka", country: "Japan", sport: "Snowboarding", locationId: "arosa" },

  // Chur
  { id: "c1", name: "Ava Müller", country: "Germany", sport: "Figure skating", locationId: "chur" },
  { id: "c2", name: "Lucas Johnson", country: "United States", sport: "Short track", locationId: "chur" },
  { id: "c3", name: "Nora Schmid", country: "Switzerland", sport: "Floorball", locationId: "chur" },
  { id: "c4", name: "Benji Kowalski", country: "Poland", sport: "Short track", locationId: "chur" },
  { id: "c5", name: "Maya Dubois", country: "France", sport: "Figure skating", locationId: "chur" },
  { id: "c6", name: "Samir Khan", country: "Pakistan", sport: "Floorball", locationId: "chur" },

  // Lenzerheide
  { id: "l1", name: "Olivia Berg", country: "Norway", sport: "Cross-country skiing", locationId: "lenzerheide" },
  { id: "l2", name: "Diego Fernández", country: "Spain", sport: "Snowshoeing", locationId: "lenzerheide" },
  { id: "l3", name: "Chloé Martin", country: "France", sport: "Dance", locationId: "lenzerheide" },
  { id: "l4", name: "Tomasz Nowak", country: "Czechia", sport: "Cross-country skiing", locationId: "lenzerheide" },
  { id: "l5", name: "Fatima El Amrani", country: "Morocco", sport: "Snowshoeing", locationId: "lenzerheide" },
  { id: "l6", name: "Sara Nilsson", country: "Sweden", sport: "Dance", locationId: "lenzerheide" },
];

/**
 * Disability information (prototype, educational).
 * Notes:
 * - This is not a diagnosis tool.
 * - People and support needs vary widely.
 */
const DISABILITIES = [
  {
    id: "intellectual_disability",
    name: "Intellectual disability",
    summary: "A disability that can affect learning, reasoning, and everyday adaptive skills.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Intellectual_disability",
  },
  {
    id: "autism",
    name: "Autism (Autism Spectrum Disorder)",
    summary: "A neurodevelopmental condition that can affect communication, social interaction, and sensory processing.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Autism",
  },
  {
    id: "down_syndrome",
    name: "Down syndrome",
    summary: "A genetic condition associated with extra chromosome 21 and a range of developmental and health differences.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Down_syndrome",
  },
  {
    id: "cerebral_palsy",
    name: "Cerebral palsy",
    summary: "A group of disorders affecting movement and posture due to non-progressive brain development differences.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Cerebral_palsy",
  },
  {
    id: "vision_impairment",
    name: "Vision impairment",
    summary: "Reduced vision that can’t be fully corrected with glasses, affecting navigation and reading visual cues.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Visual_impairment",
  },
  {
    id: "hearing_impairment",
    name: "Hearing impairment",
    summary: "Partial or total hearing loss that can affect communication and access to announcements.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Hearing_loss",
  },
  {
    id: "physical_disability",
    name: "Physical disability (mobility/coordination)",
    summary: "A broad category covering mobility, strength, coordination, or endurance differences.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Physical_disability",
  },
  {
    id: "multiple_disabilities",
    name: "Multiple disabilities",
    summary: "When a person has more than one disability and may need combined supports and accessible design.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Multiple_disabilities",
  },
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
  ATHLETES,
  DISABILITIES,
  EMERGENCY_CONTACTS,
  SCHEDULE_DAYS,
};
})();

