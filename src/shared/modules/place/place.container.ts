import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { DefaultPlaceService, PlaceController, PlaceEntity, PlaceModel, PlaceService } from './index.js';
import { Component } from '../../types/index.js';
import { Controller } from '../../libs/rest/index.js';

export function createPlaceContainer() {
  const placeContainer = new Container();

  placeContainer.bind<PlaceService>(Component.PlaceService).to(DefaultPlaceService);
  placeContainer.bind<types.ModelType<PlaceEntity>>(Component.PlaceModel).toConstantValue(PlaceModel);
  placeContainer.bind<Controller>(Component.PlaceController).to(PlaceController).inSingletonScope();

  return placeContainer;
}
