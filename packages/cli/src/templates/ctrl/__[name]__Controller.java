<%- include ('package') %>
import fr.intradef.cdadr.socle.core.controller.AbstractController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("<%= url %>")
public class <%= name %>Controller extends AbstractController {

	private final <%= name %>Service service;

	public <%= name %>Controller(<%= name %>Service service) {
		this.service = service;
	}

	@GetMapping
	public ResponseEntity<?> get() {
		return ok();
	}

}
