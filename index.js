const adhan = require("adhan");
const moment = require("moment");

// Casablanca
const coordinates = new adhan.Coordinates(33.58831,-7.61138);

// Rabat
// const coordinates = new adhan.Coordinates(33.9716,-6.8498);


// Params
const params = adhan.CalculationMethod.Other();
params.fajrAngle = 19;
params.ishaAngle = 17;
params.madhab = adhan.Madhab.Shafi;

params.adjustments.sunrise=-3;
params.adjustments.dhuhr=5;
params.adjustments.maghrib=4;

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

let tempdate = new Date(2020,4,1)

for (var i = 1; i <= 32; i++) {

  const dailyResult = getPrayers(tempdate);
  monthResult[moment.utc(tempdate).format("DD_MM")] = dailyResult;
  tempdate = moment(tempdate)
    .add(1, "days")
    .toDate();
}

Object.keys(monthResult).forEach(e=>{
    console.log(e, monthResult[e].fajr,monthResult[e].sunrise,monthResult[e].dhuhr,monthResult[e].asr,monthResult[e].maghrib,monthResult[e].isha);
    // console.log(`${monthResult[e].isha} - ${monthResult[e].maghrib} - ${monthResult[e].asr} - ${monthResult[e].dhuhr} - ${monthResult[e].sunrise} - ${monthResult[e].fajr} - ${e}`)
})
// console.log(result);