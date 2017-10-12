const fs = require('fs');
const path = require('path');
const { Client } = require('pg');



module.exports = async function(data, initial = false) {
  if(!data || data.length === 0) {
    throw new Error('No data returned from remote source!');
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });
  await client.connect();

  try {
    await client.query('begin');

    if(initial) {
      await client.query('drop schema if exists filmsonfreeview cascade');
      await client.query('create schema filmsonfreeview');
      await generateTables(client);
      await insertData(client, data);

    } else {
      await generateTables(client, '_new');
      await insertData(client, data, '_new');
      await swapTables(client);
    }

    await client.query('commit;');

  } catch(e) {
    client.query('rollback;');
    throw e;
  } finally {
    client.end();
  }
};

async function generateTables(client, tableSuffix = '') {
  let schemaSql = fs.readFileSync(path.resolve(__dirname, '../../db/schema.sql'), 'utf8');

  ['film', 'channel', 'showtime'].forEach(tableName => {
    const re = new RegExp(`\\$\\{${tableName}_table_name\\}`, 'g');
    schemaSql = schemaSql.replace(re, `${tableName}${tableSuffix}`);
  });

  return client.query(schemaSql);
}

async function insertData(client, data, tableSuffix = '') {
  const sql = `insert into filmsonfreeview.film${tableSuffix}(name, year, synopsis, tmdb_id) values($1, $2, $3, $4)`;
  for(let item of data) {
    await client.query(sql, [
      item.title,
      item.year,
      item.synopsis,
      item.tmdbId
    ]);
  }
}

async function swapTables(client) {
  for(let tableName of ['showtime', 'channel', 'film']) {
    await client.query(`alter table filmsonfreeview.${tableName} rename to ${tableName}_old`);
    await client.query(`alter table filmsonfreeview.${tableName}_new rename to ${tableName}`);
    await client.query(`drop table filmsonfreeview.${tableName}_old`);
  }
}