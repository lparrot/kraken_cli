<template>
  <section class="container-fluid">
    <referentiel state-id="<%= ref_state_name %>" state-provider="localstorage" url="<%= url %>">
      <%_ if (template === 'crud') { -%>
      <template #modal-edit="{selected}">
        <%_ fields.forEach(function(field){ -%>
        <%- include('ref_page_field', {field: field}) -%>
        <%_ }) -%>
      </template>
      <%_ }; -%>
      <%_ if (template === 'simple') { -%>
      <template #modal-show="{selected}">
        <dl>
          <%_ fields.forEach(function(field){ -%>
          <dt><%= field.label %></dt>
          <dd>{{ selected.<%= field.name %> }}</dd>
          <%_ }) -%>
        </dl>
      </template>
      <%_ }; -%>
    </referentiel>
  </section>
</template>

<script>
import {DatePicker, Referentiel} from '@socle/ui/bootstrap'

export default {
  head: {
    title: '<%= page_title %>'
  },

  components: {
    DatePicker,
    Referentiel,
  },

  data() {
    return {}
  },

  async fetch() {

  },

  methods: {}
}
</script>
