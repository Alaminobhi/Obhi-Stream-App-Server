const express = require("express");
const cheerio = require('cheerio');
const randomUseragent = require('random-useragent');

const rua = randomUseragent.getRandom();
const { default: axios } = require('axios');

router = express.Router();

router.get('/cricketcrex2', function(req, res){
   
    const match_url = "https://crex.live/scoreboard/L4A/1CO/8th-Match/T/U/pak-vs-sl-8th-match-world-cup-2023/live";

    let str = match_url || '';
    let live_url = str.replace('www', 'm');

    axios({
        method: 'GET',
        url: live_url,
        headers: {
            'User-Agent': rua
        }
    }).then(function(response) {
      // console.log(response.data);

        $ = cheerio.load(response.data);

        var title = $("h1.name-wrapper").eq(0).html();
       
        var balltoball = $("div.team-result").html();
        var team1 = $('div.team-inning').html();
        var update = $('div.team-inning.second-inning').html();

        var recentballs = $('div.overs-timeline').text();
        var commentary = $("div.br-comm.search-results.no-gutters.comm-left-section").text();
        var partnership = $("div.partner-ship-data").eq(0).text();
        var lastwicket = $("span[style='color:#333']").eq(1).text();

        var batsman = $('div.live-data').eq(0).html();
        var batsman2 = $('div.batsmen-name').eq(1).text();
        var bowler = $('div.batsmen-name').eq(2).text();
       
        var livescore = ({
            title: title || "",
            balltoball: balltoball || "",
            team1: team1 || "",
            update: update || "",

            partnership: partnership || "",
            recentballs: recentballs || "",
            lastwicket: lastwicket || "",
            commentary: commentary || "",

            batsman: batsman || "",
            batsman2: batsman2 || "",
            bowler: bowler || "",
        });

        // res.send(JSON.stringify(livescore, null, 4));
        res.send(livescore, null, 4);
        // console.log(livescore);

    }).catch(function(error) {
        if (!error.response) {
            res.json(error);
        } else {
            res.json(error);
        }
    });

  })
  module.exports = router