// Combines similar films and sorts out showtimes.

const moment = require('moment');

const FIFTEEN_MINS_IN_MILLIS = 15 * 60 * 1000;

/**
 * @param {Array} [filmData]
 */
module.exports = function(filmData, now) {
  let mostRecentShowtimeStart = moment(now).startOf('day');

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
      // Add showtime, provided it is more than 15 minutes after the
      // end of the last showtime (this prevents a news break from
      // erroneously creating a new showtime).
      const lastShowtime = existingFilm.showtimes[existingFilm.showtimes.length-1];
      const nextShowtime = calculateShowtime(item.showtime);
      if(!lastShowtime || !isWithin15Minutes(lastShowtime.end, nextShowtime.start)) {
        existingFilm.showtimes.push(nextShowtime);
      }
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
    const startShowtime = calculateShowtimePart(rawShowtime.start, mostRecentShowtimeStart);
    if(startShowtime) {
      const endShowtime = calculateShowtimePart(rawShowtime.end, startShowtime);
      if(endShowtime) {
        mostRecentShowtimeStart = startShowtime;
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

  /**
   *
   * @param {Date} earlier
   * @param {Date} later
   */
  function isWithin15Minutes(earlier, later) {
    return !!(earlier && later && (later.getTime() - earlier.getTime() <= FIFTEEN_MINS_IN_MILLIS));
  }
};