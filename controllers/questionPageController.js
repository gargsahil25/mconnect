var template = require('../templates/home.marko')
var async = require('async')
var apiService = require('../services/apiService')
var mockUserDetails = require('../mockUserDetails');
var questionService = require('../services/questionService');

module.exports = function(req, res) {
    var quesId = req.query.questionId;
    var config = {
        question: function(callback) {
            return questionService.getQuestionData(quesId).then(function(response) {
                callback(null, response)
            });
        }
    }
    return async.auto(config, (err, results) => {
        var data = {
            question: results.question
        };
        console.log(data.question);
        // template.render(data, res);
    });
};