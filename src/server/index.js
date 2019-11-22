// import files
const fileStream = require('fs');
const csvJson = require('convert-csv-to-json');
const {
  numberOfMatchesInEveryYear,
  matchWonPerYearPerTeam,
  extraRunOfBolwingTeam,
  economicalBowler
} = require('./iplData');

// A function that return conversion of csv file into JSON object.
function csvtojson(csvFile) {
  return csvJson.fieldDelimiter(',').getJsonFromCsv(csvFile);
}

// variable of JSON Array.
const matches = csvtojson('../data/matches.csv');
const deliveries = csvtojson('../data/deliveries.csv');

// function to create output in JSON format.
function createJSONobject(outputObject, FileName) {
  const stringfy = JSON.stringify(outputObject);
  fileStream.writeFileSync(`../output/${FileName}.json`, stringfy);
}

// variable to store output of all four function.
const matchPlayedPerYear = numberOfMatchesInEveryYear(matches);
const matchWonPerTeam = matchWonPerYearPerTeam(matches);
const extraRuns = extraRunOfBolwingTeam(matches, deliveries, '2016');
const economicalBolwer = economicalBowler(matches, deliveries, '2015', 10);

// call the createJSONobject function to create JSON format object.
createJSONobject(matchPlayedPerYear, 'matchPlayedPerYear');
createJSONobject(matchWonPerTeam, 'wonPerTeamPerYear');
createJSONobject(extraRuns, 'extraRuns');
createJSONobject(economicalBolwer, 'economicalBolwer');

console.log(matchPlayedPerYear);
console.log(matchWonPerTeam);
console.log(extraRuns);
console.log(economicalBolwer);
