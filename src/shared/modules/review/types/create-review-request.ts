import { Request } from 'express';
import { RequestBody, RequestParams } from '../../../libs/rest/index.js';
import { CreateReviewDto } from '../index.js';

export type CreateReviewRequest = Request<RequestParams, RequestBody, CreateReviewDto>;
