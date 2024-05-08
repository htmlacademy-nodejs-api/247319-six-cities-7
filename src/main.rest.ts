import 'reflect-metadata';
import { Container } from 'inversify';

import { RestApplication } from './rest/index.js';
import { RestConfig, RestSchema, Config } from './shared/libs/config/index.js';
import { PinoLogger, Logger } from './shared/libs/logger/index.js';
import { Component } from './shared/types/index.js';

async function bootstrap() {
  const container = new Container();
  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();

  const application = container.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
