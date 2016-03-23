package qconsp.models.order;

import io.yawp.repository.IdRef;
import io.yawp.repository.shields.Shield;

import java.util.List;

public class OrderShield extends Shield<Order> {

    @Override
    public void create(List<Order> objects) {
        allow();
    }

    @Override
    public void update(IdRef<Order> id, Order object) {
        allow();
    }
}
