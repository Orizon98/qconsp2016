package qconsp.models.order;

import org.junit.Test;
import qconsp.utils.EndpointTestCase;

import static org.junit.Assert.assertEquals;

public class OrderTest extends EndpointTestCase {

    @Test
    public void testCreate() {
        String json = post("/orders", "{ city: 'sao-paulo' }");
        Order order = from(json, Order.class);

        assertEquals("sao-paulo", order.city);
    }

}
