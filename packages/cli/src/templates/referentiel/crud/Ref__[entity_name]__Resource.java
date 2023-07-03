package <%= package_name %>;

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
    <% fields.forEach(function(field){ %>private <%= field.type %> <%= field.name %>;
    <% }); %>
}
