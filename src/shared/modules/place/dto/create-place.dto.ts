import { City, TypePlace } from '../../../types/index.js';
export class CreatePlaceDto {
  public title: string;
  public description: string;
  public postDate: Date;
  public city: City;
  public previewImage: string;
  public images: string[];
  public isPremium: boolean;
  public isFavorite: boolean;
  public rating: number;
  public typePlace: TypePlace;
  public bedrooms: number;
  public guests: number;
  public price: number;
  public benefits: string[];
  public userId: string;
  public latitude: number;
  public longitude: number;
}
