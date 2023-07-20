package <%= package %>.entity;

import fr.intradef.cdadr.socle.security.models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;

import javax.persistence.*;
import java.util.Collection;

@Entity
@Getter
@Setter
@Accessors(chain = true)
public class Utilisateur extends User<Long> {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(foreignKey = @ForeignKey(name = "FK_utilisateur_profil"))
	private Profil profil;

	@Override
	public Claims getClaims() {
		Claims claims = Jwts.claims();
		claims.setSubject(this.getUsername());
		claims.put("email", this.getEmail());
		return claims;
	}

	@Override
	public boolean isAdministrator() {
		return true;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return this.profil == null ? AuthorityUtils.NO_AUTHORITIES : this.profil.getRoles();
	}
}
