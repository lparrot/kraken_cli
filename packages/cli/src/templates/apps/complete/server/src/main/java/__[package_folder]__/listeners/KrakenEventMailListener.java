package <%= package %>.listeners;

import fr.intradef.cdadr.socle.mail.events.SocleMailEvent;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component
public class KrakenEventMailListener implements ApplicationListener<SocleMailEvent> {

	@Autowired
	private ResourceLoader resourceLoader;

	@Override
	@SneakyThrows
	public void onApplicationEvent(final SocleMailEvent event) {
		switch (event.getType()) {
			case BEFORE_SEND_MAIL:
				final MimeMessageHelper messageHelper = (MimeMessageHelper) event.getData();
				messageHelper.addInline("logo", this.resourceLoader.getResource("classpath:mail/logo.png"), "image/png");
				break;
			default:
				break;
		}
	}

}
