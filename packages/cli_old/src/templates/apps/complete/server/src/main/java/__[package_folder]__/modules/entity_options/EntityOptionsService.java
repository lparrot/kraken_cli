package <%= package %>.modules.entity_options;

import <%= package %>.utils.HibernateSessionUtils;
import <%= package %>.utils.UIUtils;
import fr.intradef.cdadr.socle.core.exceptions.ApplicationException;
import fr.intradef.cdadr.socle.core.utils.ReflectUtils;
import fr.intradef.cdadr.socle.ui.dto.TextValueDto;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.support.Repositories;
import org.springframework.stereotype.Service;

import javax.persistence.metamodel.ManagedType;
import java.util.List;

@Service
public class EntityOptionsService {

	private final Repositories repositories;

	public EntityOptionsService(Repositories repositories) {
		this.repositories = repositories;
	}

	public List<TextValueDto> getList(String entityName, String textField, String valueField, Pageable page) {
		ManagedType<?> entity = HibernateSessionUtils.getEntityByName(entityName);

		Object repository = repositories.getRepositoryFor(entity.getJavaType()).orElse(null);

		if (repository instanceof JpaRepository) {
			return UIUtils.convertToBootstrapVueOptions(
				((JpaRepository<?, ?>) repository).findAll(),
				instance -> ReflectUtils.get(textField, instance),
				instance -> StringUtils.isNotBlank(valueField) ? ReflectUtils.get(valueField, instance) : instance
			);
		}

		throw new ApplicationException(String.format("Le repository de l'entité %s n'existe pas ou n'étend pas au minimum %s", entityName, JpaRepository.class.getSimpleName()));
	}
}
