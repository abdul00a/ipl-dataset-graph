// helper function for extraRunOfBattingTeam and economicalBowler function to filter the matchObject json file.
function filterDeliveries(matches, deliveries, seasonyear) {
  const matchfilter = matches.filter(
    matchSeason => matchSeason.season === seasonyear
  );
  const initalID = matchfilter[0].id;
  const endID = matchfilter[matchfilter.length - 1].id;
  // return [startId, LastId];
  const filterDeliverie = deliveries.filter(
    filteredMatchDeliverie =>
      +filteredMatchDeliverie.match_id >= initalID &&
      +filteredMatchDeliverie.match_id <= endID
  );
  return filterDeliverie;
}

// return a JSON object for number of match played per year.
function numberOfMatchesInEveryYear(matches) {
  const numberOfMatchPlayedPerYear = matches.reduce(
    (matchPerYear, matchObj) => {
      matchPerYear[matchObj.season] = (matchPerYear[matchObj.season] || 0) + 1;
      return matchPerYear;
    },
    {}
  );
  return numberOfMatchPlayedPerYear;
}

// return a JSON object for number of matches won per year per team.
function matchWonPerYearPerTeam(matches) {
  const numberMatchWonPerYearPerTeam = matches.reduce(
    (matchPerYear, matchObj) => {
      if (!matchPerYear[matchObj.season]) {
        matchPerYear[matchObj.season] = {};
      }
      if (matchObj.result !== 'no result') {
        matchPerYear[matchObj.season][matchObj.winner] =
          (matchPerYear[matchObj.season][matchObj.winner] || 0) + 1;
      } else {
        matchPerYear[matchObj.season]['No Result'] =
          (matchPerYear[matchObj.season]['No Result'] || 0) + 1;
      }
      return matchPerYear;
    },
    {}
  );

  return numberMatchWonPerYearPerTeam;
}

// return a JSON object for extra run of bolwing team.
function extraRunOfBolwingTeam(matches, deliveries, seasonyear) {
  const extraRunOfBattingTeam = filterDeliveries(
    matches,
    deliveries,
    seasonyear
  ).reduce((bowlingTeam, delviereObj) => {
    if (bowlingTeam[delviereObj.bowling_team]) {
      bowlingTeam[delviereObj.bowling_team] += +delviereObj.extra_runs;
    } else {
      bowlingTeam[delviereObj.bowling_team] = +delviereObj.extra_runs;
    }
    return bowlingTeam;
  }, {});
  return extraRunOfBattingTeam;
}

// return a JSON object for top 10 economical bolwer.
function economicalBowler(matches, deliveries, seasonyear, noOfBolwer) {
  const bolwerData = filterDeliveries(matches, deliveries, seasonyear).reduce(
    (runsAndBalls, delviereObj) => {
      if (!runsAndBalls[delviereObj.bowler]) {
        runsAndBalls[delviereObj.bowler] = {};
      }
      if (!runsAndBalls[delviereObj.bowler]['Total Runs']) {
        runsAndBalls[delviereObj.bowler][
          'Total Runs'
        ] = +delviereObj.total_runs;
        runsAndBalls[delviereObj.bowler]['Total Balls'] = 1;
      } else {
        runsAndBalls[delviereObj.bowler][
          'Total Runs'
        ] += +delviereObj.total_runs;
        if (delviereObj.ball < 7) {
          runsAndBalls[delviereObj.bowler]['Total Balls'] += 1;
        }
      }
      return runsAndBalls;
    },
    {}
  );

  const top10bowler = Object.entries(bolwerData)
    .map(bolwerEconomy => {
      if (bolwerEconomy[1]['Total Balls'] >= 30) {
        const economyRate = +(
          bolwerEconomy[1]['Total Runs'] /
          (bolwerEconomy[1]['Total Balls'] / 6)
        ).toFixed(2);
        bolwerEconomy = [bolwerEconomy[0], economyRate];
      }
      return bolwerEconomy;
    })
    .filter(ele => typeof ele[1] === 'number')
    .sort((a, b) => a[1] - b[1])
    .filter((top10, i) => i < noOfBolwer)
    .reduce((bolwerObj, bolwerEconomy) => {
      const [bowler, economy] = bolwerEconomy;
      bolwerObj[bowler] = economy;
      return bolwerObj;
    }, {});

  return top10bowler;
}

// export the all four main calling function.
module.exports = {
  numberOfMatchesInEveryYear,
  matchWonPerYearPerTeam,
  extraRunOfBolwingTeam,
  economicalBowler
};
