package <%= package_name %>;

import fr.intradef.cdadr.socle.ui.referentiel.AbstractReferentielService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import <%= entity_full_name %>;
import <%= dao_full_name %>;

import java.util.Map;

/**
 * Service du référentiel pour l'entité {@link <%= entity_full_name %>}
 */
@Service
public class Ref<%= entity_name %>Service extends AbstractReferentielService<<%= entity_name %>, <%= id_type %>, <%= dao_name %>> {

	@Override
	public Page<?> findAll(Pageable pageable, Specification<<%= entity_name %>> specification, Map<String, String> requestParameters) {
		return repository.findAll(specification, pageable);
	}

}
