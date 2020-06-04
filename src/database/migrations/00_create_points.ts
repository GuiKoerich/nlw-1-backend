import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('points', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('phone').notNullable();
    table.decimal('lat').notNullable();
    table.decimal('lon').notNullable();
    table.string('city').notNullable();
    table.string('uf', 2).notNullable();
    table.string('image').notNullable();
  });
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('points');
}