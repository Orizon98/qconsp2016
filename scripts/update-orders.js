module.exports = (function () {

    const BACKEND_API = process.env.QCON2016_API;

    const BATCH_SIZE = 2000;

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
        var batchDone = 0;
        var loaded = 0;
        var queue;
        var cursor;
        var throughputStart = new Date();
        var throughputBatchCount = 0;
        var throughputBatchDone = 0;


        function loadMoreOrders() {
            var batchSize = (totalOrders - loaded < BATCH_SIZE) ? totalOrders - loaded : BATCH_SIZE;
            loaded += batchSize;

            var params = {
                status: fromStatus,
                limit: batchSize
            };

            if (cursor) {
                params.cursor = cursor;
            }

            yawp('/orders').params(params).get('next-batch').done(function (batch) {
                cursor = batch.cursor;
                queue.push(batch.orders);
            }).fail(function (err) {
                console.log('err', err);
            });
        }

        function checkLoadMoreOrders() {
            batchDone++;
            if (batchDone >= BATCH_SIZE / 8) {
                logBatchThroughput();
                batchDone = 0;

                if (loaded - done <= 4 * BATCH_SIZE) {
                    loadMoreOrders();
                }
            }
        }

        function updateOrder(order, doneCallback) {
            if (updatedOrders[order.id]) {
                checkLoadMoreOrders();
                doneCallback();
                return;
            }
            updatedOrders[order.id] = true;

            console.log('update order ->', order.id, 'city=' + order.cityId, 'from=' + fromStatus, 'to=' + toStatus);

            var requestStart = new Date();
            order.status = toStatus;
            yawp.update(order).done(function () {
                done++;
                throughputBatchDone++;
                checkLoadMoreOrders();
                doneCallback();
            }).fail(function (err) {
                console.log('fail?! ', err);
                checkLoadMoreOrders();
                doneCallback();
            });
        }

        var queue = async.queue(updateOrder, parallelRequests);
        queue.drain = function () {
            if (loaded >= totalOrders) {
                logTotalThroughput();
            }
        }

        loadMoreOrders();

        function throughput(start, total) {
            var elapsed = new Date().getTime() - start.getTime();
            var throughput = Math.floor(1000 * total / elapsed);
            return {elapsed: elapsed, throughput: throughput};
        }

        function logBatchThroughput() {
            var t = throughput(throughputStart, throughputBatchDone);
            yawp('/throughputs/' + toStatus.toLowerCase()).update({
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
            console.log("Finished: " + done + " orders in " + (t.elapsed / 1000) + " seconds. " + t.throughput + " orders/sec")
        }
    }

    return {
        run: run
    };

})
();

var updateOrders = require('./update-orders.js');

if (require.main === module) {
    updateOrders.run();
}
