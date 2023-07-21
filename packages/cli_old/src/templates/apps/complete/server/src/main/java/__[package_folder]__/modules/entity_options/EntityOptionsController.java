package <%= package %>.modules.entity_options;

import fr.intradef.cdadr.socle.core.controller.AbstractController;
import fr.intradef.cdadr.socle.ui.dto.TextValueDto;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/entity_options")
public class EntityOptionsController extends AbstractController {

	private final EntityOptionsService entityOptionsService;

	public EntityOptionsController(EntityOptionsService entityOptionsService) {
		this.entityOptionsService = entityOptionsService;
	}

	@GetMapping
	@PreAuthorize("isFullyAuthenticated() && (#roles == null || (#roles != null && hasAnyAuthority(#roles)))")
	public ResponseEntity<List<TextValueDto>> get(
		@RequestParam("entity") String entity,
		@RequestParam("textField") String textField,
		@RequestParam(value = "valueField", required = false) String valueField,
		@RequestParam(value = "roles", required = false) String[] roles,
		Pageable page) {
		return ok(entityOptionsService.getList(entity, textField, valueField, page));
	}
}
