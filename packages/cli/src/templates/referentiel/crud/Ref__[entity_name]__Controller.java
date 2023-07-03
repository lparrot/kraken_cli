package <%= package_name %>;

import fr.intradef.cdadr.socle.ui.referentiel.AbstractCrudReferentielController;
import fr.intradef.cdadr.socle.ui.referentiel.Referentiel;
import fr.intradef.cdadr.socle.ui.referentiel.TableDto;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlleur du référentiel pour l'entité {@link <%= entity_full_name %>}
 */
@RestController
@RequestMapping("<%= url %>")
@Referentiel(useProjection = Ref<%= entity_name %>Projection.class)
public class Ref<%= entity_name %>Controller extends AbstractCrudReferentielController<<%= id_type %>, Ref<%= entity_name %>Resource, Ref<%= entity_name %>Service> {

  @Override
	public TableDto table() {
		return TableDto.builder()
		  <% fields.forEach(function(field){ %>.field(TableFieldDto.builder().field("<%= field.name %>").sortable(true).searchable(RechercheFieldTypeEnum.STRING).build())
		  <% }); %>.build();
	}

}
