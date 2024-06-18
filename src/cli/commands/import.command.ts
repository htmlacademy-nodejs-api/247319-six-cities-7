import chalk from 'chalk';
import { Command } from './command.interface.js';
import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Place } from '../../shared/types/place.types.js';
import { getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';
import { DefaultUserService, UserModel, UserService } from '../../shared/modules/user/index.js';
import { DefaultPlaceService, PlaceModel, PlaceService } from '../../shared/modules/place/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { Logger } from '../../shared/libs/logger/index.js';
import { ConsoleLogger } from '../../shared/libs/logger/index.js';
import { DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD } from './command.constant.js';

export class ImportCommand implements Command {
  private userService: UserService;
  private placeService: PlaceService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedPlace = this.onImportedPlace.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.placeService = new DefaultPlaceService(this.logger, PlaceModel);
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  public getName(): string {
    return '--import';
  }

  private async onImportedPlace(place: Place, resolve: () => void) {
    await this.savePlace(place);
    resolve();
  }

  private async savePlace(place: Place) {
    const user = await this.userService.findOrCreate({
      ...place.user,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    await this.placeService.create({
      title: place.title,
      description: place.description,
      postDate: place.postDate,
      city: place.city,
      images: place.images,
      isPremium: place.isPremium,
      typePlace: place.typePlace,
      bedrooms: place.bedrooms,
      guests: place.guests,
      price: place.price,
      benefits: place.benefits,
      userId: user.id,
      latitude: place.latitude,
      longitude: place.longitude,
    });
  }

  private onCompleteImport(count: number) {
    console.info(chalk.green(`${count} rows imported`));
    this.databaseClient.disconnect();
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseClient.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onImportedPlace);
    fileReader.on('end', this.onCompleteImport);

    try {
      fileReader.read();
    } catch (error) {
      console.error(chalk.red(`Can't import data from file: ${filename}`));
      console.error(chalk.red(getErrorMessage(error)));
    }
  }
}
