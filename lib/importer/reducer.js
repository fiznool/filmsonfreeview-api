// Combines similar films and sorts out showtimes.

/**
 * @param {Array} [filmData]
 */
module.exports = function(filmData) {
  const filmDataMap = filmData.reduce(reducer, new Map());
  return Array.from(filmDataMap.values());

  /**
   * @param {Map} [map]
   */
  function reducer(map, item) {
    const key = `${item.title} (${item.year})`;
    const existingFilm = map.get(key);
    if(existingFilm) {
      // Film already exists.
      // Add showtime.
      existingFilm.showtimes.push(item.showtime);
    } else {
      // New film.
      const film = {
        ...item,
        showtimes: [ item.showtime ]
      };
      delete film.showtime;
      map.set(key, film);
    }

    return map;
  }
};