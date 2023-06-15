<script lang="ts" setup>
import {QInput, useDialogPluginComponent} from 'quasar'
import {isBlank} from "~/utils/string.utils";

const props = defineProps({})

const {validate, setTouched} = useField('path')

defineEmits([
  ...useDialogPluginComponent.emits
])

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

const form = ref<{ path?: string, name?: string }>({})

function submitForm() {
  onDialogOK(form.value)
}

async function searchProjectFolder() {
  const folder = await useApiFetch('/api/fs/folder')
  if (folder != null) {
    const paths = await useApiFetch('/api/paths', {
      params: {
        path: folder
      }
    })

    if (paths != null) {
      form.value.path = paths.project_path
    }
  }
}
</script>

<template>
  <VeeForm #default="{isSubmitting, meta}" :initial-values="form" class="column q-gutter-y-md" validate-on-mount @submit="submitForm">
    <q-dialog ref="dialogRef" @hide="onDialogHide">
      <q-card class="q-dialog-plugin" style="min-width: 50vw">
        <q-card-section class="row items-center">
          <div class="text-h6">Ajout d'un projet</div>
          <q-space/>
          <q-btn v-close-popup dense flat icon="close" round/>
        </q-card-section>

        <q-card-section>
          <q-input v-model="form.path" :error="isBlank(form.path)" dense filled readonly>
            <template #after>
              <q-btn color="blue" dense flat icon="search" round @click="searchProjectFolder"/>
            </template>
          </q-input>
        </q-card-section>

        <q-card-section v-if="form.path != null">
          <VeeField #default="{errorMessage, meta, field}" label="nom du projet" name="name" rules="required">
            <q-input v-model="form.name" :error="!meta.valid" :error-message="errorMessage" dense filled v-bind="field"/>
          </VeeField>
        </q-card-section>

        <!-- buttons example -->
        <q-card-actions align="right">
          <q-btn color="primary" label="Annuler" @click="onDialogCancel"/>
          <q-btn :disable="isBlank(form.path) || !meta.valid" :loading="isSubmitting" color="primary" label="OK" type="submit"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </VeeForm>
</template>
