package qconsp.models.city;

import org.junit.Test;
import qconsp.models.state.State;
import qconsp.utils.EndpointTestCase;

import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;

public class CityTest extends EndpointTestCase {

    @Test
    public void testCreate() {
        String json = post("/cities/sao-paulo", "{ stateId: '/states/sp' }");
        City city = from(json, City.class);

        assertEquals(id(State.class, "sp"), city.stateId);
    }

    @Test
    public void testCityPipe() {
        post("/cities/sao-paulo", "{ stateId: '/states/sp', orderCount: 10 }");
        awaitAsync(20, TimeUnit.SECONDS);

        String json = get("/states/sp");
        State state = from(json, State.class);

        assertEquals((Integer) 10, state.getOrderCount());
    }

}
