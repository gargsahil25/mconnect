var template = require('../templates/questionPage.marko')
var async = require('async')
var apiService = require('../services/apiService')
var mockUserDetails = require('../mockUserDetails');
var questionService = require('../services/questionService');
var commonService = require('../services/commonService');

module.exports = function(req, res) {
    var quesId = req.query.questionId;
    var config = {
        dataWithCount: ['question', function(callback, results) {
            return fetchQAndA(results.question.answers).then(function(response) {
                callback(null, response);
            });
        }],

        question: function(callback) {
            return questionService.getQuestionData(quesId).then(function(response) {
                response = parse(response);
                callback(null, response);
            });
        }
    }
    return async.auto(config, (err, results) => {
        var data = {
            question: results.question
        };
        for (var i = 0; i < results.dataWithCount.length; i++) {
            for (var r in results.dataWithCount[i]) {
                console.log(r);
                if (results.dataWithCount[i][r].is_like == 0) {
                    data.question.answers[i].dislikeCount = results.dataWithCount[i][r].count;
                } else if (results.dataWithCount[i][r].is_like == 1) {
                    data.question.answers[i].likeCount = results.dataWithCount[i][r].count;
                }
            }
        }

        console.log(data.question);
        template.render(data, res);
    });
};

function fetchQAndA(arr, callback) {
    var data = [];
    return new Promise(function(resolve, reject) {

        async.each(arr, function(item, callback) {
            commonService.getLikeDislikeCount(item.id).then(function(result) {

                console.log(result);
                data.push(result);
                callback();
            })
        }, function(err) {
            resolve(data);
        })
    })

    // var data = [];
    // var promiseArr = [];
    // var len = arr.length > 2 ? 2 : arr.length;
    // for (var i = 0; i < len; i++) {
    //     var promise = new Promise(function(resolve, reject) {
    //         var temp = val;
    //         commonService.getLikeDislikeCount(arr[i].id).then(function(result) {
    //             var obj = JSON.parse(JSON.stringify(arr[temp]));

    //             val++;
    //             var newData = {};


    //             newData.answerId = obj.id;
    //             newData.answer = obj.answer;
    //             console.log('nd', newData);
    //             resolve(newData);
    //         })
    //     })
    //     promiseArr.push(promise);
    // }
    // return Promise.all(promiseArr)
}



function parse(arr) {
    var object = {};
    object = arr[0];
    object.answers = [];

    for (var i = 0; i < arr.length; i++) {
        var obj = {
            id: arr[i].answer_id,
            answer: arr[i].answer
        }
        object.answers.push(obj);
    }

    return object;
}
