<%- include ('package') %>
import org.quartz.DisallowConcurrentExecution;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.springframework.stereotype.Service;

@Service
@DisallowConcurrentExecution
public class <%=timer_class%> implements Job {

	@Override
	public void execute(JobExecutionContext jobExecutionContext){
		//
	}

}
