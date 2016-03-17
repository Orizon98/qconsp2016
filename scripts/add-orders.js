module.exports = (function () {

    const BACKEND_API = process.env.QCON2016_API;

    const MAX_CREATE_QUEUE = 30;

    var async = require('async');
    var yawp = require('./lib/yawp');

    yawp.config(function (c) {
        c.baseUrl(BACKEND_API ? BACKEND_API : 'http://localhost:8080/api');
    });

    function run() {
        if (process.argv.length < 6) {
            console.error('use: add-orders [total orders] [parallel requests]');
            return;
        }
        var totalOrders = parseInt(process.argv[2], 10);
        var parallelRequests = parseInt(process.argv[3], 10);

        yawp('/cities').list(function (cities) {
            addOrders(totalOrders, parallelRequests, cities);
        });
    }

    function addOrders(totalOrders, parallelRequests, cities) {
        function addOrder(i, callback) {

            var cityIndex = getRandomInt(0, cities.length - 1);

            var order = {
                cityId: cities[cityIndex].id
            };

            console.log('order ->', order);

            yawp('/orders').create(order).done(function () {
                callback();
            }).fail(function (err) {
                console.log('fail?! ', err);
                callback();
            });
        }

        async.timesLimit(totalRequests, parallelRequests, addOrder, function () {
            console.log('finish');
        });
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
    }

    return {
        run: run
    };

})();

var addOrder = require('./add-orders.js');

if (require.main === module) {
    addOrder.run();
}
