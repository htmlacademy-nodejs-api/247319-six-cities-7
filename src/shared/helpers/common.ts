import { ClassConstructor, plainToInstance } from 'class-transformer';

export function generateRandomValue(min:number, max: number, numAfterDigit = 0) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function generateRandomRating(min:number, max: number, numAfterDigit = 1) {
  return +((Math.random() * (max - min)) + min).toFixed(numAfterDigit);
}

export function getRandomItems<T>(items: T[]):T[] {
  if (items.length === 0) {
    return [];
  }
  const startPosition = generateRandomValue(0, items.length - 1);
  const endPosition = startPosition + generateRandomValue(1, items.length - startPosition);
  return items.slice(startPosition, endPosition);
}

export function getRandomSixImages<T>(images: T[]):T[] {
  if (images.length < 6) {
    throw new Error('Array length must be at least 6');
  }

  const startPosition = generateRandomValue(0, images.length - 6);
  const endPosition = startPosition + 6;
  return images.slice(startPosition, endPosition);
}

export function getRandomItem<T>(items: T[]):T {
  return items[generateRandomValue(0, items.length - 1)];
}

export function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '';
}

export function fillDTO<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});
}
