package <%= package %>.referentiels.utilisateurs;

import fr.intradef.cdadr.socle.core.interfaces.IIdentifiableEntity;
import org.springframework.beans.factory.annotation.Value;

/**
 * Projection du référentiel pour l'entité {@link <%= package %>.entity.Utilisateur}
 */
public interface RefUtilisateurProjection extends IIdentifiableEntity<Long> {

	String getUsername();

	String getEmail();

	@Value("#{target.profil?.id}")
	Long getProfilId();

	@Value("#{target.profil?.libelle}")
	String getProfilLibelle();

}
