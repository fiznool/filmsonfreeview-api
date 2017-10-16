// Used to import the data into the system.

const fetcher = require('./importer/fetcher');
const reducer = require('./importer/reducer');
const seeder = require('./importer/seeder');

const isInitial = process.argv[2] === '--initial';

const doImport = async function() {
  try {
    const now = Date.now();

    const fetchedData = await fetcher();
    const dataToSeed = reducer(fetchedData, now);

    console.dir('About to seed:');
    console.dir(dataToSeed, { depth: null });
    await seeder(dataToSeed, isInitial);
  } catch(e) {
    console.log(e);
  }
};

doImport();