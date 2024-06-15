import { City, TypePlace } from '../../../types/index.js';
import { IsArray, Min, Max, IsDateString, IsEnum, IsInt, IsIn, MaxLength, MinLength, IsString, IsBoolean, ArrayMaxSize, ArrayMinSize } from 'class-validator';
import { CreatePlaceValidationMessage } from './create-place.messages.js';
import { CITIES } from '../../../types/city.types.js';
export class CreatePlaceDto {
  @MinLength(10, {message: CreatePlaceValidationMessage.title.minLength})
  @MaxLength(100, {message: CreatePlaceValidationMessage.title.maxLength})
  public title: string;

  @MinLength(20, {message: CreatePlaceValidationMessage.description.minLength})
  @MaxLength(1024, {message: CreatePlaceValidationMessage.description.maxLength})
  public description: string;

  @IsDateString({}, {message: CreatePlaceValidationMessage.postDate.invalidFormat})
  public postDate: Date;

  @IsIn(CITIES, {message: CreatePlaceValidationMessage.city.invalid})
  public city: City;

  @MaxLength(256, {message: CreatePlaceValidationMessage.previewImage.maxLength})
  public previewImage: string;

  @IsString({each: true, message: CreatePlaceValidationMessage.images.invalidFormat})
  @ArrayMaxSize(6)
  @ArrayMinSize(6)
  @MaxLength(256, {each: true, message: CreatePlaceValidationMessage.images.maxLength})
  public images: string[];

  @IsBoolean()
  public isPremium: boolean;

  @IsEnum(TypePlace, {message: CreatePlaceValidationMessage.typePlace.invalidFormat})
  public typePlace: TypePlace;

  @IsInt()
  @Min(1, {message: CreatePlaceValidationMessage.bedrooms.minValue})
  @Max(8, {message: CreatePlaceValidationMessage.bedrooms.maxValue})
  public bedrooms: number;

  @IsInt()
  @Min(1, {message: CreatePlaceValidationMessage.guests.minValue})
  @Max(10, {message: CreatePlaceValidationMessage.guests.maxValue})
  public guests: number;

  @IsInt()
  @Min(100, {message: CreatePlaceValidationMessage.price.minValue})
  @Max(100000, {message: CreatePlaceValidationMessage.price.maxValue})
  public price: number;

  @IsArray({message: CreatePlaceValidationMessage.benefits.invalidFormat})
  public benefits: string[];

  public userId: string;

  //Нужны тут проверки? или эти поля автоматически будут подставляться?
  public latitude: number;
  public longitude: number;
}
