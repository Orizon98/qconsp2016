package qconsp.models.order;

import io.yawp.commons.http.annotation.GET;
import io.yawp.repository.IdRef;
import io.yawp.repository.shields.Shield;

import java.util.List;
import java.util.Map;

public class OrderShield extends Shield<Order> {

    @Override
    public void index(IdRef<?> parentId) {
        allow();
    }

    @Override
    public void show(IdRef<Order> id) {
        allow();
    }

    @Override
    public void create(List<Order> objects) {
        allow();
    }

    @Override
    public void update(IdRef<Order> id, Order object) {
        allow();
    }

    @GET
    public void nextBatch(Map<String, String> params) {
        allow();
    }
}
