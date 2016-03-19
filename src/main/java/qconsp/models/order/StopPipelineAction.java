package qconsp.models.order;

import com.google.appengine.tools.pipeline.NoSuchObjectException;
import com.google.appengine.tools.pipeline.PipelineService;
import com.google.appengine.tools.pipeline.PipelineServiceFactory;
import io.yawp.commons.http.HttpException;
import io.yawp.commons.http.annotation.GET;
import io.yawp.repository.actions.Action;

import java.util.Map;

public class StopPipelineAction extends Action<Order> {

    @GET
    public String stopPipeline(Map<String, String> params) {
        PipelineService service = PipelineServiceFactory.newPipelineService();

        String id = params.get("id");
        if (id == null) {
            return "fail";
        }

        try {
            service.stopPipeline(id);
        } catch (NoSuchObjectException e) {
            throw new HttpException(404);
        }

        return id;
    }
}
