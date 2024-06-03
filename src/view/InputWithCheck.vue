<script setup lang="ts">
import { MIcon, MInput, MSpinner } from '@/m';

import { mdiCheck } from '@mdi/js';

withDefaults(
  defineProps<{
    loading?: boolean;
    checkColor?: string;
  }>(),
  {
    loading: false,
    checkColor: 'text-indigo-600'
  }
);

defineEmits<{
  commit: [];
}>();

const model = defineModel();
</script>

<template>
  <MInput class="[&_input]:pr-8" @enter="$emit('commit')" v-model="model">
    <template #suffix>
      <div class="flex size-8 h-full">
        <MSpinner v-if="loading" />
        <button class="m-auto" @click="$emit('commit')">
          <MIcon :icon="mdiCheck" class="w-5" :class="[checkColor]" />
        </button>
      </div>
    </template>
  </MInput>
</template>
