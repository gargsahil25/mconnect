var request = require('request')

module.exports.get = function(url) {
    return new Promise(function(resolve, reject) {
        console.log("GET URL: ", url);
        request({
            url: url,
            method: 'GET',
            json: true
        }, function(error, response, body) {
            if (error) {
                reject(error);
                console.log(error);
                throw error;
            } else {
                // console.log("GET RESPONSE: ", JSON.stringify(body));
                resolve(body);
            }
        });
    });
}