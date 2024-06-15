import { IsInt, IsMongoId, IsString, MaxLength, Min, Max, MinLength } from 'class-validator';
import { CreateReviewValidationMessages } from './create-review.messages.js';

export class CreateReviewDto {
  @IsString()
  @MinLength(5, {message: CreateReviewValidationMessages.text.minLength})
  @MaxLength(1024, {message: CreateReviewValidationMessages.text.maxLength})
  public text: string;

  @IsInt()
  @Min(1, {message: CreateReviewValidationMessages.rating.minValue})
  @Max(5, {message: CreateReviewValidationMessages.rating.maxValue})
  public rating: number;

  @IsMongoId()
  public placeId: string;

  public userId: string;
}
