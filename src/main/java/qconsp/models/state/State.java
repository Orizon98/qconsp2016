package qconsp.models.state;

import io.yawp.repository.IdRef;
import io.yawp.repository.annotations.Endpoint;
import io.yawp.repository.annotations.Id;
import qconsp.models.order.OrderAggregation;

@Endpoint(path = "/states")
public class State extends OrderAggregation {

    @Id
    IdRef<State> id;

}
