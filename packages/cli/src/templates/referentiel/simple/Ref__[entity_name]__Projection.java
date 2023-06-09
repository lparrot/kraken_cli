package <%= package_name %>;

import fr.intradef.cdadr.socle.core.interfaces.IIdentifiableEntity;

/**
 * Projection du référentiel pour l'entité {@link <%= entity_full_name %>}
 */
public interface Ref<%= entity_name %>Projection extends IIdentifiableEntity<<%= id_type %>> {
}
