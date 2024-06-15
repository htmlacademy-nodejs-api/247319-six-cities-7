import { Expose } from 'class-transformer';
import { City, TypePlace } from '../../../types/index.js';

export class PlaceFavoritesRdo {
  @Expose()
  public id: string;

  @Expose()
  public price: number;

  @Expose()
  public title: string;

  @Expose()
  public typePlace: TypePlace;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public postDate: Date;

  @Expose()
  public city: City;

  @Expose()
  public previewImage: string;

  @Expose()
  public isPremium: boolean;

  @Expose()
  public averageRating: number;

  @Expose()
  public reviewsCount: number;
}
