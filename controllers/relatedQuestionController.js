var questionService = require('../services/questionService.js');
var mysqlService = require('../services/mysqlService.js');
var template = require('../templates/relatedQuestion.marko')

module.exports = function(req, res) {
    var localityId = req.query.localityId;
    var text = req.query.text;
    questionService.find(localityId, text).then(function(rows) {
        var data = {};
        data.questions = rows;
        template.render(data, res);
    });
};
