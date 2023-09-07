<script lang="ts" setup>
const $state = useStateStore()
</script>

<template>
  <template v-if="$state.project != null && $state.appdata != null">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-1.5">
      <DashboardElement :description="$state.ping ? 'Démarré' : 'Arrêté'" icon="i-ic-baseline-troubleshoot" title="Statut du serveur Tomcat"/>
      <DashboardElement :description="$state.appdata?.socle_version" icon="i-mdi-numeric" icon-class="bg-purple-500" title="Version du socle"/>
      <DashboardElement :description="String($state.appdata?.entities?.length)" icon="i-mdi-database" icon-class="bg-orange-500" title="Entités"/>
    </div>
  </template>

  <div v-else>Veuillez selectionner un projet dans la liste ci-dessous, ou en créer un nouveau.</div>
</template>

<style scoped>

</style>
