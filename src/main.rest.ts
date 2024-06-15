import 'reflect-metadata';
import { Container } from 'inversify';

import { RestApplication } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createPlaceContainer } from './shared/modules/place/index.js';
import { createReviewContainer } from './shared/modules/review/index.js';
import { createAuthContainer } from './shared/modules/auth/index.js';

async function bootstrap() {
  const appContainer = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createPlaceContainer(),
    createReviewContainer(),
    createAuthContainer(),
  );

  const application = appContainer.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
