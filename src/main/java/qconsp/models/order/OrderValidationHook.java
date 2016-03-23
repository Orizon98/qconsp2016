package qconsp.models.order;

import io.yawp.commons.http.HttpException;
import io.yawp.repository.hooks.Hook;

public class OrderValidationHook extends Hook<Order> {

    @Override
    public void beforeSave(Order order) {
        if (order.cityId == null) {
            throw new HttpException(400, "cityId can't be null");
        }
    }
}
