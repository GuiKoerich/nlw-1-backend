import { Request, Response, response } from 'express';
import knex from '../database/connection';


class PointsController {
  
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parseItems = String(items).split(',').map(item => Number(item.trim()));

    const points = await knex('points')
      .join('points_items', 'points_items.points_id', '=', 'points.id')
      .whereIn('points_items,item_id', parseItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    return response.status(200).json(points);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if(!point) {
      return response.status(400).json({ message: 'Point not found! '});
    }

    const items = await knex('items')
      .join('points_items', 'points_items.item_id', '=', 'items.id')
      .where('points_items.point_id', point.id)
      .select('items.title');

    return response.status(200).json({ point, items });
  }

  async create(request: Request, response: Response) {
    const { name, email, phone, lat, lon, city, uf, items } = request.body;

    const trx = await knex.transaction();

    const point = { name, email, phone, lat, lon, city, uf, image: 'image-fake' };

    const insertedIds = await trx('points').insert(point);
    const point_id = insertedIds[0]

    const pointItems = items.map((item_id: number) => {
      return { item_id, point_id }
    });

    await trx('points_items').insert(pointItems);

    await trx.commit();

    response.json({ id: point_id, ...point });
  }
}

export default PointsController;