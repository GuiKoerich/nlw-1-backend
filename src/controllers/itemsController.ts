import { Request, Response } from 'express';
import knex from '../database/connection';

import { host } from '../constants'

class ItemsController {
  async index(request: Request, response: Response) {
    const items = await knex('items').select('*');

    const serializedItems = items.map(item => {
      return { 
        id: item.id, 
        title: item.title, 
        imageUrl: `${host}/uploads/${item.image}`, 
      }
    });

    return response.json(serializedItems);
  }
}

export default ItemsController;