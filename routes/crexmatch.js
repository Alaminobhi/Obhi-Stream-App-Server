const express = require("express");
const cheerio = require('cheerio');
const randomUseragent = require('random-useragent');

const rua = randomUseragent.getRandom();
const { default: axios } = require('axios');

router = express.Router();

router.get('/crexmatch', function(req, res){
   console.log('ffffffffffffff', req.query.url);
    
    const match_url =  'https://crex.live/series/1CO/world-cup-2023/matches';

    let str = match_url || '';
    let live_url = str.replace('www', 'm');

    axios({
        method: 'GET',
        url: live_url,
        headers: {
            'User-Agent': rua
        }
    }).then(function(response) {
    //   console.log(response.data);

        $ = cheerio.load(response.data);

        var matchs = [];
        var c = 1;

        for (let i = 0; i < 50; i++) {
            // some code
            var c = i;
            var title2 = $("h3.match-info").eq(c).text();
            title2? c = 5 : c=0;
            if(c===0){
                break;
            }
            var match = $("div.match-card-container").eq(i).html();
             m = cheerio.load(match);
            var href = $('a.match-card-wrapper').eq(i).attr('href');
            var title = $("h3.match-info").eq(i).text();
            var logo = m('img').eq(0).prop('src');
            var logo2 = m('img').eq(1).prop('src');
            var team1 = m('span.team-name').eq(0).text();
            var team2 = m('span.team-name').eq(1).text();
            
            var score = m('span.team-score').eq(0).text();
            var score2 = m('span.team-score').eq(1).text();
            var overs = m('span.total-overs').eq(0).text();
            var overs2 = m('span.total-overs').eq(1).text();

            var stutas = m('div.result span').eq(0).text();
            var update = m('div.result span').eq(1).text();
            var stutas1 = m('div.time').eq(0).text();
            var update1 = m('div.start-text').eq(0).text();
            var id = i;
            // console.log("hhhhhhhhh", match);
            // console.log(logo,team1,score,overs, team2,score2,overs2,logo2);

            var matchslist = {matchlink: href || "", title: title || "", logo: logo || "",
            team1: team1 || "", score: score || "", overs: overs || "", team2: team2 || "", score2: score2 || "",
            overs2: overs2 || "", logo2: logo2 || "", stutas: stutas || stutas1, update: update || update1, id: id,
        } 
            matchs.push(matchslist);
            // console.log(matchs);
           
            
          }

        res.send(JSON.stringify(matchs, null, 4));
        // res.send(matchs, null, 4);
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