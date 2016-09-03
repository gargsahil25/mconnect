var template = require('../templates/allQuestion.marko')
var async = require('async')
var apiService = require('../services/apiService')
var mockUserDetails = require('../mockUserDetails');
var questionService = require('../services/questionService');
var commonService = require('../services/commonService');

var ansId;
var points;
module.exports = function(req, res) {
    var quesId = req.query.questionId;
    var config = {
        questions: function(callback) {
            return questionService.getAllQuestions(1).then(function(response) {
                callback(null, response);
            });
        }
    }
    return async.auto(config, (err, results) => {
        var data = {
            questions: results.questions
        };
        template.render(data, res);

    });
};
