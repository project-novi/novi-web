<script setup lang="ts" generic="T">
import { type QueryResult } from '@/query';

import { MButton, MIcon, MSpinner } from '@/m';

import { mdiAlert } from '@mdi/js';

const props = defineProps<{
  query: QueryResult<T>;
}>();
const { loading, error, retry, data } = props.query;
</script>

<template>
  <div>
    <slot v-if="data !== undefined" :data="data" />
    <div v-else class="w-full flex flex-col p-4 items-center">
      <MSpinner v-if="loading" class="mx-auto" size="3rem" />
      <template v-else-if="error !== undefined">
        <MIcon :icon="mdiAlert" class="text-red-500 size-16" />
        <p class="font-black">发生了错误</p>
        <MButton v-if="retry" class="w-20 my-2" @click="retry">重试</MButton>
        <pre
          class="w-full bg-black/30 lg:w-1/2 h-96 p-4 rounded mx-2 mt-4 overflow-scroll text-gray-500"
          >{{ String(error) + '\n\n' + error.stack }}</pre
        >
      </template>
    </div>
  </div>
</template>
