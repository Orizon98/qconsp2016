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
                        updateOrdersLoop();
                        return;
                    }

                    logThroughput(done, start);
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

        updateOrdersLoop();
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

var updateOrders = require('./update-orders.js');

if (require.main === module) {
    updateOrders.run();
}
