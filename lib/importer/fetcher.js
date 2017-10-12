const rp = require('request-promise');
const cheerio = require('cheerio');

const isProd = process.env.NODE_ENV === 'production';

const uri = isProd ?
  'https://nextfilm.co.uk' :
  'http://localhost:5000/films.html';

const options = {
  uri,
  headers: {
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    // 'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.8',
    'cache-control': 'max-age=0',
    'dnt': '1',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
  }
};

module.exports = async function() {
  const html = await rp(options);
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

    let synopsis = $el.find('.panel>table.paneltable>tbody>tr>td').first().text();

    return { title, year, synopsis, tmdbId };
  }
};