function winnerTeams(winnerObj) {
  const DublicateAllTeams = Object.values(winnerObj).reduce(
    (teams, winnerTeamObj) => {
      teams.push(...Object.keys(winnerTeamObj));
      return teams;
    },
    []
  );
  const allTeams = [...new Set(DublicateAllTeams)];
  const teamsWinningData = Object.values(winnerObj).reduce((teams, teamObj) => {
    allTeams.map(teamName => {
      if (!teams.hasOwnProperty(teamName)) {
        teams[teamName] = [];
      }
      if (teamObj.hasOwnProperty(teamName)) {
        teams[teamName].push(teamObj[teamName]);
      } else {
        teams[teamName].push(0);
      }
      return 0;
    });
    return teams;
  }, {});
  return Object.entries(teamsWinningData);
}

function baiscHighcharts(
  requestPath,
  containerId,
  title,
  subtitle,
  yAxisText,
  tooltip
) {
  fetch(requestPath)
    .then(response => response.json())
    .then(resolve => {
      Highcharts.chart(containerId, {
        chart: {
          type: 'column'
        },
        title: {
          text: title
        },
        subtitle: {
          text: subtitle
        },
        xAxis: {
          type: 'category',
          labels: {
            style: {
              fontSize: '15px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: yAxisText
          }
        },
        legend: {
          enabled: false
        },
        tooltip: {
          pointFormat: tooltip
        },
        series: [
          {
            name: '',
            data: Object.entries(resolve),
            dataLabels: {
              enabled: true,
              rotation: -90,
              color: '#20262E',
              align: 'right',
              format: '{point.y}',
              y: 20,
              style: {
                fontSize: '17px',
                fontFamily: 'Verdana, sans-serif'
              }
            }
          }
        ]
      });
    });
}

function stackCharts(requestPath, containerId, title, subtitle, yAxisText) {
  fetch(requestPath)
    .then(response => response.json())
    .then(resolve => {
      Highcharts.chart(containerId, {
        chart: {
          type: 'column'
        },
        title: {
          text: title
        },
        subtitle: {
          text: subtitle
        },
        xAxis: {
          categories: Object.keys(resolve)
        },
        yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
            text: yAxisText
          }
        },
        tooltip: {
          formatter: function() {
            return `${`<b>${this.x}</b><br/>${this.series.name}: ${this.y}<br/>` +
              'Total: '}${this.point.stackTotal}`;
          }
        },
        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },
        series: winnerTeams(resolve).reduce((team, winningData) => {
          team.push({
            name: winningData[0],
            data: winningData[1]
          });
          return team;
        }, [])
      });
    });
}

function main() {
  baiscHighcharts(
    '../output/matchPlayedPerYear.json',
    'container1',
    'Number of Matches Played Per Team Per Year',
    'Season 2008 - 2017',
    'No. of Matches played',
    'matched played: <b>{point.y}</b>'
  );

  stackCharts(
    '../output/wonPerTeamPerYear.json',
    'container4',
    'Number of Matches won by per team per year',
    'Season 2008 - 2017',
    'Total Number of Wins'
  );

  baiscHighcharts(
    '../output/extraRuns.json',
    'container2',
    'Extra Runs given by Bowling team',
    'Season 2016.',
    'Extra Runs',
    'Extra Runs: <b>{point.y}</b>'
  );

  baiscHighcharts(
    '../output/economicalBolwer.json',
    'container3',
    'Top 10 Economical Bowler.',
    'Season 2015.',
    'Economy Rate',
    'Economy: <b>{point.y}</b>'
  );
}
