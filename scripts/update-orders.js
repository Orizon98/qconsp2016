module.exports = (function () {

    const BACKEND_API = process.env.QCON2016_API;

    const BATCH_SIZE = 100;

    var async = require('async');
    var yawp = require('./lib/yawp');

    yawp.config(function (c) {
        c.baseUrl(BACKEND_API ? BACKEND_API : 'http://localhost:8080/api');
    });

    function run() {
        if (process.argv.length != 6) {
            console.error('use: update-orders [total orders] [parallel requests] [from status] [to status]');
            return;
        }
        var totalOrders = parseInt(process.argv[2], 10);
        var parallelRequests = parseInt(process.argv[3], 10);
        var fromStatus = process.argv[4];
        var toStatus = process.argv[5];

        updateOrders(totalOrders, parallelRequests, fromStatus, toStatus);
    }

    function updateOrders(totalOrders, parallelRequests, fromStatus, toStatus) {
        var updatedOrders = {};
        var start = new Date();
        var done = 0;

        function updateOrdersLoop() {
            var batchSize = (totalOrders - done < BATCH_SIZE) ? totalOrders - done : BATCH_SIZE;

            yawp('/orders').where(['status', '=', fromStatus]).limit(batchSize).list(function (orders) {
                updateOrdersBatch(orders, function (batchDone) {
                    done += batchDone;
                    if (done < totalOrders) {
                        logBatchThroughput();
                        updateOrdersLoop();
                        return;
                    }

                    logTotalThroughput();
                });
            });
        }

        function updateOrdersBatch(orders, callback) {
            var batchDone = 0;

            function updateOrder(order, doneCallback) {
                if (order.id in updatedOrders) {
                    doneCallback();
                    return;
                }

                console.log('update order ->', order.id, 'city=' + order.cityId, 'from=' + fromStatus, 'to=' + toStatus);

                order.status = toStatus;
                yawp.update(order).done(function () {
                    batchDone++;
                    doneCallback();
                }).fail(function () {
                    console.log('fail?! ', err);
                    doneCallback();
                });
            }

            var queue = async.queue(updateOrder, parallelRequests);
            queue.drain = function () {
                callback(batchDone);
            }
            queue.push(orders);
        }

        function throughput(total) {
            var elapsed = new Date().getTime() - start.getTime();
            var throughput = Math.floor(1000 * total / elapsed);
            return {elapsed: elapsed, throughput: throughput};
        }

        function logBatchThroughput() {
            var t = throughput(done);
            yawp('/throughputs/' + toStatus.toLowerCase()).update({
                value: t.throughput
            });
        }

        function logTotalThroughput() {
            var t = throughput(totalOrders);
            console.log("Finished: " + totalOrders + " orders in " + t.elapsed + " seconds. " + t.throughput + " orders/sec")
        }

        updateOrdersLoop();
    }

    return {
        run: run
    };

})();

var updateOrders = require('./update-orders.js');

if (require.main === module) {
    updateOrders.run();
}
