const express = require('express');
const cheerio = require('cheerio');
const randomUseragent = require('random-useragent');

const rua = randomUseragent.getRandom();
const { default: axios } = require('axios');
router = express.Router();


router.get('/crexs', function(req, res){
    const {item} = req.query;
    console.log(item);
    
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

        // var matchs = [];

        // console.log($.html());
        // const gg = $.html();
        // var match = $("body").html();
        // console.log(match);
        // var match2 = $("body").html();
        // console.log(match2);
        var match = $("div").html();
        // const ggg = $.body();
        // console.log(ggg);
        // // var match = $("div.match-card-container").eq(i).html();
        console.log(match);

        // var matchslist = {matchlink: gg || "", match: match || "",} 
        //     // matchs.push(matchslist);
        //     // console.log(matchs);
        //     console.log(matchslist);

        res.send(JSON.stringify(match, null, 4));
        // res.send(kkk, null, 4);
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