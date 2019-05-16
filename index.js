const adhan = require("adhan");
const moment = require("moment");

let date = new Date();
date = moment(date)
  .subtract(9, "days")
  .toDate();

// Casablanca
// const coordinates = new adhan.Coordinates(33.589886, -7.603869);

// Rabat 
const coordinates = new adhan.Coordinates(34.01325,-6.83255);


// Params
const params = adhan.CalculationMethod.Other();
params.fajrAngle = 19;
params.ishaAngle = 19;

getPrayers = date => {
  const prayerTimes = new adhan.PrayerTimes(coordinates, date, params);
  const result = {};
  Object.keys(prayerTimes).forEach(e => {
    if (typeof prayerTimes[e] != "function")
      result[e] = moment.utc(prayerTimes[e]).format("HH:mm");
  });
  return result;
};

const monthResult = [];

// Go back to the first day of ramadan
let tempdate = moment()
  .subtract(8, "days")
  .toDate();

for (var i = 1; i <= 29; i++) {

  const dailyResult = getPrayers(tempdate);
  monthResult[moment.utc(tempdate).format("DD_MM")] = dailyResult;
  tempdate = moment(tempdate)
    .add(1, "days")
    .toDate();
}

Object.keys(monthResult).forEach(e=>{
    // console.log(monthResult[e].sunrise);
    console.log(`${monthResult[e].isha} - ${monthResult[e].maghrib} - ${monthResult[e].asr} - ${monthResult[e].dhuhr} - ${monthResult[e].sunrise} - ${monthResult[e].fajr} - ${e}`)
})
// console.log(result);