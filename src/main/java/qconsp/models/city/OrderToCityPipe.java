package qconsp.models.city;

import io.yawp.repository.pipes.Pipe;
import qconsp.models.order.Order;

public class OrderToCityPipe extends Pipe<Order, City> {

    @Override
    public String getQueueName() {
        return "order-to-city-pipe";
    }

    @Override
    public void configureSinks(Order order) {
        addSinkId(order.getCityId());
    }

    @Override
    public void flux(Order order, City city) {
        city.incrementOrderCount(1);
        city.incrementOrderCountByStatus(order.getStatus(), 1);
    }

    @Override
    public void reflux(Order order, City city) {
        city.decrementOrderCount(1);
        city.decrementOrderCountByStatus(order.getStatus(), 1);
    }

    @Override
    public void drain(City city) {
        city.drain();
    }
}
