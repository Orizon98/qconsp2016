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

    function showAggregation(type, agg) {
        var prev = previousAggregations[agg.id];

        if (!prev) {
            prev = agg;
        }

        var name = getName(agg.id);
        var selector = '#' + type + '-row-' + name;
        var element = $('<tr id="' + type + '-row-' + name + '"></tr>');
        element.append('<td>' + name.toUpperCase().replace(new RegExp('-', 'g'), ' ') + '</td>');
        element.append('<td class="' + getChangedClass(getAdded(prev), getAdded(agg)) + '">' + getAdded(agg) + '</td>');
        element.append('<td class="' + getChangedClass(prev.orderCount, agg.orderCount) + ' total">' + agg.orderCount + '</td>');
        element.append('<td class="' + getChangedClass(prev.orderCountByStatus.CREATED, agg.orderCountByStatus.CREATED) + '">' + nvl(agg.orderCountByStatus.CREATED) + '</td>');
        element.append('<td class="' + getChangedClass(prev.orderCountByStatus.PREPARED, agg.orderCountByStatus.PREPARED) + '">' + nvl(agg.orderCountByStatus.PREPARED) + '</td>');
        element.append('<td class="' + getChangedClass(prev.orderCountByStatus.DELIVERED, agg.orderCountByStatus.DELIVERED) + '">' + nvl(agg.orderCountByStatus.DELIVERED) + '</td>');

        if ($(selector).length) {
            $(selector).html(element.html());
        } else {
            $('.' + type + ' table').append(element);
        }

        previousAggregations[agg.id] = agg;
    }

    function getChangedClass(prev, actual) {
        if (prev != actual) {
            return 'changed';
        }
        return '';
    }

    function getAdded(agg) {
        var id = agg.id;

        if (!(id in baseAggregations)) {
            baseAggregations[id] = agg;
            return 0;
        }

        var base = baseAggregations[id];
        var added = agg.orderCount - base.orderCount;
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