var request = require('request')


module.exports.getURL = function(url, selectorOpts) {
    if (url.match(/\?/)) {
        return url + '&selector=' + JSON.stringify(selectorOpts);
    }
    return url + '?selector=' + JSON.stringify(selectorOpts);
};

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
};


module.exports.post = function(url, data, sendHeaders) {
    return new Promise(function(resolve, reject) {
        var options = {
            method: 'POST',
            url: url,
            json: true,
            body: data
        };

        if (sendHeaders) {
            options.headers = {
                'Authorization': 'key=AIzaSyDoOjJVsSzCe_YkuKf7PaG167fsJNzp1pk',
                'Content-Type': 'application/json'
            }
        }

        console.log("POSTING OPTIONS: ", JSON.stringify(options));
        request(options,
            function(error, response, body) {
                if (error) {
                    console.log(error)
                    reject(error);
                    throw error;
                } else {
                    console.log("POSTING RESPONSE: ", JSON.stringify(body));
                    resolve(body);
                }
            });
    });
};
