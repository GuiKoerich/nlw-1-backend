import express from 'express';

import ItemsController from './controllers/itemsController';
import PointsController from './controllers/pointsController';

const routes = express.Router();

const itemsController = new ItemsController();
const pointsController = new PointsController();

routes.get('/items', itemsController.index);

routes.get('/points', pointsController.index);
routes.get('/points/:id', pointsController.show);
routes.post('/points', pointsController.create);

export default routes;