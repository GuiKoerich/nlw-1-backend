import express from 'express';
import multer from 'multer';
import { celebrate, Joi } from 'celebrate';

import ItemsController from './controllers/itemsController';
import PointsController from './controllers/pointsController';

import multerConfig from './config/multer';

const routes = express.Router();
const upload = multer(multerConfig);

const itemsController = new ItemsController();
const pointsController = new PointsController();

routes.get('/items', itemsController.index);

routes.get('/points', pointsController.index);
routes.get('/points/:id', 
  celebrate({
    params: Joi.number().required(),
  }), 
  pointsController.show);
routes.post('/points', 
  upload.single('image'), 
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      phone: Joi.string().required(),
      lat: Joi.number().required(),
      lon: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string().required(),
    }), 
  }, {
    abortEarly: false,
  }),
  pointsController.create);

export default routes;