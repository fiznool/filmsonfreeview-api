// Combines similar films and sorts out showtimes.

const moment = require('moment');

/**
 * @param {Array} [filmData]
 */
module.exports = function(filmData, now) {
  let lastShowtime = moment(now).startOf('day');

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
      existingFilm.showtimes.push(calculateShowtime(item.showtime));
    } else {
      // New film.
      const film = {
        ...item,
        showtimes: [ calculateShowtime(item.showtime) ]
      };
      delete film.showtime;
      map.set(key, film);
    }

    return map;
  }

  function calculateShowtime(rawShowtime) {
    /**
     * - get previous start time
     * - use to set new start time
     * - if new is before previous, add one to date
     */
    const startShowtime = calculateShowtimePart(rawShowtime.start, lastShowtime);
    if(startShowtime) {
      const endShowtime = calculateShowtimePart(rawShowtime.end, startShowtime);
      if(endShowtime) {
        lastShowtime = startShowtime;
        return {
          start: startShowtime.toDate(),
          end: endShowtime.toDate(),
          channel: rawShowtime.channel
        };
      }
    }

  }
  /**
   *
   * @param {string} showtimeStr
   * @param {moment} prevShowtime
   * @returns {moment}
   */
  function calculateShowtimePart(showtimeStr, prevShowtime) {
    const showtimeParts = /^(\d{2}):(\d{2})$/.exec(showtimeStr);
    if(showtimeParts) {
      const showtime = prevShowtime
        .clone()
        .set({
          hour: +showtimeParts[1],
          minute: +showtimeParts[2]
        });
      if(showtime.isBefore(prevShowtime)) {
        showtime.add(1, 'days');
      }
      return showtime;
    }
  }
};