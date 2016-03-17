package qconsp.models.state;

import org.junit.Test;
import qconsp.utils.EndpointTestCase;

import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;

public class StateTest extends EndpointTestCase {

    @Test
    public void testCityToStatePipe() {
        post("/cities/sao-paulo", "{ stateId: '/states/sp', orderCount: 10 }");
        awaitAsync(20, TimeUnit.SECONDS);

        String json = get("/states/sp");
        State state = from(json, State.class);

        assertEquals((Integer) 10, state.getOrderCount());
    }

}
