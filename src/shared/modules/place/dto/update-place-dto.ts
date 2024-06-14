import { City, TypePlace } from '../../../types/index.js';
import { IsArray, Min, Max, IsDateString, IsEnum, IsInt, IsIn, MaxLength, MinLength, IsMongoId, IsBoolean, IsOptional, ArrayMaxSize } from 'class-validator';
import { UpdatePlaceValidationMessage } from './update-place.messages.js';
import { CITIES } from '../../../types/city.types.js';

export class UpdatePlaceDto {
  @IsOptional()
  @MinLength(10, {message: UpdatePlaceValidationMessage.title.minLength})
  @MaxLength(100, {message: UpdatePlaceValidationMessage.title.maxLength})
  public title?: string;

  @IsOptional()
  @MinLength(20, {message: UpdatePlaceValidationMessage.description.minLength})
  @MaxLength(1024, {message: UpdatePlaceValidationMessage.description.maxLength})
  public description?: string;

  @IsOptional()
  @IsDateString({}, {message: UpdatePlaceValidationMessage.postDate.invalidFormat})
  public postDate?: Date;

  @IsOptional()
  @IsIn(CITIES, {message: UpdatePlaceValidationMessage.city.invalid})
  public city?: City;

  @IsOptional()
  @MaxLength(256, {message: UpdatePlaceValidationMessage.previewImage.maxLength})
  public previewImage?: string;

  @IsOptional()
  @ArrayMaxSize(6)
  @IsArray({message: UpdatePlaceValidationMessage.images.invalidFormat})
  @MaxLength(256, {message: UpdatePlaceValidationMessage.images.maxLength})
  public images?: string[];

  @IsOptional()
  @IsBoolean()
  public isPremium?: boolean;

  @IsOptional()
  @IsEnum(TypePlace, {message: UpdatePlaceValidationMessage.typePlace.invalidFormat})
  public typePlace?: TypePlace;

  @IsOptional()
  @IsInt()
  @Min(1, {message: UpdatePlaceValidationMessage.bedrooms.minValue})
  @Max(8, {message: UpdatePlaceValidationMessage.bedrooms.maxValue})
  public bedrooms?: number;

  @IsOptional()
  @IsInt()
  @Min(1, {message: UpdatePlaceValidationMessage.guests.minValue})
  @Max(10, {message: UpdatePlaceValidationMessage.guests.maxValue})
  public guests?: number;

  @IsOptional()
  @IsInt()
  @Min(100, {message: UpdatePlaceValidationMessage.price.minValue})
  @Max(100000, {message: UpdatePlaceValidationMessage.price.maxValue})
  public price?: number;

  @IsOptional()
  @IsArray({message: UpdatePlaceValidationMessage.benefits.invalidFormat})
  public benefits?: string[];

  @IsOptional()
  @IsMongoId({message: UpdatePlaceValidationMessage.userId.invalidId})
  public userId?: string;

  @IsOptional()
  public latitude?: number;

  @IsOptional()
  public longitude?: number;
}
