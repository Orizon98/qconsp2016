package qconsp.models.order;

import io.yawp.repository.actions.Action;
import io.yawp.repository.query.QueryBuilder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class OrderBatchAction extends Action<Order> {

    public Object nextBatch(Map<String, String> params) {
        QueryBuilder<Order> q = createQuery(params);

        List<Order> orders = q.list();

        Map<String, Object> batch = new HashMap<>();
        batch.put("orders", orders);
        batch.put("cursor", q.getCursor());

        return batch;
    }

    private QueryBuilder<Order> createQuery(Map<String, String> params) {
        QueryBuilder<Order> q = yawp(Order.class).order("id");
        String status = params.get("status");
        if (status != null) {
            q.where("status", "=", Status.valueOf(status));
        }
        String cursor = params.get("cursor");
        if (cursor != null) {
            q.setCursor(cursor);
        }
        String limit = params.get("limit");
        if (limit != null) {
            q.limit(Integer.valueOf(limit));
        }
        return q;
    }

}
