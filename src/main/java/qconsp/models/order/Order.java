package qconsp.models.order;

import io.yawp.repository.IdRef;
import io.yawp.repository.annotations.Endpoint;
import io.yawp.repository.annotations.Id;
import io.yawp.repository.annotations.Index;
import qconsp.models.city.City;

import static qconsp.models.order.Status.CREATED;

@Endpoint(path = "/orders")
public class Order {

    @Id
    IdRef<Order> id;

    IdRef<City> cityId;

    @Index
    Status status = CREATED;

    public IdRef<City> getCityId() {
        return cityId;
    }

    public Status getStatus() {
        return status;
    }
}
