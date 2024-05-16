import { defaultClasses, prop, modelOptions, getModelForClass } from '@typegoose/typegoose';
import { Benefits, City, Place, TypePlace } from '../../types/index.js';
import { UserEntity } from '../user/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface PlaceEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'places',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class PlaceEntity extends defaultClasses.TimeStamps implements Place {
  @prop({required: true, minlength: 10, maxlength: 100, trim: true})
  public title!: string;

  @prop({required: true, minlength: 20, maxlength: 1024, trim: true})
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

  @prop({
    required: true,
    min: 1,
    max: 5,
  })
  public rating!: number;

  @prop({
    required: true,
    type: () => String,
    enum: TypePlace
  })
  public typePlace!: TypePlace;

  @prop({required: true, min: 1, max: 8})
  public bedrooms!: number;

  @prop({required: true, min: 1, max: 10})
  public guests!: number;

  @prop({required: true, min: 100, max: 100000})
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
  public user!: UserEntity;
  //? как тут корректно задать ссылку на пользователя ?

  @prop({required: true})
  public latitude!: number;

  @prop({required: true})
  public longitude!: number;
}

export const PlaceModel = getModelForClass(PlaceEntity);
