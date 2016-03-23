package qconsp.models.aggretations;

import io.yawp.repository.annotations.Json;
import qconsp.models.order.Status;

import java.util.HashMap;
import java.util.Map;

public class OrderAggregation {

    Integer orderCount = 0;

    @Json
    Map<Status, Integer> orderCountByStatus = new HashMap<>();

    public void incrementOrderCount(Integer orderCount) {
        this.orderCount += orderCount;
    }

    public void decrementOrderCount(Integer orderCount) {
        this.orderCount -= orderCount;
    }

    public Integer getOrderCount() {
        return orderCount;
    }

    public void incrementOrderCountByStatus(Status status, Integer orderCount) {
        if (!orderCountByStatus.containsKey(status)) {
            orderCountByStatus.put(status, 0);
        }
        Integer newCount = orderCountByStatus.get(status) + orderCount;
        orderCountByStatus.put(status, newCount);
    }

    public void decrementOrderCountByStatus(Status status, Integer orderCount) {
        Integer newCount = orderCountByStatus.get(status) - orderCount;
        orderCountByStatus.put(status, newCount);
    }

    public Integer getOrderCountByStatus(Status status) {
        if (!orderCountByStatus.containsKey(status)) {
            return 0;
        }
        return orderCountByStatus.get(status);
    }

    public void drain() {
        this.orderCount = 0;
        this.orderCountByStatus = new HashMap<>();
    }
}
