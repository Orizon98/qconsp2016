(function ($) {

    var maxThroughput = 0;
    var previousAggregations = {};

    function throughputPulling() {
        function loop() {
            setTimeout(throughputPulling, 2000);
        }

        function expired(timestamp) {
            if (!timestamp) {
                return true;
            }
            var elapsed = new Date().getTime() - timestamp;
            return elapsed / 1000 > 15;
        }

        yawp('/throughputs').list(function (ts) {
            try {
                var total = 0;
                ts.forEach(function (t) {
                    var value = 0;
                    var latencyAvg = 0;
                    if (!expired(t.timestamp)) {
                        value = t.value;
                        latencyAvg = t.latencyAvg;
                    }

                    total += value;
                    $('#global-throughput-' + getName(t.id)).html(value);
                    $('#global-latency-' + getName(t.id)).html(latencyAvg);

                });

                if (total > maxThroughput) {
                    maxThroughput = total;
                }

                $('#global-throughput-max').html(maxThroughput);
                $('#global-throughput-total').html(total);


            } catch (err) {
                // ?
            } finally {
                loop();
            }

        }).fail(loop);
    }

    function aggPulling(type, query) {
        function loop() {
            setTimeout(function () {
                aggPulling(type, query);
            }, 2000);
        }

        query.list(function (aggregations) {
            try {
                var total = initTotal();

                aggregations.forEach(function (agg) {
                    showAggregation(type, agg);
                    sumTotal(total, agg);
                });

                showTotal(type, total);
            } catch (err) {
                // ?
            } finally {
                loop();
            }

        }).fail(loop);
    }

    function showAggregation(type, agg) {
        var prev = previousAggregations[agg.id];

        if (!prev) {
            prev = agg;
        }

        var name = getName(agg.id);
        var selector = '#' + type + '-row-' + name;
        var element = $('<tr id="' + type + '-row-' + name + '"></tr>');
        element.append('<td>' + name.toUpperCase().replace(new RegExp('-', 'g'), ' ') + '</td>');
        element.append('<td class="' + getChangedClass(prev.orderCount, agg.orderCount) + ' total">' + agg.orderCount + '</td>');
        element.append('<td class="' + getChangedClass(prev.orderCountByStatus.CREATED, agg.orderCountByStatus.CREATED) + '">' + nvl(agg.orderCountByStatus.CREATED) + '</td>');
        element.append('<td class="' + getChangedClass(prev.orderCountByStatus.PREPARED, agg.orderCountByStatus.PREPARED) + '">' + nvl(agg.orderCountByStatus.PREPARED) + '</td>');
        element.append('<td class="' + getChangedClass(prev.orderCountByStatus.DELIVERED, agg.orderCountByStatus.DELIVERED) + '">' + nvl(agg.orderCountByStatus.DELIVERED) + '</td>');

        if ($(selector).length) {
            $(selector).html(element.html());
        } else {
            $('.' + type + ' table tbody').append(element);
        }

        previousAggregations[agg.id] = agg;
    }

    function showTotal(type, total) {
        var element = $('<tr></tr>');
        element.append('<td>Total</td>');
        element.append('<td>' + total.orderCount + '</td>');
        element.append('<td>' + total.orderCountByStatus.CREATED + '</td>');
        element.append('<td>' + total.orderCountByStatus.PREPARED + '</td>');
        element.append('<td>' + total.orderCountByStatus.DELIVERED + '</td>');
        $('.' + type + ' table tfoot').html(element);
    }

    function sumTotal(total, agg) {
        total.orderCount += agg.orderCount;
        total.orderCountByStatus.CREATED += nvl(agg.orderCountByStatus.CREATED);
        total.orderCountByStatus.PREPARED += nvl(agg.orderCountByStatus.PREPARED);
        total.orderCountByStatus.DELIVERED += nvl(agg.orderCountByStatus.DELIVERED);
    }

    function initTotal() {
        return {
            orderCount: 0,
            orderCountByStatus: {
                CREATED: 0,
                PREPARED: 0,
                DELIVERED: 0
            }
        };
    }

    function getChangedClass(prev, actual) {
        if (prev != actual) {
            return 'changed';
        }
        return '';
    }

    function getName(id) {
        return id.substring(id.lastIndexOf('/') + 1);
    }

    function nvl(value) {
        return value ? value : 0;
    }

    $('.aggregation thead').click(function () {
        $(this).closest('table').find('tbody').toggle();
    });

    $(document).ready(function () {
        throughputPulling();
        aggPulling('states', yawp('/states').order([{p: 'id'}]));
        aggPulling('cities', yawp('/cities').order([{p: 'id'}]));

    });


})(jQuery);