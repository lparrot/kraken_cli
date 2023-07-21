package <%= package %>.entity;

import fr.intradef.cdadr.socle.ui.recherche.IRechercheEntity;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@Accessors(chain = true)
public class Profil implements IRechercheEntity<Long> {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String libelle;

	@Fetch(FetchMode.JOIN)
	@ElementCollection
	@Column(name = "role")
	@Enumerated(EnumType.STRING)
	@CollectionTable(name = "profil_role", foreignKey = @ForeignKey(name = "FK_profil_role"))
	private Set<Role> roles = new HashSet<>();

	@Override
	public String getSearchLabel() {
		return getLibelle();
	}

}
