module.exports = (function () {

    const BACKEND_API = process.env.QCON2016_API;

    const MAX_CREATE_QUEUE = 30;

    var async = require('async');
    var yawp = require('./lib/yawp');

    yawp.config(function (c) {
        c.baseUrl(BACKEND_API ? BACKEND_API : 'http://localhost:8080/api');
    });

    function run() {
        if (process.argv.length != 4) {
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
        var start = new Date();

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

        async.timesLimit(totalOrders, parallelRequests, addOrder, function () {
            logThroughput(totalOrders, start);
        });
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
    }

    function logThroughput(totalOrders, start) {
        var elapsed = Math.floor((new Date().getTime() - start.getTime()) / 1000);
        var throughput = elapsed == 0 ? totalOrders : Math.floor(totalOrders / elapsed);
        console.log("Finished: " + totalOrders + " orders in " + elapsed + " seconds. " + throughput + " orders/sec")
    }

    return {
        run: run
    };

})();

var addOrder = require('./add-orders.js');

if (require.main === module) {
    addOrder.run();
}
