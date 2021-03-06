module.exports = (function () {

    const BACKEND_API = process.env.QCON2016_API;

    const BATCH_SIZE_FOR_THROUGHPUT = 100;

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
        var done = 0;
        var batchDone = 0;
        var throughputStart = new Date();
        var throughputBatchCount = 0;
        var throughputBatchDone = 0;

        function addOrder(i, callback) {
            if (batchDone == BATCH_SIZE_FOR_THROUGHPUT) {
                logBatchThroughput();
                batchDone = 0;
            }

            var cityIndex = getRandomInt(0, cities.length - 1);

            var order = {
                cityId: cities[cityIndex].id
            };

            console.log('create order ->', order);

            var requestStart = new Date();
            yawp('/orders').create(order).done(function () {
                done++;
                batchDone++;
                throughputBatchDone++;
                callback();
            }).fail(function (err) {
                console.log('fail?! ', err);
                callback();
            });
        }

        function throughput(start, total) {
            var elapsed = new Date().getTime() - start.getTime();
            var throughput = Math.floor(1000 * total / elapsed);
            return {elapsed: elapsed, throughput: throughput};
        }

        function logBatchThroughput() {
            var t = throughput(throughputStart, throughputBatchDone);
            yawp('/throughputs/created').update({
                value: t.throughput,
                timestamp: new Date().getTime()
            });

            throughputBatchCount++;
            if (throughputBatchCount == 10) {
                throughputStart = new Date();
                throughputBatchDone = 0;
                throughputBatchCount = 0;
            }
        }

        function logTotalThroughput() {
            var t = throughput(start, totalOrders);
            console.log("Finished: " + totalOrders + " orders in " + (t.elapsed / 1000) + " seconds. " + t.throughput + " orders/sec")
        }

        async.timesLimit(totalOrders, parallelRequests, addOrder, function () {
            logTotalThroughput();
        });
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max + 1 - min)) + min;
    }

    return {
        run: run
    };

})();

var addOrders = require('./add-orders.js');

if (require.main === module) {
    addOrders.run();
}
