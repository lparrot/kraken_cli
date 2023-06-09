package <%= package %>.referentiels.utilisateurs;

import fr.intradef.cdadr.socle.core.interfaces.IIdentifiableEntity;
import lombok.Getter;
import lombok.Setter;

/**
 * Ressource du référentiel pour l'entité {@link <%= package %>.entity.Utilisateur}
 */
@Getter
@Setter
public class RefUtilisateurResource implements IIdentifiableEntity<Long> {

    private Long id;

		private String username;

		private String email;

		private Long profilId;

}
