import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';
import 'tslib';
import { FileReader } from './file-reader.interface.js';
import { Place, TypePlace, Benefits, City } from '../../types/index.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384;

  constructor(
    private readonly filename: string
  ) {
    super();
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
      isPro,
      latitude,
      longitude
    ] = line.split('\t');

    const isProBoolean = isPro === 'true';

    return {
      title,
      description,
      postDate: new Date(postDate),
      city: city as unknown as City,
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
      user: {
        name: name,
        email: email,
        avatarUrl: avatarUrl,
        isPro: isProBoolean
      },
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
        console.error(`Unknown benefit: ${trimmedBenefit}`);
      }
    }

    return parsedBenefits;
  }

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedPlace = this.parseLineToPlace(completeRow);

        await new Promise((resolve) => {
          this.emit('line', parsedPlace, resolve);
        });
      }
    }

    this.emit('end', importedRowCount);
  }
}
