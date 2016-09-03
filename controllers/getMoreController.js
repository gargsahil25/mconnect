var template = require('../templates/answerPage.marko')
var templatePopup = require('../templates/popupPage.marko')
var async = require('async')
var apiService = require('../services/apiService')
var mockUserDetails = require('../mockUserDetails');
var questionService = require('../services/questionService');
var commonService = require('../services/commonService');

var ansId;
var points;
var questions;
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
                points = response[0].points;
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
                    return questionService.getAllQuestions(1, quesId).then(function(response) {
                        questions = response;
                        callback(null, response);
                    });
                }
            });
        }
    }
    async.auto(config, (err, results) => {
        var data = {
            answer: results.getBaughtAns[0],
            likedDisliked: convert(results.likedDislikedAns)
        };
        if (data.answer) {
            console.log(results);
            // for (var i = 0; i < data.answer.length; i++) {
            //     console.log('nbsjid', data.answer);
            //     data.question.answers[i].dislikeCount = 0;
            //     data.question.answers[i].likeCount = 0;

            //     for (var r in data.answer[i]) {
            //         if (data.answer[i][r].is_like == 0) {
            //             data.question.answers[i].dislikeCount = data.answer[i][r].count;
            //         } else if (data.answer[i][r].is_like == 1) {
            //             data.question.answers[i].likeCount = data.answer[i][r].count;
            //         }
            //     }
            // }
        }

        if (points > 0) {
            return template.render(data, function(err, output) {
                res.json({
                    type: 'answers',
                    data: output
                });
            });
        } else {
            return getArrTemp().then(function(response) {
                res.json({
                    type: 'questions',
                    data: response
                });
            });
            // templatePopup.render(data, res);
        }
    });
};

function getArrTemp(res) {

    return new Promise(function(resolve, reject) {
        var val = [];
        for (var i = 0; i < questions.length; i++) {
            var data = {
                question: questions[i]
            }
            templatePopup.render(data, function(err, output) {
                if (err) {
                    console.error('Rendering failed');
                    return;
                }
                val.push(output);
                if (questions.length == val.length) {
                    resolve(val);
                }
            });
        }
    })
}

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
