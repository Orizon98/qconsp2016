(function ($) {

    function throughputPulling() {
        yawp('/throughputs').list(function (ts) {
            var total = 0;
            ts.forEach(function (t) {
                total += t.value;
                $('#global-throughput-' + getStatus(t.id)).html(t.value);
            });

            $('#global-throughput').html(total);

            setTimeout(throughputPulling, 2000);
        });

        function getStatus(id) {
            return id.substring(id.lastIndexOf('/') + 1);
        }
    }

    $(document).ready(function () {
        throughputPulling();
    });


})(jQuery);