var mysqlService = require('../services/mysqlService.js');
var apiService = require('../services/apiService.js');
var commonService = require('../services/commonService.js');
var async = require('async')

module.exports = function(req, res) {
    var answer = req.query.answer;
    var userId = req.query.userId;
    var questionId = req.query.questionId;
    var notify = req.query.notify;

    if (!questionId || !userId || !answer) {
        res.send(false);
    }
    console.log(answer);
    async.auto({
        saveAnswer: function(callback) {
            return mysqlService.execQueryParams('insert into answer (answer, question_id, user_id) values (?, ?, ?)', [answer, questionId, userId]).then(function(response) {
                callback(null, response);
            });
        },
        question: function(callback) {
            return mysqlService.execQueryParams('select * from question where id = ?', [questionId]).then(function(response) {
                callback(null, response);
            });
        }
    }, function(err, results) {
        if (notify) {
            commonService.sendNotification({
                'msg_type': 'showAnswer',
                'question': results.question[0].question,
                'answer': answer
            }).then(function(response) {
                res.send(true);
            });
        } else {
            res.send(true);
        }
    });
}