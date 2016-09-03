var mysqlService = require('../services/mysqlService.js');
var apiService = require('../services/apiService.js');
var commonService = require('../services/commonService.js');
var questionService = require('../services/questionService.js');
var async = require('async')

module.exports = function(req, res) {
    var question = req.query.question;
    var questionId = req.query.questionId;
    if (!question || !questionId) {
        res.send(false);
    }
    commonService.sendNotification({
        'msg_type': 'getAnswer',
        'question': question,
        'questionId': questionId
    }).then(function(response) {
        res.send(true);
    });
};