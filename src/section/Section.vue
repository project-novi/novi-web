<script setup lang="ts">
import { ref } from 'vue';

import { MIcon } from '@/m';

import { mdiMenuDown } from '@mdi/js';

const props = defineProps<{
  icon?: string;
  title: string;
  defaultOpen?: boolean;
}>();

const container = ref<HTMLElement>();
const expanded = ref(props.defaultOpen ?? false);

function open() {
  expanded.value = true;
}

defineExpose({ open });
</script>

<template>
  <div
    class="border-2 rounded-lg transition-[border-color] shadow-sm"
    :class="{
      'border-white/40 hover:border-white/80': !expanded,
      'border-fuchsia-500/40 hover:border-fuchsia-500/80': expanded
    }"
  >
    <div class="min-h-12 items-center flex p-2 can-click" @click="expanded = !expanded">
      <MIcon v-if="icon" :icon="icon" class="ml-1" />
      <h2 class="font-semibold ml-2 grow select-none">{{ title }}</h2>
      <MIcon
        :icon="mdiMenuDown"
        class="transition-transform duration-200"
        :class="{
          'rotate-180': expanded
        }"
      />
    </div>

    <div
      ref="container"
      class="overflow-y-hidden bg-slate-600 rounded-b-lg"
      :class="{
        'max-h-0': !expanded,
        'p-2': expanded
      }"
    >
      <slot />
    </div>
  </div>
</template>
