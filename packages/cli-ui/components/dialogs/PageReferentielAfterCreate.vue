<script lang="ts" setup>
import {useApiStore} from "~/store/api";
import {useStateStore} from "~/store/state";
import {useDialogPluginComponent} from "quasar";
import stringcase from "stringcase";
import kebabCase from "lodash/kebabCase";

const $q = useQuasar()
const $api = useApiStore()
const $state = useStateStore()

const {referentiel} = defineProps<{
  referentiel: any
}>()

defineEmits([
  ...useDialogPluginComponent.emits
])

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

const content_read = computed(() => {
  return `
    <template>
      <referentiel state-id="ref_${stringcase.snakecase(kebabCase(referentiel.url))}" state-provider="localstorage" url="${referentiel.url}">

      </referentiel>
    </template>

    <script>
      import { Referentiel } from '@socle/ui/bootstrap'

      export default {
        components: {
          Referentiel
        }
      }
    <\/script>
  `
})

const content_crud = computed(() => {
  return `
    <template>
      <referentiel state-id="ref_${stringcase.snakecase(kebabCase(referentiel.url))}" state-provider="localstorage" url="${referentiel.url}">

        <template #modal-edit="{selected}">
          <validation-provider #default="{errors, valid}" name="" rules="required">
              <b-form-group :invalid-feedback="errors[0]" :state="valid" label="">
                <b-form-input v-model="selected." :state="valid"/>
              </b-form-group>
          </validation-provider>
        </template>

      </referentiel>
    </template>

    <script>
      import { Referentiel } from '@socle/ui/bootstrap'

      export default {
        components: {
          Referentiel
        }
      }
    <\/script>
  `
})
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 75vw">
      <q-card-section>
        <div class="text-subtitle2">Copier ce code dans une page <code class="text-italic text-blue-5">.vue</code> pour ajouter le composant, puis modifiez et complétez les éléments de la modale d'édition dans le template <code class="text-italic text-blue-5">#modal-edit</code></div>
        <div class="row items-end q-gutter-sm text-orange-5">
          <q-icon name="warning" size="sm"></q-icon>
          <div>N'oubliez pas de modifier le controlleur et la projection puis relancer votre serveur afin que le webservice soit disponible</div>
        </div>
        <Highlight :content="referentiel.template === 'crud' ? content_crud : content_read" lang="markup"/>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn color="primary" label="Fermer" @click="onDialogOK"/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style scoped>

</style>
