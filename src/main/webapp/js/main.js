(function ($) {

    var baseAggregations = {};
    var previousAggregations = {};

    function throughputPulling() {
        yawp('/throughputs').list(function (ts) {
            var total = 0;
            ts.forEach(function (t) {
                total += t.value;
                $('#global-throughput-' + getName(t.id)).html(t.value);
            });

            $('#global-throughput').html(total);
            setTimeout(throughputPulling, 2000);
        });
    }

    function aggPulling(type, query) {
        query.list(function (aggregations) {
            var total = initTotal();

            aggregations.forEach(function (agg) {
                showAggregation(type, agg);
                sumTotal(total, agg);
            });

            showTotal(type, total);

            setTimeout(function () {
                aggPulling(type, query);
            }, 2000);
        });
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