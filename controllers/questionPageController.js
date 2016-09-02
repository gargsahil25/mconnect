var template = require('../templates/questionPage.marko')
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
            question: parse(results.question)
        };
        console.log(data.question);
        template.render(data, res);
    });
};

function parse(arr) {
    var object = {};
    object = arr[0];
    object.answers = [];

    for (var i = 0; i < arr.length; i++) {
        object.answers.push(arr[i].answer);
    }

    return object;
}
