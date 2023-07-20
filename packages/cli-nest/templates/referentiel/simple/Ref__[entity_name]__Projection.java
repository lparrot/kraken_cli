package <%= package_name %>;

import com.fasterxml.jackson.annotation.JsonFormat;
import fr.intradef.cdadr.socle.core.interfaces.IIdentifiableEntity;

/**
 * Projection du référentiel pour l'entité {@link <%= entity_full_name %>}
 */
public interface Ref<%= entity_name %>Projection extends IIdentifiableEntity<<%= id_type %>> {

<% fields.forEach(function(field){ -%>
  <%_ if (field.type === 'java.time.LocalDate') { -%>
  @JsonFormat(pattern = "dd/MM/yyyy")
  <%_ } else if (field.type === 'java.time.LocalDateTime') { -%>
  @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
  <%_ } -%>
  <%= field.type %> get<%= field.name.charAt(0).toUpperCase() + field.name.slice(1) %>();
<% }) -%>

}
