<script setup lang="ts">
import { filesize } from 'filesize';

import { computed, ref, watch } from 'vue';

import { errorHandler } from '@/misc';
import { type INoviObject } from '@/object';

import { MSpinner } from '@/m';

const props = defineProps<{
  object: INoviObject;
  name: string;
  variant: string;
}>();

const url = computed(() => props.object.url(props.variant));

const fileSize = ref<string>();

let abort: AbortController | null = null;
watch(
  url,
  (url) => {
    abort?.abort();
    abort = new AbortController();
    fileSize.value = undefined;
    fetch(url, { method: 'HEAD', signal: abort.signal })
      .then((resp) => {
        let size = resp.headers.get('content-length')!;
        try {
          fileSize.value = filesize(parseInt(size));
        } catch (e) {
          // wierd... let's try reading the body
          fetch(url, {
            method: 'GET',
            signal: abort?.signal,
            headers: {
              'Content-Range': 'bytes=0-8192'
            }
          })
            .then((resp) => {
              try {
                let size = parseInt(resp.headers.get('content-length')!);
                if (size < 8192) {
                  fileSize.value = filesize(size);
                  return;
                }
              } catch (e) {}
              // Okay. I give up.
              fileSize.value = '';
            })
            .catch(errorHandler());
        }
      })
      .catch(errorHandler());
  },
  { immediate: true }
);
</script>

<template>
  <a
    :href="url"
    target="_blank"
    class="mb-2 mr-2 group inline-flex text-sm items-stretch"
    :title="variant"
  >
    <div
      class="bg-green-500 group-hover:bg-green-600 flex items-center px-2 font-semibold rounded-l"
    >
      {{ name }}
    </div>
    <div
      class="flex h-[2rem] min-h-0 items-center rounded-r bg-green-600 group-hover:bg-green-700 pl-1 pr-1.5"
    >
      <span v-if="fileSize !== undefined" class="px-1">{{ fileSize }}</span>
      <MSpinner v-else class="inline" />
    </div>
  </a>
</template>
