var questionService = require('../services/questionService.js');
var mysqlService = require('../services/mysqlService.js');

module.exports = function(req, res) {
    var localityId = req.query.localityId;
    var text = req.query.text;
    var ids = questionService.find(localityId, text);
    console.log(JSON.stringify(ids));
    if (ids.length == 0) {
        mysqlService.execQueryParams("select * from question where locality_id = ?", [localityId]).then(function(rows) {
            res.json(rows);
        });
    } else if (ids.length == 1) {
        mysqlService.execQueryParams("select * from question where id = ?", ids).then(function(rows) {
            res.json(rows);
        });
    } else {
        mysqlService.execQueryParams("select * from question where id in ?", [ids]).then(function(rows) {
            res.json(rows);
        });
    }
};