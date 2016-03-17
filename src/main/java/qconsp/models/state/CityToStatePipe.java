package qconsp.models.state;

import io.yawp.repository.pipes.Pipe;
import qconsp.models.city.City;

public class CityToStatePipe extends Pipe<City, State> {

    @Override
    public void configureSinks(City city) {
        addSinkId(city.getStateId());
    }

    @Override
    public void flux(City city, State state) {
        state.incrementOrderCount(city.getOrderCount());
    }

    @Override
    public void reflux(City city, State state) {
        state.decrementOrderCount(city.getOrderCount());
    }

}
