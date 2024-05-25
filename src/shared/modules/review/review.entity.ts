import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';
import { PlaceEntity } from '../place/place.entity.js';
import { MAX_LENGTH_TEXT, MAX_RATING, MIN_LENGTH_TEXT, MIN_RATING } from './const/index.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface ReviewEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'reviews',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class ReviewEntity extends defaultClasses.TimeStamps {
  @prop({required: true, trim: true, min: MIN_LENGTH_TEXT, max: MAX_LENGTH_TEXT})
  public text: string;

  @prop({required: true, min: MIN_RATING, max: MAX_RATING})
  public rating!: number;

  @prop({
    ref: PlaceEntity,
    required: true,
  })
  public placeId: Ref<PlaceEntity>;

  @prop({
    required: true,
    ref: UserEntity
  })
  public userId!: Ref<UserEntity>;
}

export const ReviewModel = getModelForClass(ReviewEntity);
