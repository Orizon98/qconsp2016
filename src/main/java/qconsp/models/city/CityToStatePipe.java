package qconsp.models.city;

import io.yawp.repository.pipes.Pipe;
import qconsp.models.state.State;

public class CityToStatePipe extends Pipe<City, State> {

    @Override
    public void configureSinks(City city) {
        addSinkId(city.stateId);
    }

    @Override
    public void flux(City city, State state) {
        state.incrementOrderCount(city.orderCount);
    }

    @Override
    public void reflux(City city, State state) {
        state.decrementOrderCount(city.orderCount);
    }

}
