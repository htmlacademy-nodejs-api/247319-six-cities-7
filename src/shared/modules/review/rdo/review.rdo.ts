import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/index.js';

export class ReviewRdo {
  @Expose()
  public placeId: string;

  @Expose()
  public text: string;

  @Expose()
  public postDate: Date;

  @Expose()
  public rating: number;

  @Expose({name: 'userId'})
  @Type(() => UserRdo)
  public userId: UserRdo;
}
