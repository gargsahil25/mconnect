var template = require('../templates/homePage.marko')
var async = require('async')
var apiService = require('../services/apiService')
var mockUserDetails = require('../mockUserDetails');
var questionService = require('../services/questionService');

module.exports = function(req, res) {
    var cityId = req.query.cityId;
    var localityId = req.query.localityId;
    var text = req.query.text;

    var config = {
        question: function(callback) {
            return questionService.find(localityId, text).then(function(response) {
                callback(null, response)
            });
        }
    }
    return async.auto(config, (err, results) => {
        var data = {
            questions: results.question
        };
        template.render(data, res);
    });
};

