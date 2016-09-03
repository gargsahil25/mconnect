var template = require('../templates/questionPage.marko')
var async = require('async')
var apiService = require('../services/apiService')
var mockUserDetails = require('../mockUserDetails');
var questionService = require('../services/questionService');
var commonService = require('../services/commonService');

module.exports = function(req, res) {
    var quesId = req.query.questionId;
    var config = {
        getBoughtAnswers: ['question', function(callback, results) {
            return questionService.getBoughtAnswersData(1, quesId).then(function(response) {
                if (response.length == 0) {
                    return questionService.buyOneAnswer(1, results.question[0].answer_id).then(function(response) {

                        callback(null, response);
                    });
                }
                callback(null, response);
            });
        }],
        question: function(callback) {
            return questionService.getQuestionData(quesId).then(function(response) {
                callback(null, response);
            });
        },
        likedDislikedAns: function(callback) {
            return questionService.getLikedDislikedAns(1).then(function(response) {
                callback(null, response);
            });
        },

        dataWithCount: ['getBoughtAnswers', function(callback, results) {
            results.question = parse(results.question, getBoughtAnsId(results.getBoughtAnswers))
            return fetchQAndA(results.question.answers).then(function(response) {
                callback(null, response);
            });
        }]

    }
    return async.auto(config, (err, results) => {
        var data = {
            question: results.question,
            likedDisliked: convert(results.likedDislikedAns)
        };
        for (var i = 0; i < results.dataWithCount.length; i++) {
            data.question.answers[i].dislikeCount = 0;
            data.question.answers[i].likeCount = 0;
            for (var r in results.dataWithCount[i]) {
                if (results.dataWithCount[i][r].is_like == 0) {
                    data.question.answers[i].dislikeCount = results.dataWithCount[i][r].count;
                } else if (results.dataWithCount[i][r].is_like == 1) {
                    data.question.answers[i].likeCount = results.dataWithCount[i][r].count;
                }
            }
        }

        console.log(data.likedDisliked);
        template.render(data, res);
    });
};


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

function getBoughtAnsId(arr) {
    var data = [];
    for (var i = 0; i < arr.length; i++) {
        data.push(arr[i].answer_id);
    }
    return data;
}

function parse(arr, filterArr) {
    var object = {};
    object = arr[0];
    object.answers = [];

    for (var i = 0; i < arr.length; i++) {
        if (filterArr.indexOf(arr[i].answer_id) > -1) {
            var obj = {
                id: arr[i].answer_id,
                answer: arr[i].answer
            }
            object.answers.push(obj);
        }
    }

    return object;
}
