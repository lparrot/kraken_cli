package <%= package %>.dao;

import <%= package %>.entity.Profil;
import fr.intradef.cdadr.socle.database.repositories.PagingAndSpecificationRepository;

public interface ProfilDao extends PagingAndSpecificationRepository<Profil, Long> {
}
