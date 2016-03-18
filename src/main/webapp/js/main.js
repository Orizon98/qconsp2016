(function ($) {

    var baseAggregations = {};

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

    function statesPulling() {
        yawp('/states').order([{p: 'id'}]).list(function (states) {
            states.forEach(function (aggregation) {
                showAggregation('states', aggregation);
            });

            setTimeout(statesPulling, 2000);
        });
    }

    function citiesPulling() {
        yawp('/cities').order([{p: 'id'}]).list(function (cities) {
            cities.forEach(function (aggregation) {
                showAggregation('cities', aggregation);
            });

            setTimeout(citiesPulling, 2000);
        });
    }

    function showAggregation(type, aggregation) {
        var name = getName(aggregation.id);
        var selector = '#' + type + '-row-' + name;
        var element = $('<tr id="' + type + '-row-' + name + '"></tr>');
        element.append('<td>' + name.toUpperCase().replace(new RegExp('-', 'g'), ' ') + '</td>');
        element.append('<td>' + getAdded(aggregation) + '</td>');
        element.append('<td class="total">' + aggregation.orderCount + '</td>');
        element.append('<td>' + nvl(aggregation.orderCountByStatus.CREATED) + '</td>');
        element.append('<td>' + nvl(aggregation.orderCountByStatus.PREPARED) + '</td>');
        element.append('<td>' + nvl(aggregation.orderCountByStatus.DELIVERED) + '</td>');

        if ($(selector).length) {
            $(selector).html(element.html());
        } else {
            $('.' + type + ' table').append(element);
        }
    }

    function getAdded(aggregation) {
        var id = aggregation.id;

        if (!(id in baseAggregations)) {
            baseAggregations[id] = {
                orderCount: aggregation.orderCount,
                time: new Date().getTime()
            };
            return 0;
        }

        var base = baseAggregations[id];
        var added = aggregation.orderCount - base.orderCount;
        return added;
    }

    function getName(id) {
        return id.substring(id.lastIndexOf('/') + 1);
    }

    function nvl(value) {
        return value ? value : 0;
    }

    $(document).ready(function () {
        throughputPulling();
        statesPulling();
        citiesPulling();
    });


})(jQuery);