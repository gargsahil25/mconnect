var mysqlService = require('../services/mysqlService.js');
var apiService = require('../services/apiService.js');
var commonService = require('../services/commonService.js');
var async = require('async')

module.exports = function(req, res) {
    var answerId = req.query.answerId;
    var userId = req.query.userId;
    var isLike = req.query.isLike;
    if (!answerId || !userId || !isLike) {
        res.send(false);
    }

    async.auto({
        answer: function(callback) {
            mysqlService.execQueryParams('select * from answer a inner join question q on a.question_id = q.id where a.id = ?', [answerId]).then(function(answer) {
                callback(null, answer);
            });
        },
        getRating: function(callback) {
            mysqlService.execQueryParams('select * from answer_rating where answer_id = ? and user_id = ?', [answerId, userId]).then(function(row) {
                callback(null, row);
            });
        },
        rate: ['getRating', function(callback, results) {
            if (results.getRating && results.getRating.length > 0) {
                mysqlService.execQueryParams("update answer_rating set is_like = ? where answer_id = ? and user_id = ?", [isLike, answerId, userId]).then(function(result) {
                    //console.log(result);
                    callback(null, result);
                });
            } else {
                mysqlService.execQueryParams("insert into answer_rating (answer_id, is_like, user_id) values (?,?,?)", [answerId, isLike, userId]).then(function(result) {
                    //console.log(result);
                    callback(null, result);
                });
            }
        }],
        count: ['rate', function(callback, results) {
            commonService.getLikeDislikeCount(answerId).then(function(result) {
                //console.log(result);
                var obj = {
                    likeCount: 0,
                    dislikeCount: 0
                };

                for (r of result) {
                    if (r.is_like == 1) {
                        obj.likeCount = r.count;
                    } else if (r.is_like == 0) {
                        obj.dislikeCount = r.count;
                    }
                }
                callback(null, obj);
            });
        }]
    }, function(err, results) {
        // console.log(err);
        // console.log(JSON.stringify(results));
        commonService.sendNotification('showRating', {
            'question': results.answer.question,
            'answer': results.answer.answer,
            'likeCount': results.count.likeCount,
            'dislikeCount': results.count.dislikeCount
        }).then(function(response) {
            res.send(true);
        });
    });
};