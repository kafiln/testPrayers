const gen = require('./gen');
const cities = require('./cities.json');

cities
  .map((c) => ({
    id: c.id,
    name: c.slug,
  }))
  .forEach(async (city) => await gen(city.name, city.id));
