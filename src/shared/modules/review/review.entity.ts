import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { UserEntity } from '../user/index.js';
import { PlaceEntity } from '../place/place.entity.js';

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
  @prop({required: true, trim: true, min: 5, max: 1024})
  public text: string;

  //postDate отнаследуем от createdAt - не завёл отдельное поле

  @prop({
    required: true,
    min: 1,
    max: 5,
  })
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
