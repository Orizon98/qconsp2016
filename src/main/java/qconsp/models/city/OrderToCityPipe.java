package qconsp.models.city;

import io.yawp.repository.pipes.Pipe;
import qconsp.models.order.Order;

public class OrderToCityPipe extends Pipe<Order, City> {

    @Override
    public void configureSinks(Order order) {
        addSinkId(order.getCityId());
    }

    @Override
    public void flux(Order order, City city) {
        city.incrementOrderCount();
        city.incrementOrderCountByStatus(order.getStatus());
    }

    @Override
    public void reflux(Order order, City city) {
        city.decrementOrderCount();
        city.decrementOrderCountByStatus(order.getStatus());
    }

}
