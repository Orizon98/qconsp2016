package qconsp.models.throughput;

import io.yawp.repository.IdRef;
import io.yawp.repository.annotations.Endpoint;
import io.yawp.repository.annotations.Id;

@Endpoint(path = "/throughputs")
public class Throughput {

    @Id
    IdRef<Throughput> id;

    Integer value;

    Long timestamp;

}
