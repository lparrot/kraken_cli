package <%= package %>.referentiels.utilisateurs;

import <%= package %>.entity.Profil;
import fr.intradef.cdadr.socle.ui.recherche.RechercheFieldTypeEnum;
import fr.intradef.cdadr.socle.ui.recherche.RechercheOperatorEnum;
import fr.intradef.cdadr.socle.ui.referentiel.AbstractCrudReferentielController;
import fr.intradef.cdadr.socle.ui.referentiel.Referentiel;
import fr.intradef.cdadr.socle.ui.referentiel.TableDto;
import fr.intradef.cdadr.socle.ui.referentiel.TableFieldDto;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;

/**
 * Controlleur du référentiel pour l'entité {@link <%= package %>.entity.Utilisateur}
 */
@RestController
@RequestMapping("/api/referentiels/utilisateurs")
@Referentiel(useProjection = RefUtilisateurProjection.class)
public class RefUtilisateurController extends AbstractCrudReferentielController<Long, RefUtilisateurResource, RefUtilisateurService> {

	@Override
	public TableDto table() {
		return TableDto.builder()
			.field(TableFieldDto.builder().field("username").label("Nom d'utilisateur").searchable(RechercheFieldTypeEnum.STRING).defaultOperator(RechercheOperatorEnum.CONTAINS).build())
			.field(TableFieldDto.builder().field("email").label("E-mail").searchable(RechercheFieldTypeEnum.STRING).defaultOperator(RechercheOperatorEnum.CONTAINS).build())
			.field(TableFieldDto.builder().field("profil").label("Profil").searchable(RechercheFieldTypeEnum.ENTITY).entityClass(Profil.class).entitySearchFields(Arrays.asList("libelle")).build())
			.build();
	}

}
