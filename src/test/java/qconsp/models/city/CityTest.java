package qconsp.models.city;

import org.junit.Before;
import org.junit.Test;
import qconsp.models.state.State;
import qconsp.utils.EndpointTestCase;

import java.util.concurrent.TimeUnit;

import static org.junit.Assert.assertEquals;

public class CityTest extends EndpointTestCase {

    @Before
    public void fixtures() {
        post("/cities/sao-paulo", "{ stateId: '/states/sp' }");
    }

    @Test
    public void testCreate() {
        String json = post("/cities/sao-paulo", "{ stateId: '/states/sp' }");
        City city = from(json, City.class);

        assertEquals(id(State.class, "sp"), city.stateId);
    }

    @Test
    public void testCityPipe() {
        post("/orders", "{ cityId: '/cities/sao-paulo' }");
        awaitAsync(20, TimeUnit.SECONDS);

        String json = get("/cities/sao-paulo");
        City city = from(json, City.class);

        assertEquals((Integer) 1, city.getOrderCount());
    }

}
