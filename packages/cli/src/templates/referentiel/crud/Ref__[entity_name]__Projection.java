package <%= package_name %>;

import fr.intradef.cdadr.socle.core.interfaces.IIdentifiableEntity;

/**
 * Projection du référentiel pour l'entité {@link <%= entity_full_name %>}
 */
public interface Ref<%= entity_name %>Projection extends IIdentifiableEntity<<%= id_type %>> {

  <% fields.forEach(function(field){ %>
  <%= field.type %> get<%= field.name.charAt(0).toUpperCase() + field.name.slice(1) %>();
  <% }); %>
}
