import pkg from "@prisma/client";
const { Disease } = pkg;


export const Location = [
  {
    locationName: "Pharmacy A",
    latitude: 37.7749,
    longitude: -122.4194,
    medi: "Aspirin",
    stock: "50",
    startTime: new Date("2024-01-01T08:00:00Z"),
    endTime: new Date("2024-01-01T18:00:00Z"),
  },
  {
    locationName: "Pharmacy B",
    latitude: 34.0522,
    longitude: -118.2437,
    medi: "Ibuprofen",
    stock: "30",
    startTime: new Date("2024-01-01T09:00:00Z"),
    endTime: new Date("2024-01-01T19:00:00Z"),
  },
  {
    locationName: "Pharmacy C",
    latitude: 40.7128,
    longitude: -74.006,
    medi: "Paracetamol",
    stock: "100",
    startTime: new Date("2024-01-01T07:00:00Z"),
    endTime: new Date("2024-01-01T17:00:00Z"),
  },
];

export const Pill = [
  {
    pillName: "Aspirin",
  },
  {
    pillName: "Ibuprofen",
  },
  {
    pillName: "Paracetamol",
  },
];

export const User = [
    {
      bornYear: 1990,
      disease: Disease.HEADACHE, // Disease enum
      description: "",
    },
];