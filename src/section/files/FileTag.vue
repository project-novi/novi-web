<script setup lang="ts">
import { filesize } from 'filesize';

import { computed, ref, watch } from 'vue';

import { type INoviObject } from '@/object';
import { useQuery } from '@/query';

import { MSpinner } from '@/m';

const props = defineProps<{
  object: INoviObject;
  name: string;
  variant: string;
}>();

const url = computed(() => props.object.url(props.variant));

async function fetchSize(url: string, signal?: AbortSignal) {
  let resp = await fetch(url, { method: 'HEAD', signal });
  let size = resp.headers.get('content-length')!;
  try {
    return filesize(parseInt(size));
  } catch (e) {
    // wierd... let's try reading the body
    resp = await fetch(url, {
      method: 'GET',
      signal: abort?.signal,
      headers: {
        'Content-Range': 'bytes=0-8192'
      }
    });
    try {
      let size = parseInt(resp.headers.get('content-length')!);
      if (size < 8192) return filesize(size);
    } catch (e) {}
    // Okay. I give up.
    return '';
  }
}

let abort: AbortController | null = null;
const fileSize = ref<string>();
watch(
  url,
  (url) => {
    abort?.abort();
    abort = new AbortController();
    useQuery(() => fetchSize(url, abort?.signal), {
      data: fileSize
    });
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
