module.exports = (function () {

    const BACKEND_API = process.env.QCON2016_API;

    const BATCH_SIZE = 400;

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
        var queue;
        var cursor;

        function loadMoreOrders() {
            var batchSize = (totalOrders - done < BATCH_SIZE) ? totalOrders - done : BATCH_SIZE;

            var params = {
                status: fromStatus,
                limit: batchSize
            };

            if (cursor) {
                params.cursor = cursor;
            }

            yawp('/orders').params(params).get('nextBatch').done(function (batch) {
                cursor = batch.cursor;
                queue.push(batch.orders);
            });
        }

        function checkLoadMoreOrders() {
            batchDone++;
            if (batchDone == BATCH_SIZE / 2) {
                batchDone = 0;
                loadMoreOrders();
            }
        }

        function updateOrder(order, doneCallback) {
            if (order.id in updatedOrders) {
                checkLoadMoreOrders();
                doneCallback();
                return;
            }

            console.log('update order ->', order.id, 'city=' + order.cityId, 'from=' + fromStatus, 'to=' + toStatus);

            order.status = toStatus;
            yawp.update(order).done(function () {
                done++;
                updatedOrders[order.id] = true;
                checkLoadMoreOrders();
                doneCallback();
            }).fail(function () {
                console.log('fail?! ', err);
                checkLoadMoreOrders();
                doneCallback();
            });
        }

        var queue = async.queue(updateOrder, parallelRequests);
        queue.drain = function () {
            callback(batchDone);
        }

        loadMoreOrders();

        function throughput(total) {
            var elapsed = new Date().getTime() - start.getTime();
            var throughput = Math.floor(1000 * total / elapsed);
            return {elapsed: elapsed, throughput: throughput};
        }

        function logBatchThroughput() {
            var t = throughput(done);
            yawp('/throughputs/' + toStatus.toLowerCase()).update({
                value: t.throughput,
                timestamp: new Date().getTime()
            });
        }

        function logTotalThroughput() {
            var t = throughput(totalOrders);
            console.log("Finished: " + totalOrders + " orders in " + t.elapsed + " seconds. " + t.throughput + " orders/sec")
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
