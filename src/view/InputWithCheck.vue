<script setup lang="ts">
import { MIcon, MInput, MSpinner } from '@/m';

import { mdiCheck, mdiClose } from '@mdi/js';

withDefaults(
  defineProps<{
    loading?: boolean;
    cancel?: boolean;
    cancelColor?: string;
    checkColor?: string;
  }>(),
  {
    loading: false,
    cancelColor: 'text-red-600',
    checkColor: 'text-indigo-600'
  }
);

defineEmits<{
  cancel: [];
  commit: [];
}>();

const model = defineModel();
</script>

<template>
  <MInput
    :class="{ '[&_input]:pr-8': !cancel, '[&_input]:pr-16': cancel }"
    @enter="$emit('commit')"
    v-model="model"
  >
    <template #suffix>
      <div class="flex w-full h-full">
        <div v-if="cancel" class="flex size-8 h-full">
          <button class="m-auto" @click="$emit('cancel')">
            <MIcon :icon="mdiClose" class="w-5" :class="[cancelColor]" />
          </button>
        </div>
        <div class="flex size-8 h-full">
          <MSpinner v-if="loading" />
          <button class="m-auto" @click="$emit('commit')">
            <MIcon :icon="mdiCheck" class="w-5" :class="[checkColor]" />
          </button>
        </div>
      </div>
    </template>
  </MInput>
</template>
