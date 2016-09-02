var mysqlService = require('../services/mysqlService.js');
var apiService = require('../services/apiService.js');
var configService = require('../services/configService.js');

module.exports.getLikeDislikeCount = function(answerId) {
    return mysqlService.execQueryParams("select is_like, count(*) as count from answer_rating where answer_id = ? group by is_like", [answerId]);
};

module.exports.sendNotification = function(type, data) {
    return apiService.post('https://android.googleapis.com/gcm/send', {
        'registration_ids': [configService.gcmId],
        'data': {
            'type': type,
            'data': data
        }
    }, true);
};