package qconsp.models.order;

import io.yawp.repository.IdRef;
import io.yawp.repository.annotations.Endpoint;
import io.yawp.repository.annotations.Id;

@Endpoint(path = "/orders")
public class Order {

    @Id
    IdRef<Order> id;

    public String city;

}
