// Used to import the data into the system.

const fetcher = require('./importer/fetcher');
const seeder = require('./importer/seeder');

const isInitial = process.argv[2] === '--initial';

const doImport = async function() {
  const newData = await fetcher();
  await seeder(newData, isInitial);
};

doImport();