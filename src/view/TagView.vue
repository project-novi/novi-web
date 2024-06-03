<script setup lang="ts">
import { MIcon } from '@/m';

import { mdiCloseThick } from '@mdi/js';

defineProps<{
  tag: string;
  editing?: boolean;
}>();

defineEmits<{
  delete: [string];
}>();
</script>

<template>
  <div class="can-click mb-2 mr-2 inline-flex items-stretch">
    <div
      class="bg-gray-700 py-1 px-3 text-sm font-semibold"
      :class="{
        'rounded-full': !editing,
        'rounded-l-full': editing
      }"
    >
      {{ tag }}
    </div>
    <button
      v-if="editing"
      class="flex h-[2rem] min-h-0 items-center rounded-r-full bg-red-500 pl-1 pr-1.5"
      @click="$emit('delete', tag)"
    >
      <MIcon :icon="mdiCloseThick" class="size-4 [&_path]:stroke-2" />
    </button>
  </div>
</template>
