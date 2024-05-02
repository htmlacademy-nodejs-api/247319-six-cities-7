import { generateRandomRating, generateRandomValue, getRandomBoolean, getRandomItem, getRandomItems } from '../../helpers/common.js';
import { Benefits } from '../../types/benefits.enum.js';
import { MockServerData } from '../../types/mock-server-data.types.js';
import { TypePlace } from '../../types/type-place.enum.js';
import { PlaceGenerator } from './place-generator.interface.js';
import { MIN_PRICE, MAX_PRICE, MIN_RATING, MAX_RATING, MIN_BEDROOMS, MAX_BEDROOMS, MIN_GUESTS, MAX_GUESTS, FIRST_WEEK_DAY, LAST_WEEK_DAY } from './const.js';
import dayjs from 'dayjs';

export class TSVPlaceGenerator implements PlaceGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItems<string>(this.mockData.descriptions).join(';');
    const postDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const city = getRandomItem<string>(this.mockData.cities);
    const previewImage = getRandomItem<string>(this.mockData.previewImages);
    const images = getRandomItems<string>(this.mockData.images).join(';');
    const isPremium = getRandomBoolean();
    const isFavorite = getRandomBoolean();
    const rating = generateRandomRating(MIN_RATING, MAX_RATING).toString();
    const typePlace = getRandomItem([TypePlace.Apartment, TypePlace.Hotel, TypePlace.House, TypePlace.Room]);
    const bedrooms = generateRandomValue(MIN_BEDROOMS, MAX_BEDROOMS).toString();
    const guests = generateRandomValue(MIN_GUESTS, MAX_GUESTS).toString();
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const benefits = getRandomItems([Benefits.AirConditioning, Benefits.BabySeat, Benefits.Breakfast, Benefits.Fridge, Benefits.Laptop, Benefits.Towels, Benefits.Washer]).join(';');
    const author = getRandomItem(this.mockData.authors);
    const email = getRandomItem(this.mockData.emails);
    const avatarUrl = getRandomItem(this.mockData.avatarsUrl);
    const isPro = getRandomBoolean();
    const longitude = getRandomItem<string>(this.mockData.longitudes);
    const latitude = getRandomItem<string>(this.mockData.latitudes);

    return [
      title, description, postDate, city, previewImage, images, isPremium, isFavorite, rating,
      typePlace, bedrooms, guests, price, benefits, author, email, avatarUrl, isPro, longitude, latitude
    ].join('\t');
  }
}
