import {
  MIN_LENGTH_TITLE,
  MAX_LENGTH_TITLE,
  MIN_LENGTH_DESCRIPTION,
  MAX_LENGTH_DESCRIPTION,
  MIN_BEDROOMS,
  MAX_BEDROOMS,
  MIN_GUESTS,
  MAX_GUESTS,
  MIN_PRICE,
  MAX_PRICE,
} from '../const/index.js';

export const CreatePlaceValidationMessage = {
  title: {
    minLength: `Minimum title length must be ${MIN_LENGTH_TITLE}`,
    maxLength: `Maximum title length must be ${MAX_LENGTH_TITLE}`,
  },
  description: {
    minLength: `Minimum description length must be ${MIN_LENGTH_DESCRIPTION}`,
    maxLength: `Maximum description length must be ${MAX_LENGTH_DESCRIPTION}`,
  },
  postDate: {
    invalidFormat: 'postDate must be a valid ISO date',
  },
  city: {
    invalid: 'City must be a Paris, Cologne, Brussels, Amsterdam, Hamburg or Dusseldorf',
  },
  previewImage: {
    Length: 'one previewImage must be exist',
  },
  images: {
    invalidFormat: 'Field images must be an array',
    Length: 'Count images must be 6',
  },
  typePlace: {
    invalidFormat: 'typePlace must be an Apartment, House, Room or Hotel',
  },
  bedrooms: {
    invalidFormat: 'Bedrooms must be an integer',
    minValue: `Minimum bedrooms must be ${MIN_BEDROOMS}`,
    maxValue: `Maximum bedrooms must be ${MAX_BEDROOMS}`,
  },
  guests: {
    invalidFormat: 'Guests must be an integer',
    minValue: `Minimum guests must be ${MIN_GUESTS}`,
    maxValue: `Maximum guests must be ${MAX_GUESTS}`,
  },
  price: {
    invalidFormat: 'Price must be an integer',
    minValue: `Minimum price must be ${MIN_PRICE}`,
    maxValue: `Maximum price must be ${MAX_PRICE}`,

  },
  benefits: {
    invalidFormat: 'Field benefits must be an array',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  },
  latitude: {},
  longitude: {},
} as const;
