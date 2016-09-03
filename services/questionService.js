var mysqlService = require('../services/mysqlService.js');
var commonService = require('../services/commonService');

var wordMap = {};
var totalQuestions = 0;

module.exports.init = function() {
    mysqlService.execQuery('select * from question').then(function(rows) {
        for (var question of rows) {
            update(question);
        }
        //console.log(JSON.stringify(wordMap));
    });
};

var update = function(question) {
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
    totalQuestions++;
};

module.exports.update = update;

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
    return getQuestions(sortedQuestions, localityId);
};

function getQuestions(ids, localityId) {
    return new Promise(function(resolve, reject) {
        if (ids.length == 0) {
            mysqlService.execQueryParams("select * from question where locality_id = ? order by answer_count desc", [localityId]).then(function(rows) {
                resolve(rows);
            });
        } else {
            mysqlService.execQuery("select * from question where id in (" + ids.join(',') + ")").then(function(rows) {
                resolve(rows);
            });
        }
    });
}

module.exports.getQuestionData = function(id) {
    return new Promise(function(resolve, reject) {
        mysqlService.execQuery("select *,a.id as answer_id from answer as a,question as q where a.question_id=q.id and a.question_id=" + id).then(function(rows) {
            resolve(rows);
        });
    });
}

module.exports.getBoughtAnswersData = function(id, quesId) {
    return new Promise(function(resolve, reject) {
        mysqlService.execQuery("select *,a.id as answer_id from buy_answer as ba,answer as a where ba.answer_id=a.id and ba.user_id=" + id + " and a.question_id=" + quesId).then(function(rows) {
            resolve(rows);
        });
    });
}
module.exports.getLikedDislikedAns = function(userId) {
    return new Promise(function(resolve, reject) {
        mysqlService.execQuery("select answer_id,is_like from answer_rating where user_id=" + userId).then(function(rows) {
            resolve(rows);
        });
    });
}
module.exports.buyOneAnswer = function(userId, ansId) {
    return mysqlService.execQueryParams('insert into buy_answer (user_id,answer_id) values(?,?)', [userId, ansId]).then(function(rows) {
        return commonService.increaseCount(userId, -1);
    });
}
module.exports.getAllocAnsId = function(userId, quesId) {
    return mysqlService.execQuery('select a.id from answer as a where a.id not in ( SELECT answer_id FROM buy_answer where user_id=' + userId + ') and question_id=' + quesId + ' limit 1');
}
module.exports.getUserPoints = function(userId) {
    return mysqlService.execQueryParams('select points from user where user_id=?', [userId])
}
module.exports.getAnsById = function(ansId) {
    return mysqlService.execQuery('select * from answer where id=' + ansId)
}
