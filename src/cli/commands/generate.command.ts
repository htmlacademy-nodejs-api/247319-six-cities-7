import got from 'got';
import { appendFile } from 'node:fs/promises';
import { Command } from './command.interface.js';
import { MockServerData } from '../../shared/types/index.js';
import { TSVPlaceGenerator } from '../../shared/libs/place-generator/index.js';

export class GenerateCommand implements Command {
  private initialData: MockServerData;

  public getName(): string {
    return '--generate';
  }

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Can't load data from ${url}`);
    }
  }

  private async write(filepath: string, placeCount: number) {
    const tsvPlaceGenerator = new TSVPlaceGenerator(this.initialData);
    for (let i = 0; i < placeCount; i++) {
      await appendFile(
        filepath,
        `${tsvPlaceGenerator.generate()}\n`,
        { encoding: 'utf8' }
      );
    }
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const placeCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filepath, placeCount);
      console.info(`File ${filepath} was created`);
    } catch (error: unknown) {
      console.error('Can\'t generate data');

      if (error instanceof Error) {
        console.error(error.message);
      }
    }

  }
}
