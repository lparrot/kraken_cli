package <%= package %>.dao;

import <%= package %>.entity.Utilisateur;
import fr.intradef.cdadr.socle.database.repositories.PagingAndSpecificationRepository;
import fr.intradef.cdadr.socle.security.repositories.SecurityUserRepository;

public interface UtilisateurDao extends SecurityUserRepository<Utilisateur, Long>, PagingAndSpecificationRepository<Utilisateur, Long> {
}
