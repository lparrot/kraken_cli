package <%= package %>.listeners;

import fr.intradef.cdadr.socle.core.events.SocleCoreEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class KrakenEventCoreListener implements ApplicationListener<SocleCoreEvent> {

	@Override
	public void onApplicationEvent(final SocleCoreEvent event) {
		KrakenEventCoreListener.log.trace("({}) {}: {}", event.getSource(), event.getType(), event.getData());
	}

}
