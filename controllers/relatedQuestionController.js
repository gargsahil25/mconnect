var questionService = require('../services/questionService.js');
var mysqlService = require('../services/mysqlService.js');

module.exports = function(req, res) {
    var localityId = req.query.localityId;
    var text = req.query.text;
    questionService.find(localityId, text).then(function(rows) {
        res.json(rows);
    });
};