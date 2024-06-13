import {
  MIN_LENGTH_TEXT,
  MAX_LENGTH_TEXT,
  MIN_RATING,
  MAX_RATING,
} from '../const/index.js';

export const CreateReviewValidationMessages = {
  text: {
    minLength: `Minimum title length must be ${MIN_LENGTH_TEXT}`,
    maxLength: `Maximum title length must be ${MAX_LENGTH_TEXT}`,
  },
  rating: {
    invalidFormat: 'rating must be a number',
    minValue: `Minimum rating must be ${MIN_RATING}`,
    maxValue: `Maximum rating must be ${MAX_RATING}`,

  },
  placeId: {
    placeId: 'userId field must be a valid id',
  },
  userId: {
    invalidId: 'userId field must be a valid id',
  }
} as const;
