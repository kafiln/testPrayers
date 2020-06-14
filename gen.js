const moment = require('moment');
const util = require('util');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);
const axios = require('axios');

const KEY = 'f37b8544cd4e4b23b27f63f9da515c15';

const gps = (name) =>
  `https://api.opencagedata.com/geocode/v1/json?key=${KEY}&q=${name},Morocco`;

const prayers = (id) => `https://maroc-salat.herokuapp.com/prayer?cityId=${id}`;

const getRawData = async (id) => {
  const response = await axios.get(prayers(id));
  return response.data;
};

const getLocalisation = async (name) => {
  const response = await axios.get(gps(name));
  console.log(response.data.results[0].geometry);

  return [
    response.data.results[0].geometry.lat,
    response.data.results[0].geometry.lng,
  ];
};

const toTimeFormat = (data) => moment(data).format('h:mm A');

const transformData = (raw) => {
  return raw.map((result) => ({
    date: moment(result.day).format('YYYY-MM-DD'),
    fajr: toTimeFormat(result.fajr),
    sunrise: toTimeFormat(result.chorouq),
    dhuhr: toTimeFormat(result.dhuhr),
    asr: toTimeFormat(result.asr),
    maghrib: toTimeFormat(result.maghrib),
    isha: toTimeFormat(result.ishae),
  }));
};

const toTestFormat = (latitude, longitude, times, variance = 2) => ({
  params: {
    latitude,
    longitude,
    timezone: 'Africa/Casablanca',
    method: 'Morocco',
  },
  source: ['http://www.habous.gov.ma/fr/horaire-priere.html'],
  variance,
  times,
});

const toFile = async (name, data) => {
  const filename = `tests/${name}-Morocco.json`;
  fs.writeFileSync(filename, JSON.stringify(data));
  const { stdout, stderr } = await exec(`npx prettier --write ${filename}`);
  console.log(stdout);
};

const main = async (name, id, variance = 2) => {
  const start = Date.now();
  const dir = './tests';
  if (!fs.existsSync(dir)) {
    console.log('Creating folder ', dir);
    fs.mkdirSync(dir);
  }
  console.log('Starting the generation at ', toTimeFormat(start));
  console.log('Getting the localisation for', name);
  const [latitude, longitude] = await getLocalisation(name);
  const data = await getRawData(id);
  const mapped = transformData(data);
  const testData = toTestFormat(latitude, longitude, mapped, variance);
  await toFile(name, testData);
  const time = (Date.now() - start) / 1000;
  console.log(`done in ${time} seconds`);
};

module.exports = main;
