import { Expose, Type } from 'class-transformer';
import { City, TypePlace } from '../../../types/index.js';
import { UserRdo } from '../../user/index.js';

export class PlaceDetailedRdo {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public description: string;

  @Expose()
  public postDate: Date;

  @Expose()
  public city: City;

  @Expose()
  public previewImage: string;

  @Expose()
  public images: string[];

  @Expose()
  public isPremium: boolean;

  @Expose()
  public isFavorite: boolean;

  @Expose()
  public averageRating: number;

  @Expose()
  public typePlace: TypePlace;

  @Expose()
  public bedrooms: number;

  @Expose()
  public guests: number;

  @Expose()
  public price: number;

  @Expose()
  public benefits: string[];

  @Expose()
  @Type(() => UserRdo)
  public userId: UserRdo;

  @Expose()
  public latitude: number;

  @Expose()
  public longitude: number;

  @Expose()
  public reviewsCount: number;
}
