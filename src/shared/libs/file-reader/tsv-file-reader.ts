import { readFileSync } from "node:fs";
import chalk from "chalk";
import { FileReader } from "./file-reader.interface.js";
import { Place, City, TypePlace, Benefits, User } from "../../types/index.js";

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateRawData(): void {
    if (! this.rawData) {
      throw new Error(chalk.red(`File was not read`));
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

    const isPremiumBoolean = isPremium === 'true';
    const isFavoriteBoolean = isFavorite === 'true';
    const isProBoolean = isPro === 'true';

    return {
      title,
      description,
      postDate: new Date(postDate),
      city: City[city as keyof typeof City],
      previewImage,
      images: this.parseImages(images),
      isPremium: isPremiumBoolean,
      isFavorite: isFavoriteBoolean,
      rating: this.parseStringToNumber(rating),
      typePlace: TypePlace[typePlace as keyof typeof TypePlace],
      bedrooms: this.parseStringToNumber(bedrooms),
      guests: this.parseStringToNumber(guests),
      price: this.parseStringToNumber(price),
      benefits: this.parseBenefits(benefits),
      author: this.parseAuthor(name, email, avatarUrl, password, isProBoolean),
      latitude: this.parseStringToFloatNumber(latitude),
      longitude: this.parseStringToFloatNumber(longitude),
    };
  }

  private parseImages(imagesString: string): string[] {
    return imagesString.split(';');
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

  private parseStringToNumber(value: string): number {
    return Number.parseInt(value, 10);
  }

  private parseStringToFloatNumber(value: string): number {
    return Number.parseFloat(value)
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Place[] {
    this.validateRawData();
    return this.parseRawDataToPlaces();
  }
}
