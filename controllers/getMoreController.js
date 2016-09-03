var template = require('../templates/answerPage.marko')
var async = require('async')
var apiService = require('../services/apiService')
var mockUserDetails = require('../mockUserDetails');
var questionService = require('../services/questionService');
var commonService = require('../services/commonService');

var ansId;

module.exports = function(req, res) {
    var quesId = req.query.questionId;
    var config = {
        getBaughtAns: ['getPoints', function(callback, results) {
            if (ansId) {
                return questionService.getAnsById(ansId).then(function(response) {
                    callback(null, response);
                });
            } else {
                callback(null, []);
            }
        }],
        dataWithCount: ['getBaughtAns', function(callback, results) {
            if (results.getBaughtAns.length > 0) {
                return questionService.getAnsById(results.getBaughtAns[0].id).then(function(response) {
                    fetchQAndA(response).then(function(response) {
                        console.log(response);
                        callback(null, response);
                    });
                });
            } else {
                callback(null, []);
            }
        }],
        likedDislikedAns: function(callback) {
            return questionService.getLikedDislikedAns(1).then(function(response) {
                callback(null, response);
            });
        },
        getPoints: function(callback) {
            return questionService.getUserPoints(1).then(function(response) {
                if (response[0].points > 0) {
                    return questionService.getAllocAnsId(1, quesId).then(function(response) {
                        if (response.length > 0) {
                            ansId = response[0].id;
                            return questionService.buyOneAnswer(1, response[0].id).then(function(response) {
                                callback(null, response);
                            });
                        } else {
                            callback(null, response);
                        }
                    });
                } else {
                    callback(null, response);
                }
            });
        }
    }
    return async.auto(config, (err, results) => {
        var data = {
            answer: results.getBaughtAns[0],
            likedDisliked: convert(results.likedDislikedAns)
        };
        for (var i = 0; i < results.answer.length; i++) {
            for (var r in results.answer[i]) {
                if (results.answer[i][r].is_like == 0) {
                    data.question.answers[i].dislikeCount = results.answer[i][r].count;
                } else if (results.answer[i][r].is_like == 1) {
                    data.question.answers[i].likeCount = results.answer[i][r].count;
                }
            }
        }
        template.render(data, res);
    });
};

function fetchQAndA(arr, callback) {
    var data = [];
    return new Promise(function(resolve, reject) {
        async.each(arr, function(item, callback) {
            commonService.getLikeDislikeCount(item.id).then(function(result) {
                data.push(result);
                callback();
            })
        }, function(err) {
            resolve(data);
        })
    })
}

function convert(arr) {
    var like = {};
    var dislike = {};
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].is_like) {
            like[arr[i].answer_id] = 1;
        } else {
            dislike[arr[i].answer_id] = 1;
        }
    }
    return {
        like: like,
        dislike: dislike
    }
}
