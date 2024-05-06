export const CITIES = [
  'Paris',
  'Cologne',
  'Brussels',
  'Amsterdam',
  'Hamburg',
  'Dusseldorf',
] as const;

export type City = {
  name: typeof CITIES;
  location: {
    latitude: number;
    longitude: number;
  }
}
