package <%= package %>.config;

import fr.intradef.cdadr.socle.security.SocleSecurityConfiguration;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

@Configuration
public class KrakenSecurityConfig extends SocleSecurityConfiguration {

	public KrakenSecurityConfig() {
		// super.addPermitUrl(HttpMethod.GET, "/api/xx/**");
		// super.addPermitUrl(HttpMethod.POST, "/api/xx/**");
	}

}
