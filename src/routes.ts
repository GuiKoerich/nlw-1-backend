import express from 'express';
import multer from 'multer';

import ItemsController from './controllers/itemsController';
import PointsController from './controllers/pointsController';

import multerConfig from './config/multer';

const routes = express.Router();
const upload = multer(multerConfig);

const itemsController = new ItemsController();
const pointsController = new PointsController();

routes.get('/items', itemsController.index);

routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);
routes.post('/points', upload.single('image'), pointsController.create);

export default routes;