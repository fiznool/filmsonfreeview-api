const rp = require('request-promise');
const cheerio = require('cheerio');

const isProd = process.env.NODE_ENV === 'production';

const uris = isProd ?
  [
    'https://nextfilm.co.uk',
    'https://nextfilm.co.uk/?id=1',
    'https://nextfilm.co.uk/?id=2'
  ] :
  [
    'http://localhost:5000/films.html'
  ];



module.exports = async function() {
  let filmData = [];
  for (let uri of uris) {
    const nextFilmData = await fetcher(uri);
    filmData.push(...nextFilmData);
  }
  return filmData;
};

async function fetcher(uri) {
  const html = await rp({
    uri,
    headers: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      // 'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.8',
      'cache-control': 'max-age=0',
      'dnt': '1',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
    }
  });
  const $ = cheerio.load(html);

  return $('.listentry')
    .map(reducer)
    .get();

  function reducer() {
    const $el = $(this);

    let tmdbId = null;
    const tmdbImageSrc = $el.find('>.posterbox>a').attr('href');
    if(tmdbImageSrc && tmdbImageSrc.startsWith('https://image.tmdb.org') && tmdbImageSrc.endsWith('.jpg')) {
      const parts = tmdbImageSrc.split('/');
      if(parts) {
        tmdbId = parts[parts.length-1].replace('.jpg', '');
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

    const synopsis = $el.find('.panel>table.paneltable>tbody>tr>td').first().text();

    let showtime = $el.find('.timen').text();
    if(!showtime) {
      showtime = $el.find('.time').text();
    }

    if(showtime) {
      const parts = showtime.split('-');
      if(parts.length === 2) {
        showtime = {
          start: parts[0].trim(),
          end: parts[1].trim(),
        };
      } else {
        showtime = null;
      }
    }

    const channel = $el.find('.chanbox>img').attr('title');

    return { title, year, synopsis, showtime, channel, tmdbId };
  }
}