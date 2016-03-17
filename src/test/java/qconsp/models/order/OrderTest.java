package qconsp.models.order;

import org.junit.Before;
import org.junit.Test;
import qconsp.models.city.City;
import qconsp.utils.EndpointTestCase;

import static org.junit.Assert.assertEquals;

public class OrderTest extends EndpointTestCase {

    @Before
    public void fixtures() {
        post("/cities/sao-paulo", "{ stateId: '/states/sp' }");
    }

    @Test
    public void testCreate() {
        String json = post("/orders", "{ cityId: '/cities/sao-paulo' }");
        Order order = from(json, Order.class);

        assertEquals(id(City.class, "sao-paulo"), order.cityId);
    }

}
