import { defaultClasses, prop, modelOptions, getModelForClass, Ref } from '@typegoose/typegoose';
import { Benefits, City, TypePlace } from '../../types/index.js';
import { UserEntity } from '../user/index.js';
import {
  MIN_LENGTH_TITLE,
  MAX_LENGTH_TITLE,
  MIN_LENGTH_DESCRIPTION,
  MAX_LENGTH_DESCRIPTION,
  MIN_RATING,
  MAX_RATING,
  MIN_BEDROOMS,
  MAX_BEDROOMS,
  MIN_GUESTS,
  MAX_GUESTS,
  MIN_PRICE,
  MAX_PRICE,
} from './const/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface PlaceEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'places',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class PlaceEntity extends defaultClasses.TimeStamps {
  @prop({required: true, minlength: MIN_LENGTH_TITLE, maxlength: MAX_LENGTH_TITLE, trim: true})
  public title!: string;

  @prop({required: true, minlength: MIN_LENGTH_DESCRIPTION, maxlength: MAX_LENGTH_DESCRIPTION, trim: true})
  public description!: string;

  @prop({required: true})
  public postDate!: Date;

  @prop({required: true})
  public city!: City;

  @prop({required: true})
  public previewImage!: string;

  @prop({required: true})
  public images!: string[];

  @prop({required: true})
  public isPremium!: boolean;

  @prop({required: true})
  public isFavorite!: boolean;

  @prop({required: true, min: MIN_RATING, max: MAX_RATING})
  public rating!: number;

  @prop({
    required: true,
    type: () => String,
    enum: TypePlace
  })
  public typePlace!: TypePlace;

  @prop({required: true, min: MIN_BEDROOMS, max: MAX_BEDROOMS})
  public bedrooms!: number;

  @prop({required: true, min: MIN_GUESTS, max: MAX_GUESTS})
  public guests!: number;

  @prop({required: true, min: MIN_PRICE, max: MAX_PRICE})
  public price!: number;

  @prop({
    required: true,
    type: () => String,
    default: [],
    enum: Benefits
  })
  public benefits!: Benefits[];

  @prop({
    required: true,
    ref: UserEntity
  })
  public userId!: Ref<UserEntity>;

  @prop({required: true})
  public latitude!: number;

  @prop({required: true})
  public longitude!: number;

  //? Должны рассчитываться автоматически - что это значит?
  @prop({})
  public reviewsCount: number;
}

export const PlaceModel = getModelForClass(PlaceEntity);
