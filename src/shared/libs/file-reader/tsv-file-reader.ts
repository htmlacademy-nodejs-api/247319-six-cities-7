import { readFileSync } from 'node:fs';
import chalk from 'chalk';
import { FileReader } from './file-reader.interface.js';
import { Place, City, TypePlace, Benefits, User } from '../../types/index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateRawData(): void {
    if (! this.rawData) {
      throw new Error(chalk.red('File was not read'));
    }
  }

  private parseRawDataToPlaces(): Place[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToPlace(line));
  }

  private parseLineToPlace(line: string): Place {
    const [
      title,
      description,
      postDate,
      city,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      typePlace,
      bedrooms,
      guests,
      price,
      benefits,
      name,
      email,
      avatarUrl,
      password,
      isPro,
      latitude,
      longitude
    ] = line.split('\t');

    const isProBoolean = isPro === 'true';

    return {
      title,
      description,
      postDate: new Date(postDate),
      city: City[city as keyof typeof City],
      previewImage,
      images: images.split(';'),
      isPremium: isPremium === 'true',
      isFavorite: isFavorite === 'true',
      rating: Number.parseFloat(rating),
      typePlace: TypePlace[typePlace as keyof typeof TypePlace],
      bedrooms: Number(bedrooms),
      guests: Number(guests),
      price: Number(price),
      benefits: this.parseBenefits(benefits),
      author: this.parseAuthor(name, email, avatarUrl, password, isProBoolean),
      latitude: Number.parseFloat(latitude),
      longitude: Number.parseFloat(longitude),
    };
  }

  private parseBenefits(benefitsString: string): Benefits[] {
    const benefitsArray = benefitsString.split(';');
    const parsedBenefits: Benefits[] = [];

    for (const benefit of benefitsArray) {
      const trimmedBenefit = benefit.trim();

      if (Object.values(Benefits).includes(trimmedBenefit as Benefits)) {
        parsedBenefits.push(trimmedBenefit as Benefits);
      } else {
        throw new Error(`Unknown benefit: ${trimmedBenefit}`);
      }
    }

    return parsedBenefits;
  }

  private parseAuthor(name: string, email: string, avatarUrl: string, password: string, isPro: boolean): User {
    return {name, email, avatarUrl, password, isPro};
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Place[] {
    this.validateRawData();
    return this.parseRawDataToPlaces();
  }
}
