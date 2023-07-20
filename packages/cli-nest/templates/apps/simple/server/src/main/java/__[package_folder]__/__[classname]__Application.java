package <%= package %>;

import fr.intradef.cdadr.socle.core.annotations.EnableSocle;
import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@EnableSocle
@SpringBootApplication
public class <%= classname %>Application extends SpringBootServletInitializer {

	public static void main(String[] args) {
		final SpringApplication app = new SpringApplication(<%= classname %>Application.class);
		app.setBannerMode(Banner.Mode.OFF);
		app.run(args);
	}

}
