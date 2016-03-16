package qconsp.models.state;

import io.yawp.repository.IdRef;
import io.yawp.repository.annotations.Endpoint;
import io.yawp.repository.annotations.Id;

@Endpoint(path = "/states")
public class State {

    @Id
    IdRef<State> id;

    Integer orderCount = 0;

    public void incrementOrderCount(Integer orderCount) {
        this.orderCount += orderCount;
    }

    public void decrementOrderCount(Integer orderCount) {
        this.orderCount -= orderCount;
    }

    public Integer getOrderCount() {
        return orderCount;
    }
}
