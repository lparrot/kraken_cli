<script lang="ts" setup>
import {QInput, useDialogPluginComponent} from 'quasar'
import {isBlank} from "~/utils/string.utils";
import {useApiStore} from "~/store/api";
import {useStateStore} from "~/store/state";

const $q = useQuasar()
const $api = useApiStore()
const $state = useStateStore()

const drawer = ref(false)

defineEmits([
  ...useDialogPluginComponent.emits
])

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

const form = ref<{ path?: string, name?: string }>({})

function submitForm() {
  onDialogOK(form.value)
}

async function onFolderSelect(folder) {
  const paths = await $api.fetchProjectPaths(folder)

  if (paths != null) {
    const project = $state.projects.find(it => it.path === paths.project_path)
    if (project != null) {
      $q.notify({
        message: 'Le projet a déjà été référence sous le nom ' + project.name,
        color: 'red'
      })
    } else {
      form.value.path = paths.project_path
      drawer.value = false
    }
  } else {
    form.value.path = undefined
  }
}
</script>

<template>
  <suspense>

    <q-layout>
      <VeeForm #default="{isSubmitting, meta}" :initial-values="form" class="column q-gutter-y-md" validate-on-mount @submit="submitForm">
        <q-dialog ref="dialogRef" @hide="onDialogHide">
          <q-card class="q-dialog-plugin" style="min-width: 50vw">
            <q-drawer v-model="drawer" :width="500" behavior="mobile" bordered overlay side="right">
              <div class="row items-center q-ma-sm">
                <q-space/>
                <q-btn dense flat icon="close" round @click="drawer = false"/>
              </div>
              <FileFetcher :auto-select="false" :default-dir="$state.infos.home_dir" :model-value="form.path" show-home @update:model-value="onFolderSelect"/>
            </q-drawer>

            <q-card-section class="row items-center">
              <div class="text-h6">Ajout d'un projet</div>
              <q-space/>
              <q-btn v-close-popup dense flat icon="close" round/>
            </q-card-section>

            <q-card-section>
              <q-input v-model="form.path" :error="isBlank(form.path)" dense filled readonly>
                <template #after>
                  <q-btn color="blue" dense flat icon="search" round @click="drawer = true"/>
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
              <q-btn :disable="isBlank(form.path) || !meta.valid" color="primary" label="OK" type="submit"/>
            </q-card-actions>
          </q-card>
        </q-dialog>
      </VeeForm>
    </q-layout>
  </suspense>
</template>
