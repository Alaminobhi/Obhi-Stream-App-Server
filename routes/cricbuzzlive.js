const express = require("express");
const cheerio = require('cheerio');
const randomUseragent = require('random-useragent');

const rua = randomUseragent.getRandom();
const { default: axios } = require('axios');

router = express.Router();

router.get('/cricketlive', function(req, res){
   
    const match_url = "https://m.cricbuzz.com/cricket-commentary/75434/rsa-vs-sl-4th-match-icc-cricket-world-cup-2023";

    let str = match_url || '';
    let live_url = str.replace('www', 'm');

    axios({
        method: 'GET',
        url: live_url,
        headers: {
            'User-Agent': rua
        }
    }).then(function(response) {

        $ = cheerio.load(response.data);

        var title = $("h4.ui-header").text();
        var update = $("div.cbz-ui-status").text();
        var currentscore = $('span.ui-bat-team-scores').text();
        var batsman = $('span.bat-bowl-miniscore').eq(0).text();
        var batsmanrun = $('td[class="cbz-grid-table-fix "]').eq(6).text();
        var ballsfaced = $('span[style="font-weight:normal"]').eq(0).text();
        var fours = $('td[class="cbz-grid-table-fix "]').eq(7).text();
        var sixes = $('td[class="cbz-grid-table-fix "]').eq(8).text();
        var sr = $('td[class="cbz-grid-table-fix "]').eq(9).text();
        var batsmantwo = $('td[class="cbz-grid-table-fix "]').eq(10).text();
        var batsmantworun = $('td[class="cbz-grid-table-fix "]').eq(11).text();
        var batsmantwoballsfaced = $('span[style="font-weight:normal"]').eq(1).text();
        var batsmantwofours = $('td[class="cbz-grid-table-fix "]').eq(12).text();
        var batsmantwosixes = $('td[class="cbz-grid-table-fix "]').eq(16).text();
        var batsmantwosr = $('td[class="cbz-grid-table-fix "]').eq(14).text();
        var bowler = $('span.bat-bowl-miniscore').eq(2).text();
        var bowlerover = $('td[class="cbz-grid-table-fix "]').eq(21).text();
        var bowlerruns = $('td[class="cbz-grid-table-fix "]').eq(23).text();
        var bowlerwickets = $('td[class="cbz-grid-table-fix "]').eq(24).text();
        var bowlermaiden = $('td[class="cbz-grid-table-fix "]').eq(22).text();
        var bowlertwo =  $('span.bat-bowl-miniscore').eq(3).text();
        var bowletworover = $('td[class="cbz-grid-table-fix "]').eq(26).text();
        var bowlertworuns = $('td[class="cbz-grid-table-fix "]').eq(28).text();
        var bowlertwowickets = $('td[class="cbz-grid-table-fix "]').eq(29).text();
        var bowlertwomaiden = $('td[class="cbz-grid-table-fix "]').eq(27).text();
        var partnership = $("span[style='color:#333']").eq(0).text();
        var recentballs = $("span[style='color:#333']").eq(2).text();
        var lastwicket = $("span[style='color:#333']").eq(1).text();
        var runrate = $("span[class='crr']").eq(0).text();
        var commentary = $("p[class='commtext']").text();
        var id =  $("1").text();

        var livescore = ({
            title: title || "",
            update: update || "",
            current: currentscore || "",
            batsman: batsman || "",
            batsmanrun: batsmanrun || "",
            ballsfaced: ballsfaced || "",
            fours: fours || "",
            sixes: sixes || "",
            sr: sr || "",
            batsmantwo: batsmantwo || "",
            batsmantworun: batsmantworun || "",
            batsmantwoballsfaced: batsmantwoballsfaced || "",
            batsmantwofours: batsmantwofours || "",
            batsmantwosixes: batsmantwosixes || "",
            batsmantwosr: batsmantwosr || "",
            bowler: bowler || "",
            bowlerover: bowlerover || "",
            bowlerruns: bowlerruns || "",
            bowlerwickets: bowlerwickets || "",
            bowlermaiden: bowlermaiden || "",
            bowlertwo: bowlertwo || "",
            bowletworover: bowletworover || "",
            bowlertworuns: bowlertworuns || "",
            bowlertwowickets: bowlertwowickets || "",
            bowlertwomaiden: bowlertwomaiden || "",
            partnership: partnership || "",
            recentballs: recentballs || "",
            lastwicket: lastwicket || "",
            runrate: runrate || "",
            commentary: commentary || "",
            id: id || ""
        });

        res.send(JSON.stringify(livescore, null, 4));

    }).catch(function(error) {
        if (!error.response) {
            res.json(error);
        } else {
            res.json(error);
        }
    });

  })
  module.exports = router