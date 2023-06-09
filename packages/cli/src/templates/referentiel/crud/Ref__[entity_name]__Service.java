package <%= package_name %>;

import fr.intradef.cdadr.socle.ui.referentiel.AbstractCrudReferentielService;
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
public class Ref<%= entity_name %>Service extends AbstractCrudReferentielService<<%= entity_name %>, <%= id_type %>, Ref<%= entity_name %>Resource, <%= dao_name %>> {

	@Override
	public Page<?> findAll(Pageable pageable, Specification<<%= entity_name %>> specification, Map<String, String> requestParameters) {
		return repository.findAll(specification, pageable);
	}

	@Override
	public void assign(Ref<%= entity_name %>Resource resource, <%= entity_name %> entity) {
		// entity.set(resource.get());
	}

	@Override
	public void create(<%= entity_name %> entity) {
		repository.save(entity);
	}

	@Override
	public void update(<%= entity_name %> entity) {
		repository.save(entity);
	}

	@Override
	public void delete(<%= id_type %> id) {
		repository.deleteById(id);
	}

}
