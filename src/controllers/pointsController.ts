import { Request, Response, response } from 'express';
import knex from '../database/connection';

import { host } from '../constants';

class PointsController {
  
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parseItems = String(items).split(',').map(item => Number(item.trim()));

    const points = await knex('points')
      .join('points_items', 'points_items.point_id', '=', 'points.id')
      .whereIn('points_items.item_id', parseItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    const serializedPoints = points.map(point => {
      return { 
        ...point, 
        imageUrl: `${host}/uploads/${point.image}`, 
      }
    });

    return response.status(200).json(serializedPoints);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if(!point) {
      return response.status(400).json({ message: 'Point not found! '});
    }

    const serializedPoint = {
        ...point, 
        imageUrl: `${host}/uploads/${point.image}`, 
    };

    const items = await knex('items')
      .join('points_items', 'points_items.item_id', '=', 'items.id')
      .where('points_items.point_id', point.id)
      .select('items.title');

    return response.status(200).json({ point: serializedPoint, items });
  }

  async create(request: Request, response: Response) {
    const { name, email, phone, lat, lon, city, uf, items } = request.body;

    const trx = await knex.transaction();

    const point = { name, email, phone: `+55${phone}`, lat, lon, city, uf, image: request.file.filename };

    const insertedIds = await trx('points').insert(point);
    const point_id = insertedIds[0]

    const pointItems = items.split(',')
      .map((item: string) => Number(item.trim()))
      .map((item_id: number) => {
      return { item_id, point_id }
    });

    await trx('points_items').insert(pointItems);

    await trx.commit();

    response.json({ id: point_id, ...point });
  }
}

export default PointsController;