package qconsp.models.state;

import io.yawp.repository.IdRef;
import io.yawp.repository.annotations.Endpoint;
import io.yawp.repository.annotations.Id;

@Endpoint(path = "/states")
public class State {

    @Id
    IdRef<State> id;

    Integer orderCount = 0;

    public void incrementOrderCount(Integer cityOrderCount) {
        this.orderCount += cityOrderCount;
    }

    public void decrementOrderCount(Integer cityOrderCount) {
        this.orderCount -= cityOrderCount;
    }

    public Integer getOrderCount() {
        return orderCount;
    }
}
