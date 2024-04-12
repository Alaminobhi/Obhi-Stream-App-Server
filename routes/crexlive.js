const express = require("express");
const cheerio = require('cheerio');
const randomUseragent = require('random-useragent');

const rua = randomUseragent.getRandom();
const { default: axios } = require('axios');

router = express.Router();

router.get('/cricketcrex', function(req, res){
   console.log('ffffffffffffff', req.query.url);
    
    const match_url =  req.query.url;

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

        var title = $("h1.name-wrapper").eq(0).text();
       
        var balltoball = $("div.result-box").text();

        var logo = $('img').eq(0).prop('src');
        console.log(logo);
        var team1 = $('div.team-name.team-1').text();
        var score = $('span').eq(3).text();
        var overs = $('span').eq(4).text();

        var runrate = $('div.team-run-rate').text();
        var update = $('div.final-result.m-none').text();

        var recentballs = $('div.overs-timeline').text();
        var commentary = $("div.br-comm.search-results.no-gutters.comm-left-section").text();
        var partnership = $("div.partner-ship-data").eq(0).text();
        var lastwicket = $("span[style='color:#333']").eq(1).text();

        var batsman = $('div.batsmen-name').eq(0).text();
        // var batsmanimg = $('app-player-profile-img').eq(0).html();
        const batsmanimg = $('img').eq(2).prop('src');
        // console.log(batsmanimg);
        var batsmanrun = $('div.batsmen-score').eq(0).text();
        // var bat = $('div.batsmen-score').eq(0).html();

        // var bat2 = $("div.batsmen-score").eq(1).html();
        var batsman2img = $('img').eq(3).prop('src');
        var batsman2 = $('div.batsmen-name').eq(1).text();
        var batsmanrun2 = $('div.batsmen-score').eq(1).text();

        var bowler = $('div.batsmen-name').eq(2).text();
        var bowlerimg = $('img').eq(4).prop('src');
        var bowlerscore = $('div.batsmen-score.bowler').eq(0).text();

        var id =  $("1").text();

        var livescore = ({
            title: title || "",
            balltoball: balltoball || "",

            logo: logo || "",
            team1: team1 || "",
            score: score || "",
            overs: overs || "",
            runrate: runrate || "",
            update: update || "",

            partnership: partnership || "",
            recentballs: recentballs || "",
            lastwicket: lastwicket || "",
            commentary: commentary || "",

            batsman: batsman || "",
            batsmanimg: batsmanimg || "",
            batsmanrun: batsmanrun || "",
            // bat: bat || "",

            batsman2: batsman2 || "",
            batsman2img: batsman2img || "",
            batsmanrun2: batsmanrun2 || "",
            // bat2: bat2 || "",

            bowler: bowler || "",
            bowlerimg: bowlerimg || "",
            bowlerscore: bowlerscore || "",

            id: id || "1"
        });

        res.send(JSON.stringify(livescore, null, 4));
        // res.send(livescore, null, 4);
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