import { City } from "./city.enum.js";
import { TypePlace } from "./type-place.enum.js";
import { Benefits } from "./benefits.enum.js";
import { User } from "./user.types.js";

export type Place = {
  title: string;
  description: string;
  postDate: Date;
  city: City;
  previewImage: string;
  images: string[];
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  typePlace: TypePlace;
  bedrooms: number;
  guests: number;
  price: number;
  benefits: Benefits[];
  author: User;
  latitude: number;
  longitude: number;
}
