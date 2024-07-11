<script setup lang="ts">
import { ref } from 'vue';

import type { IRawNoviObject } from '@/model';
import { type IPartialNoviObject, NoviObject } from '@/object';
import { fetchApi, useQuery } from '@/query';

import { MButton } from '@/m';

import FileInput from '@/view/FileInput.vue';
import ObjectMasonry from '@/view/ObjectMasonry.vue';
import PageContent from '@/view/PageContent.vue';

const file = ref<File>();
const objects = ref<IPartialNoviObject[]>();
const loading = ref(false);

async function search() {
  let form = new FormData();
  form.append('file', file.value!);
  const resp = await fetchApi('/files', {
    method: 'POST',
    body: form
  });
  let embedding = await fetchApi('/functions/novai.embedding', {
    method: 'POST',
    json: resp
  });
  let results = (
    await fetchApi('/functions/novai.search', {
      method: 'POST',
      json: {
        format: 'tags:brief',
        ...embedding
      }
    })
  ).result;
  objects.value = results.map((obj: IRawNoviObject) => NoviObject.fromRaw(obj));
}
function postSearch() {
  useQuery(search, {
    loading,
    toast: true
  });
}
</script>

<template>
  <PageContent title="按图搜索">
    <FileInput v-model="file" accept="image/*" />
    <div v-if="file" class="flex justify-end mt-2 gap-2">
      <MButton
        :disabled="loading"
        color="red"
        @click="
          () => {
            file = undefined;
            objects = undefined;
          }
        "
      >
        取消
      </MButton>
      <MButton :disabled="loading" :loading="loading" color="green" @click="postSearch">
        搜索
      </MButton>
    </div>
    <ObjectMasonry v-if="objects !== undefined" :objects="objects" class="mt-4"></ObjectMasonry>
  </PageContent>
</template>
