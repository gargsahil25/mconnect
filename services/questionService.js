var mysqlService = require('../services/mysqlService.js');
var wordMap = {};
var totalQuestions = 0;

module.exports.init = function() {
    mysqlService.execQuery('select * from question').then(function(rows) {
        totalQuestions = rows.length;
        for (var question of rows) {
            var localityId = question.locality_id;
            if (!wordMap[localityId]) {
                wordMap[localityId] = {};
            }
            var text = question.question.replace(/[^a-zA-Z]+/g, " ").toLowerCase();
            var words = text.split(" ");
            for (var word of words) {
                if (!wordMap[localityId][word]) {
                    wordMap[localityId][word] = [];
                }
                wordMap[localityId][word].push(question.id);
            }
        }
        //console.log(JSON.stringify(wordMap));
    });
};

module.exports.find = function(localityId, text) {
    var map = wordMap[localityId];
    var words = [];
    if (text) {
        text = text.replace(/[^a-zA-Z]+/g, " ").toLowerCase();
        words = text.split(" ");
    }
    var questionMap = {};
    for (var word of words) {
        if (!map[word] || map[word].length > totalQuestions / 3) {
            continue;
        }
        //console.log(JSON.stringify(map[word]));
        for (var q of map[word]) {
            if (!questionMap[q]) {
                questionMap[q] = 0;
            }
            questionMap[q]++;
        }
    }
    //console.log(JSON.stringify(questionMap));
    var sortedQuestions = Object.keys(questionMap).sort(function(a, b) {
        return questionMap[b] - questionMap[a];
    });
    //console.log(JSON.stringify(sortedQuestions));
    return getQuestions(sortedQuestions);
};

function getQuestions(ids) {
    return new Promise(function(resolve, reject) {
        if (ids.length == 0) {
            mysqlService.execQueryParams("select * from question where locality_id = ? order by answer_count desc, id desc", [localityId]).then(function(rows) {
                resolve(rows);
            });
        } else {
            mysqlService.execQuery("select * from question where id in (" + ids.join(',') + ")").then(function(rows) {
                resolve(rows);
            });
        }
    });
}