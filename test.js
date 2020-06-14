const gen = require('./gen');
// const [name, id] = process.argv.slice(2);

const tests = [
  {
    id: 5,
    name: 'Berkane',
  },
  {
    id: 104,
    name: 'Boujdour',
  },
  {
    id: 23,
    name: 'Errachidia',
  },
  {
    id: 11,
    name: 'Guersif',
  },
  {
    id: 35,
    name: 'Ifrane',
  },
  {
    id: 45,
    name: 'Khenifra',
  },
];

tests.forEach(async (city) => await gen(city.name, city.id));
