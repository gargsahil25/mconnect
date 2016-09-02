var template = require('../templates/question.marko');
var mysqlService = require('../services/mysqlService.js');

module.exports = function(req, res) {
    mysqlService.execQuery("select * from question").then(function(rows) {
        template.render({
        	questions: rows
        }, res);
    });
};