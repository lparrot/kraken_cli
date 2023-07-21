package <%= package %>.config.jpa;

import <%= package %>.entity.Utilisateur;
import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

public class SpringSecurityAuditorAware implements AuditorAware<Utilisateur> {

	@Override
	public Optional<Utilisateur> getCurrentAuditor() {
		return Optional.ofNullable(SecurityContextHolder.getContext())
			.map(SecurityContext::getAuthentication)
			.filter(Authentication::isAuthenticated)
			.map(Authentication::getPrincipal)
			.filter(o -> !"anonymousUser".equals(o))
			.map(Utilisateur.class::cast);
	}
}
