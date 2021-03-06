var mysqlService = require('../services/mysqlService.js');
var apiService = require('../services/apiService.js');
var commonService = require('../services/commonService.js');
var questionService = require('../services/questionService.js');
var async = require('async')

module.exports = function(req, res) {
    var question = req.query.question;
    var userId = req.query.userId;
    var localityId = req.query.localityId;
    if (!question || !userId || !localityId) {
        res.send(false);
    }

    mysqlService.execQueryParams('insert into question (question, locality_id, user_id) values (?, ?, ?)', [question, localityId, userId]).then(function(response) {
        mysqlService.execQueryParams('select * from question where id = ?', [response.insertId]).then(function(questions) {
            questionService.update(questions[0]);
            commonService.sendNotification({
                'msg_type': 'getAnswer',
                'question': question,
                'localityId': localityId,
                'userId': userId
            }).then(function(response) {
                res.send(true);
            });
        });
    });
};