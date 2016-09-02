var template = require('../templates/home.marko')
var async = require('async')
var apiService = require('../services/apiService')
var mockUserDetails = require('../mockUserDetails');
var questionService = require('../services/questionService');

module.exports = function(req, res) {
    var cityId = req.query.cityId;
    var localityId = req.query.localityId;
    var text = req.query.text;

    var config = {
        cities: function(callback) {
            return fetchCities().then(function(response) {
                callback(null, response)
            });
        },
        locality: function(callback) {
            return fetchLocalities(mockUserDetails.data.cityId).then(function(response) {
                callback(null, response)
            });
        },
        question: function(callback) {
            return questionService.find(localityId, text).then(function(response) {
                callback(null, response)
            });
        },
        // locality: ['userData', function(callback, results) {
        //     console.log('sbdhfb');
        //     return fetchLocalities(results.userData.data.cityId).then(function(response) {
        //         console.log('sbdhfb');
        //         callback(null, response);
        //     });
        // }],
        // userData: ['login', function(callback, results) {
        //     return fetchUserData().then(function(response) {
        //         console.log('dkjf vkkdjf', response);
        //         callback(null, response)
        //     });
        // }],
        // login: function(callback) {
        //     return fetchLoginData().then(function(response) {
        //         callback(null, response)
        //     });
        // },
    }
    return async.auto(config, (err, results) => {
        var data = {
            cities: results.cities.data,
            locality: results.locality.data,
            questions: results.question
        };
        console.log('ihsbdihvbib', data.questions);
        template.render(data, res);
    });
};

function fetchCities() {
    var urlSelectors = {
        "fields": [
            "id", "label"
        ],
        "paging": { "start": 0, "rows": 10000 },
        "sort": [{ "field": "displayPriority", "sortOrder": "ASC" }, { "field": "label", "sortOrder": "ASC" }]
    };
    var url = apiService.getURL('http://www.proptiger.com/data/v1/entity/city', urlSelectors);


    var promise = apiService.get(url).then(function(response) {
            cityPromise = promise;
            console.log('city data');
            return response;
        },
        function() {
            cityPromise = null;
        });

    return promise;
}

function fetchLocalities(cityId) {

    var urlSelectors = {
        "fields": [
            "localityId", "label"
        ],
        "filters": {
            "and": [{
                "equal": {
                    "cityId": cityId
                }
            }]
        },
        "paging": {
            "start": 0,
            "rows": 500
        }
    };

    var urlSelectorsInFIQL = '?fields=localityId,label&filters=suburb.cityId==' +
        cityId + '&paging=start==0&rows=500';

    var url = 'http://www.proptiger.com/data/v5/entity/locality' + urlSelectorsInFIQL;

    var promise = apiService.get(url).then(function(response) {
        cityPromise = promise;
        console.log('locality data');
        return response;
    });

    return promise;
}

function fetchUserData(req, res) {
    return mock('../mockUserDetails');

    var url = 'http://www.proptiger.com/userservice/app/v1/user-details';
    var promise = apiService.get(url).then(function(response) {
        cityPromise = promise;
        return response;
    });

    return promise;

}

function fetchLoginData(req, res) {

    return mock('../mockUserDetails');

    var url = 'http://www.proptiger.com/userservice/app/v1/user-details';
    var promise = apiService.get(url).then(function(response) {
        cityPromise = promise;
        return response;
    });

    return promise;

}

function mock(str) {
    var mockRes = require(str);
    // logger.log('info', 'using mock', options.mockUrl);
    return new Promise(resolve => resolve(mockRes));

}
