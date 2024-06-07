<script setup lang="ts">
import { MIcon } from '@/m';

defineProps<{
  icon: string;
  title: string;
  description?: string;
  empty?: boolean;
}>();
</script>

<template>
  <div class="translate-[background-color] p-3 hover:bg-white/10">
    <div class="flex items-center gap-2">
      <MIcon :icon="icon" />
      <div v-if="!empty" class="ml-1 max-w-[50%]">
        <h3 class="text-sm font-medium">{{ title }}</h3>
        <p v-if="description" class="text-xs text-gray-400">{{ description }}</p>
      </div>
      <div :class="{ 'ml-auto': !empty, 'w-full': empty }">
        <slot />
      </div>
    </div>
    <slot name="extra" />
  </div>
</template>
