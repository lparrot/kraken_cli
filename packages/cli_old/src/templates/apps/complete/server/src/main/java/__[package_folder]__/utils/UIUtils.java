package <%= package %>.utils;

import fr.intradef.cdadr.socle.ui.dto.TextValueDto;
import lombok.experimental.UtilityClass;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@UtilityClass
public class UIUtils {

	public <T> List<TextValueDto> convertToBootstrapVueOptions(List<T> liste, Function<T, String> text, Function<T, Object> value) {
		return liste.stream().map(it -> new TextValueDto(text.apply(it), value.apply(it))).collect(Collectors.toList());
	}

}
