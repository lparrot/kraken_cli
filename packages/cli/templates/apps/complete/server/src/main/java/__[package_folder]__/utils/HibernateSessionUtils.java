package <%= package %>.utils;

import fr.intradef.cdadr.socle.core.utils.SpringUtils;
import lombok.experimental.UtilityClass;
import org.hibernate.internal.SessionImpl;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.ManagedType;
import java.lang.reflect.Modifier;

@UtilityClass
public class HibernateSessionUtils {

	public ManagedType<?> getEntityByName(String entityName) {
		return HibernateSessionUtils.getSession().getMetamodel().getManagedTypes().stream()
			.filter(managedType -> !Modifier.isAbstract(managedType.getJavaType().getModifiers()))
			.filter(managedType -> managedType.getJavaType().getSimpleName().equals(entityName))
			.findFirst().orElse(null);
	}

	public SessionImpl getSession() {
		return SpringUtils.getBean(EntityManager.class).unwrap(SessionImpl.class);
	}

}
