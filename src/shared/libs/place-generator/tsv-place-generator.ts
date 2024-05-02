import { generateRandomRating, generateRandomValue, getRandomBoolean, getRandomItem, getRandomItems } from '../../helpers/common.js';
import { Benefits } from '../../types/benefits.enum.js';
import { MockServerData } from '../../types/mock-server-data.types.js';
import { TypePlace } from '../../types/type-place.enum.js';
import { PlaceGenerator } from './place-generator.interface.js';
import dayjs from 'dayjs';

const MIN_PRICE = 10;
const MAX_PRICE = 100000;
const MIN_RATING = 1;
const MAX_RATING = 5;
const MIN_BEDROOMS = 1;
const MAX_BEDROOMS = 8;
const MIN_GUESTS = 1;
const MAX_GUESTS = 10;
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVPlaceGenerator implements PlaceGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItems(this.mockData.descriptions).join(';');
    const postDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const city = getRandomItem(this.mockData.cities);
    const previewImage = getRandomItem(this.mockData.previewImages);
    const images = getRandomItems(this.mockData.images).join(';');
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
      typePlace, bedrooms, guests, price, benefits, author, email, avatarUrl, isPro, latitude, longitude
    ].join('\t');
  }
}
