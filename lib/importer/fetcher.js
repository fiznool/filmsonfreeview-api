const rp = require('request-promise');
const cheerio = require('cheerio');
const moment = require('moment');

const uris = process.env.DATA_SOURCE === 'nextfilm' ?
  [
    'https://nextfilm.co.uk',
    'https://nextfilm.co.uk/?id=1',
    'https://nextfilm.co.uk/?id=2'
  ] :
  [
    'http://localhost:5000/films-1.html',
    'http://localhost:5000/films-2.html',
    'http://localhost:5000/films-3.html',
  ];



module.exports = async function() {
  let filmData = [];
  let filmDate = moment().startOf('day');

  for (let uri of uris) {
    filmData = [
      ...filmData,
      {
        date: filmDate,
        films: await fetcher(uri)
      }
    ];
    filmDate = filmDate.clone().add(1, 'day');
  }
  return filmData;
};

async function fetcher(uri) {
  const html = await rp({
    uri,
    headers: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'accept-language': 'en-GB,en-US;q=0.8,en;q=0.6',
      'cache-control': 'max-age=0',
      'dnt': '1',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
    },
    gzip: true
  });
  const $ = cheerio.load(html);

  return $('.listentry')
    .map(reducer)
    .get();

  function reducer() {
    const $el = $(this);

    const imdbUrl = $el.find('>.imdb>a[href*="imdb.com"]').attr('href') || '';

    let tmdbImageId = null;
    const tmdbImageSrc = $el.find('>.posterbox>a').attr('href');
    if(tmdbImageSrc && tmdbImageSrc.startsWith('https://image.tmdb.org') && tmdbImageSrc.endsWith('.jpg')) {
      const parts = tmdbImageSrc.split('/');
      if(parts) {
        tmdbImageId = parts[parts.length-1].replace('.jpg', '');
      }
    }

    const title = $el.find('span.title>a.title').text();

    let year = $el.find('>i').text();
    if(year) {
      year = /^\((\d{4})\)$/.exec(year);
      if(year) {
        year = year[1];
      }
    }

    const synopsis = $el.find('.panel>table.paneltable>tbody>tr>td').first().text().trim();

    let startTime = null;
    let endTime = null;
    let channel = null;

    let showtime = $el.find('.timen').text();
    if(!showtime) {
      showtime = $el.find('.time').text();
    }

    if(showtime) {
      const parts = showtime.split('-');
      if(parts.length === 2) {
        startTime = parts[0].trim();
        endTime = parts[1].trim();
        channel = $el.find('.chanbox>img').attr('title') || null;
      }
    }

    let tmdbRating = null;
    const $imageEl = $el.find('.title ~ img');
    const tmdbRatingStr = $imageEl.attr('alt');
    const tmdbRatingResult = /^(\d)\.(\d)\/10 Stars$/.exec(tmdbRatingStr);
    if(tmdbRatingResult) {
      tmdbRating = +(tmdbRatingResult[1] + tmdbRatingResult[2]);
    }

    return { title, year, synopsis, startTime, endTime, channel, imdbUrl, tmdbImageId, tmdbRating };
  }
}