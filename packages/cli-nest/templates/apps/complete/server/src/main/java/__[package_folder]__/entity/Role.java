package <%= package %>.entity;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
	ADMIN,
	USER,
	INVITED;

	@Override
	public String getAuthority() {
		return this.name();
	}
}
