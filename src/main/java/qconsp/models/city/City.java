package qconsp.models.city;

import io.yawp.repository.IdRef;
import io.yawp.repository.annotations.Endpoint;
import io.yawp.repository.annotations.Id;
import qconsp.models.state.State;

@Endpoint(path = "/cities")
public class City {

    @Id
    IdRef<City> id;

    IdRef<State> stateId;

    Integer orderCount = 0;

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
}
