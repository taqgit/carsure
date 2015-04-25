/**
 * Error responses
 */

'use strict';

module.exports[404] = function pageNotFound(req, res) {
    var viewFilePath = '404';
    var statusCode = 404;
    var result = {
        status: statusCode
    };

    res.status(result.status);
    console.log('status -> ' + result.status);
    res.render(viewFilePath, function (err) {
        console.log('status -> ' + result.status + ' error -> ' + err);
        if (err) {
            return res.json(result, result.status);
        }

        res.render(viewFilePath);
    });
};