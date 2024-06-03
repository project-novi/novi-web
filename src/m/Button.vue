<script setup lang="ts">
import { MSpinner, vRipple } from '@/m';

const COLORS = {
  default: 'bg-indigo-600 hover:bg-indigo-500',
  gray: 'bg-gray-600 hover:bg-gray-500',
  green: 'bg-green-600 hover:bg-green-700',
  red: 'bg-red-600 hover:bg-red-700',
  blue: 'bg-blue-600 hover:bg-blue-700',
  yellow: 'bg-yellow-600 hover:bg-yellow-700',
  flat: 'bg-transparent hover:bg-white/10 text-indigo-400'
};

withDefaults(
  defineProps<{
    loading?: boolean;
    color?: keyof typeof COLORS;
  }>(),
  {
    loading: false,
    color: 'default'
  }
);
</script>

<template>
  <button
    class="flex select-none items-center justify-center gap-1.5 rounded px-4 py-2 text-sm font-semibold disabled:bg-black/30"
    :class="[
      COLORS[color],
      { 'shadow-md transition-[box-shadow] hover:shadow-lg': color !== 'flat' }
    ]"
    v-ripple
  >
    <MSpinner v-if="loading" />
    <slot />
  </button>
</template>
