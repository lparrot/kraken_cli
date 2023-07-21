package <%= package_name %>;

import com.fasterxml.jackson.annotation.JsonFormat;
import fr.intradef.cdadr.socle.core.interfaces.IIdentifiableEntity;
import lombok.Getter;
import lombok.Setter;

/**
 * Ressource du référentiel pour l'entité {@link <%= entity_full_name %>}
 */
@Getter
@Setter
public class Ref<%= entity_name %>Resource implements IIdentifiableEntity<<%= id_type %>> {

  private <%= id_type %> id;
<% fields.forEach(function(field){ -%>
  <%_ if (field.type === 'java.time.LocalDate') { -%>
  @JsonFormat(pattern = "dd/MM/yyyy")
  <%_ } else if (field.type === 'java.time.LocalDateTime') { -%>
  @JsonFormat(pattern = "dd/MM/yyyy HH:mm")
  <%_ } -%>
  private <%= field.type %> <%= field.name %>;
<% }) -%>

}
