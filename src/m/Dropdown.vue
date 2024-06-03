<script setup lang="ts">
import { ref } from 'vue';

import { useEventListener } from '@/ui';

const root = ref<HTMLElement>();

const display = ref(false);

useEventListener('mousedown', (e) => {
  if (root.value && !root.value.contains(e.target as Node)) display.value = false;
});

defineExpose({ collapsed: display });
</script>

<template>
  <div class="relative" ref="root" @click="display = !display">
    <slot name="default" />
    <Transition name="fade">
      <div
        v-if="display"
        class="absolute right-0 top-full z-10 mt-1 rounded-sm bg-gray-800 shadow-lg outline outline-1 outline-gray-400 transition-[opacity,top]"
      >
        <slot name="dropdown" />
      </div>
    </Transition>
  </div>
</template>
