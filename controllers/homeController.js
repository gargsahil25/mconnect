var template = require('../templates/home.marko')
var async = require('async')

module.exports = function(req, res) {

    var config = {
        cities: function(callback) {
            getCities();
        },

    }
    template.render({

    }, res);
};

function getCities() {
	
}
