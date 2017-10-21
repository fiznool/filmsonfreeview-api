// Used to import the data into the system.

const fetcher = require('./importer/fetcher');
const reducer = require('./importer/reducer');
const seeder = require('./importer/seeder');

const isInitial = process.argv[2] === '--initial';

const doImport = async function() {
  try {
    console.log('Fetching data, please wait...');
    const fetchedData = await fetcher();
    const dataToSeed = reducer(fetchedData);

    console.log(`Importing ${dataToSeed.length} records`);
    await seeder(dataToSeed, isInitial);
  } catch(e) {
    console.log('There was an error:', e);
  }
};

doImport();