module.exports = (function () {

    const BACKEND_API = process.env.QCON2016_API;

    var yawp = require('./lib/yawp');

    yawp.config(function (c) {
        //c.baseUrl(BACKEND_API ? BACKEND_API : 'http://localhost:8080/api');
        c.baseUrl('http://localhost:8080/api');
    });

    function run() {
        loadCities();
    }

    function loadCities() {
        var sp = [{
            id: '/cities/sao-paulo',
            stateId: '/states/sp'
        }, {
            id: '/cities/campinas',
            stateId: '/states/sp'
        }, {
            id: '/cities/jundiai',
            stateId: '/states/sp'
        }, {
            id: '/cities/limeira',
            stateId: '/states/sp'
        }, {
            id: '/cities/piracicaba',
            stateId: '/states/sp'
        }, {
            id: '/cities/santos',
            stateId: '/states/sp'
        }, {
            id: '/cities/itu',
            stateId: '/states/sp'
        }, {
            id: '/cities/indaiatuba',
            stateId: '/states/sp'
        }, {
            id: '/cities/jaguariuna',
            stateId: '/states/sp'
        }];

        var rj = [{
            id: '/cities/rio-de-janeiro',
            stateId: '/states/rj'
        }, {
            id: '/cities/volta-redonda',
            stateId: '/states/rj'
        }, {
            id: '/cities/petropolis',
            stateId: '/states/rj'
        }, {
            id: '/cities/sao-goncalo',
            stateId: '/states/rj'
        }, {
            id: '/cities/saquarema',
            stateId: '/states/rj'
        }, {
            id: '/cities/teresopolis',
            stateId: '/states/rj'
        }, {
            id: '/cities/macae',
            stateId: '/states/rj'
        }, {
            id: '/cities/parati',
            stateId: '/states/rj'
        }, {
            id: '/cities/duque-de-caxias',
            stateId: '/states/rj'
        }];

        yawp('/cities').create(sp).fail(failLog);
        yawp('/cities').create(rj).fail(failLog);
    }

    function failLog(err) {
        console.log('err', err);
    }

    return {
        run: run
    };

})();

var loadCities = require('./load-cities.js');

if (require.main === module) {
    loadCities.run();
}
