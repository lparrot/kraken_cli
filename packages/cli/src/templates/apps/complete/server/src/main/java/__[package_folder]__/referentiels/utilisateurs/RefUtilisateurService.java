package <%= package %>.referentiels.utilisateurs;

import <%= package %>.dao.ProfilDao;
import fr.intradef.cdadr.socle.security.services.SecurityService;
import fr.intradef.cdadr.socle.ui.referentiel.AbstractCrudReferentielService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import <%= package %>.entity.Utilisateur;
import <%= package %>.dao.UtilisateurDao;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Map;

/**
 * Service du référentiel pour l'entité {@link <%= package %>.entity.Utilisateur}
 */
@Service
public class RefUtilisateurService extends AbstractCrudReferentielService<Utilisateur, Long, RefUtilisateurResource, UtilisateurDao> {
	private final ProfilDao profilDao;
	private final SecurityService securityService;

	public RefUtilisateurService(ProfilDao profilDao, SecurityService securityService) {
		this.profilDao = profilDao;
		this.securityService = securityService;
	}

	@Override
	public Page<?> findAll(Pageable pageable, Specification<Utilisateur> specification, Map<String, String> requestParameters) {

		specification = specification.and((root, q, cb) -> cb.isNull(root.get("dateSuppression")));

		return repository.findAll(specification, pageable);
	}

	@Override
	public void assign(RefUtilisateurResource resource, Utilisateur entity) {
		entity.setUsername(resource.getUsername());
		entity.setEmail(resource.getEmail());
		entity.setProfil(profilDao.findById(resource.getProfilId()).orElse(null));
	}

	@Override
	public void create(Utilisateur entity) {
		securityService.createUser(entity, null, args -> {
			args.setSendEmail(true);
			args.setChangePasswordFirstConnection(true);
		});
	}

	@Override
	public void update(Utilisateur entity) {
		repository.save(entity);
	}

	@Override
	public void delete(Long id) {
		Utilisateur utilisateur = repository.findById(id).orElseThrow(EntityNotFoundException::new);
		utilisateur.remove();
		repository.save(utilisateur);
	}
}
