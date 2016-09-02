var mysqlService = require('../services/mysqlService.js');

module.exports.getLikeDislikeCount = function(answerId) {
    return mysqlService.execQueryParams("select is_like, count(*) as count from answer_rating where answer_id = ? group by is_like", [answerId]);
};
