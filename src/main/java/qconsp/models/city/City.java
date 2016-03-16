package qconsp.models.city;

import io.yawp.repository.IdRef;
import io.yawp.repository.annotations.Endpoint;
import io.yawp.repository.annotations.Id;

@Endpoint(path = "/cities")
public class City {

    @Id
    IdRef<City> id;

    Integer orderCount = 0;

    public void incrementOrderCount() {
        orderCount++;
    }

    public void decrementOrderCount() {
        orderCount--;
    }

}
