package <%= package %>.listeners;

import fr.intradef.cdadr.socle.security.events.SocleSecurityEvent;
import <%= package %>.entity.Utilisateur;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

@Slf4j
@Service
public class KrakenEventSecurityListener implements ApplicationListener<SocleSecurityEvent> {

	@Override
	@Transactional
	public void onApplicationEvent(final SocleSecurityEvent event) {
		KrakenEventSecurityListener.log.trace("({}) {}: {}", event.getSource(), event.getType(), event.getData());

		switch (event.getType()) {
			case BEFORE_LOGIN:
				final Utilisateur data = (Utilisateur) event.getData();
				break;
		}
	}

}
