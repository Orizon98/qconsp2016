package qconsp.models.state;

import org.junit.Test;
import qconsp.utils.EndpointTestCase;

import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;
import static qconsp.models.order.Status.*;

public class StateTest extends EndpointTestCase {

    @Test
    public void testCityToStatePipe() {
        post("/cities/sao-paulo", "{ stateId: '/states/sp', orderCount: 10, orderCountByStatus: { CREATED: 5, PREPARING: 3, DELIVERED: 2 } }");
        awaitAsync(20, TimeUnit.SECONDS);

        String json = get("/states/sp");
        State state = from(json, State.class);

        assertEquals((Integer) 10, state.getOrderCount());
        assertEquals((Integer) 5, state.getOrderCountByStatus(CREATED));
        assertEquals((Integer) 3, state.getOrderCountByStatus(PREPARED));
        assertEquals((Integer) 2, state.getOrderCountByStatus(DELIVERED));
    }

}
