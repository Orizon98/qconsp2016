package qconsp.models.order;

import io.yawp.repository.pipes.Pipe;
import qconsp.models.city.City;

public class OrderToCityPipe extends Pipe<Order, City> {

    @Override
    public void configureSinks(Order order) {
        addSinkId(order.cityId);
    }

    @Override
    public void flux(Order order, City city) {
        city.incrementOrderCount();
    }

    @Override
    public void reflux(Order order, City city) {
        city.decrementOrderCount();
    }

}
