package qconsp.models.city;

import io.yawp.repository.IdRef;
import io.yawp.repository.annotations.Endpoint;
import io.yawp.repository.annotations.Id;
import io.yawp.repository.annotations.Json;
import qconsp.models.order.Status;
import qconsp.models.state.State;

import java.util.HashMap;
import java.util.Map;

@Endpoint(path = "/cities")
public class City {

    @Id
    IdRef<City> id;

    IdRef<State> stateId;

    Integer orderCount = 0;

    @Json
    Map<Status, Integer> orderCountByStatus = new HashMap<>();

    public IdRef<State> getStateId() {
        return stateId;
    }

    public void incrementOrderCount() {
        orderCount++;
    }

    public void decrementOrderCount() {
        orderCount--;
    }

    public Integer getOrderCount() {
        return orderCount;
    }

    public void incrementOrderCountByStatus(Status status) {
        if (!orderCountByStatus.containsKey(status)) {
            orderCountByStatus.put(status, 0);
        }
        Integer newCount = orderCountByStatus.get(status) + 1;
        orderCountByStatus.put(status, newCount);
    }

    public void decrementOrderCountByStatus(Status status) {
        Integer newCount = orderCountByStatus.get(status) - 1;
        orderCountByStatus.put(status, newCount);
    }

    public Integer getOrderCountByStatus(Status status) {
        if (!orderCountByStatus.containsKey(status)) {
            return 0;
        }
        return orderCountByStatus.get(status);
    }
}
