// return a JSON object for number of match played per year.
async function NoOfmatchPlayPerYear(dataTable) {
  const queryArray = await dataTable.query(
    'select season , count(*) from matchTable group by season'
  );
  const NoOfmatchesPlayPerYear = queryArray.rows.reduce(
    (matchesPlayed, seasonData) => {
      matchesPlayed[seasonData.season] = +seasonData.count;
      return matchesPlayed;
    },
    {}
  );
  return NoOfmatchesPlayPerYear;
}

// return a JSON object for number of matches won per year per team.
async function matchesWonPerTeamPerYear(dataTable) {
  const queryArray = await dataTable.query(
    'select season, winner, count(*) from matchTable group by season , winner order by season'
  );
  const matchesWonPerTeam = queryArray.rows.reduce((matchesWon, WinnerObj) => {
    if (!matchesWon[WinnerObj.season]) {
      matchesWon[WinnerObj.season] = {};
    }
    if (WinnerObj.winner != null) {
      matchesWon[WinnerObj.season][WinnerObj.winner] = +WinnerObj.count;
    }
    return matchesWon;
  }, {});
  return matchesWonPerTeam;
}

// return a JSON object for extra run of bolwing team.
async function extraRunsOfBowlingTeam(dataTable) {
  const queryArray = await dataTable.query(
    'select deliverie.bowling_team as team, sum(deliverie.extra_runs) as extra_runs from deliverie full join matchTable on deliverie.match_id = matchTable.id where matchTable.season = 2016 group by team'
  );
  const extraRuns = queryArray.rows.reduce((extraRunsObj, teamData) => {
    extraRunsObj[teamData.team] = +teamData.extra_runs;
    return extraRunsObj;
  }, {});

  return extraRuns;
}

// return a JSON object for top 10 economical bolwer.
async function economyBowler(dataTable) {
  const queryArray = await dataTable.query(
    'select deliverie.bowler as bowler, trunc(sum(deliverie.total_runs)*6.0/count(deliverie.over),2) as economy from deliverie full join matchTable on deliverie.match_id = matchTable.id where matchTable.season = 2015 group by bowler order by economy limit 10'
  );
  const economyBowlerObj = queryArray.rows.reduce(
    (bolwerEconomy, economyData) => {
      bolwerEconomy[economyData.bowler] = +economyData.economy;
      return bolwerEconomy;
    },
    {}
  );

  return economyBowlerObj;
}

// export the all four main calling function.
module.exports = {
  NoOfmatchPlayPerYear,
  matchesWonPerTeamPerYear,
  extraRunsOfBowlingTeam,
  economyBowler
};
