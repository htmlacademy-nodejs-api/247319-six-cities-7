import { City } from './city.types.js';
import { User } from './user.types.js';

export type MockServerData = {
  titles: string[];
  descriptions: string[];
  postDate: Date;
  cities: City[];
  previewImages: string[];
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  typesPlace: string;
  bedrooms: number;
  guests: number;
  price: number;
  benefits: string[];
  user: User[];
  isPro: boolean;
  longitudes: string[];
  latitudes: string[];
};
