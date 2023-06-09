package <%= package %>;

import com.google.common.collect.Sets;
import <%= package %>.dao.ProfilDao;
import <%= package %>.dao.UtilisateurDao;
import <%= package %>.entity.Profil;
import <%= package %>.entity.Role;
import <%= package %>.entity.Utilisateur;
import fr.intradef.cdadr.socle.security.services.SecurityService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

@Service
public class DatabaseInitializer implements CommandLineRunner {

	private final UtilisateurDao utilisateurDao;
	private final ProfilDao profilDao;
	private final SecurityService securityService;

	public DatabaseInitializer(UtilisateurDao utilisateurDao, ProfilDao profilDao, SecurityService securityService) {
		this.utilisateurDao = utilisateurDao;
		this.profilDao = profilDao;
		this.securityService = securityService;
	}

	@Override
	public void run(String... args) {
		if (this.utilisateurDao.count() <= 0) {

			Profil profilAdmin = profilDao.save(new Profil().setLibelle("Administrateur").setRoles(Sets.newHashSet(Role.ADMIN, Role.USER)));
			Profil profilUser = profilDao.save(new Profil().setLibelle("Utilisateur").setRoles(Sets.newHashSet(Role.USER)));

			createUser("root", "root", "admin@noreply.com", profilAdmin);
			createUser("user", "user", "user@noreply.com", profilUser);
		}
	}

	public void createUser(String username, String password, String email, Profil profil) {
		Utilisateur root = new Utilisateur();
		root.setUsername(username);
		root.setEmail(email);
		root.setProfil(profil);

		this.securityService.createUser(root, password, params -> {
			params.setSendEmail(false);
			params.setPasswordVerification(false);
			params.setChangePasswordFirstConnection(false);
		});
	}

}
