package qconsp.models.state;

import io.yawp.repository.pipes.Pipe;
import qconsp.models.city.City;
import qconsp.models.order.Status;

public class CityToStatePipe extends Pipe<City, State> {

    @Override
    public void configureSinks(City city) {
        addSinkId(city.getStateId());
    }

    @Override
    public void flux(City city, State state) {
        state.incrementOrderCount(city.getOrderCount());

        for (Status status : Status.values()) {
            state.incrementOrderCountByStatus(status, city.getOrderCountByStatus(status));
        }
    }

    @Override
    public void reflux(City city, State state) {
        state.decrementOrderCount(city.getOrderCount());

        for (Status status : Status.values()) {
            state.decrementOrderCountByStatus(status, city.getOrderCountByStatus(status));
        }
    }

}
