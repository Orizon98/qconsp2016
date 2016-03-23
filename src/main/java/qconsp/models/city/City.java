package qconsp.models.city;

import io.yawp.repository.IdRef;
import io.yawp.repository.annotations.Endpoint;
import io.yawp.repository.annotations.Id;
import qconsp.models.aggretations.OrderAggregation;
import qconsp.models.state.State;

@Endpoint(path = "/cities")
public class City extends OrderAggregation {

    @Id
    IdRef<City> id;

    IdRef<State> stateId;

    public IdRef<State> getStateId() {
        return stateId;
    }

}
