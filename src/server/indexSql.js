const { Client } = require('pg');
const fileStream = require('fs');
const {
  NoOfmatchPlayPerYear,
  matchesWonPerTeamPerYear,
  extraRunsOfBowlingTeam,
  economyBowler
} = require('./ipl_dataSQL');

// Establishing a conncetion with database
const client = new Client({
  user: 'postgres',
  password: 'test123',
  host: 'localhost',
  port: 5432,
  database: 'ipl'
});

// creating a table in database and copy csv data into table
async function creatingTable(tblName, constraints, path) {
  try {
    await client.query(`DROP TABLE IF EXISTS ${tblName} CASCADE`);
    await client.query(`CREATE TABLE ${tblName}(${constraints})`);
    await client.query(
      `COPY ${tblName} FROM '${path}' DELIMITER ',' CSV HEADER`
    );
  } catch (error) {
    console.log(error);
  }
}

// create and store a json object into a sql_output folder;
function createJSONobject(FileName, outputObject) {
  const stringfy = JSON.stringify(outputObject);
  fileStream.writeFileSync(`../sql_output/${FileName}.json`, stringfy);
}

async function mainFunc() {
  await client.connect();
  await creatingTable(
    'matchTable',
    'id INT,season INT,city VARCHAR(30),date DATE,team1 VARCHAR(30),team2 VARCHAR(30),toss_winner VARCHAR(30),toss_decision VARCHAR(10),result VARCHAR(10),dl_applied INT,winner VARCHAR(30),win_by_runs INT,win_by_wickets INT,player_of_match VARCHAR(30),venue VARCHAR(100),umpire1 VARCHAR(30),umpire2 VARCHAR(30),umpire3 VARCHAR(30)',
    '/home/abdul/Desktop/projects/ipl/src/data/matches.csv'
  );
  await creatingTable(
    'deliverie',
    'match_id INT,inning INT,batting_team VARCHAR(30),bowling_team VARCHAR(30),over INT,ball INT,batsman VARCHAR(30),non_striker VARCHAR(30),bowler VARCHAR(30),is_super_over INT,wide_runs INT,bye_runs INT,legbye_runs INT,noball_runs INT,penalty_runs INT,batsman_runs INT,extra_runs INT,total_runs INT,player_dismissed VARCHAR(30),dismissal_kind VARCHAR(30),fielder VARCHAR(30)',
    '/home/abdul/Desktop/projects/ipl/src/data/deliveries.csv'
  );
  createJSONobject('matchPlayedPerYear', await NoOfmatchPlayPerYear(client));
  createJSONobject(
    'matchesWonPerTeamPerYear',
    await matchesWonPerTeamPerYear(client)
  );
  createJSONobject(
    'extraRunsOfBowlingTeam',
    await extraRunsOfBowlingTeam(client)
  );
  createJSONobject('economyBowler', await economyBowler(client));
  await client.end();
}

mainFunc();
