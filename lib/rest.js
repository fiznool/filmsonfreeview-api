const express = require('express');
const { Pool } = require('pg');

module.exports = function(dbUrl, routePrefix) {
  const queries = Queries(new Pool({
    connectionString: dbUrl
  }));

  const router = express.Router();
  router.get(`${routePrefix}/films`, queries.getAllFilms);
  return router;
};

function Queries(pool) {
  return {
    getAllFilms
  };

  async function getAllFilms(req, res) {
    const showtimesBuildObject = `
        json_build_object(
          'startsAtDate', s.starts_at_date,
          'startsAtTime', s.starts_at_time,
          'endssAtDate', s.ends_at_date,
          'endsAtTime', s.ends_at_time,
          'channel', s.channel
        )
    `;
    const filmsQuery = `
      select f.id, f.name, f.year, f.synopsis, f.imdb_url as "imdbUrl", f.tmdb_image_id as "tmdbImageId", f.tmdb_rating as "tmdbRating", json_agg(${showtimesBuildObject}) as showtimes
      from filmsonfreeview.film f
        left join filmsonfreeview.showtime s on s.film_id = f.id
      group by f.id
      order by f.id
    `;

    try {
      const queryResponse = await pool.query(filmsQuery);
      res.json(queryResponse.rows);
    } catch(e) {
      res.status(500).json({msg: e.message});
    }
  }
}