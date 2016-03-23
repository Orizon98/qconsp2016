
package qconsp.models.city;

import io.yawp.repository.IdRef;
import io.yawp.repository.shields.Shield;

import java.util.List;

public class CityShield extends Shield<City> {

    @Override
    public void create(List<City> objects) {
        allow(!isProduction());
    }

    @Override
    public void show(IdRef<City> id) {
        allow();
    }

    @Override
    public void index(IdRef<?> parentId) {
        allow();
    }

    private boolean isProduction() {
        return yawp.driver().environment().isProduction();
    }

}
