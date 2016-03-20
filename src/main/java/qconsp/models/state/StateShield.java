package qconsp.models.state;

import io.yawp.repository.IdRef;
import io.yawp.repository.shields.Shield;

public class StateShield extends Shield<State> {

    @Override
    public void show(IdRef<State> id) {
        allow();
    }

    @Override
    public void index(IdRef<?> parentId) {
        allow();
    }
}
