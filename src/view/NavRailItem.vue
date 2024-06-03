<script setup lang="ts">
import { MIcon, vRipple } from '@/m';

defineProps<{
  icon: string;
  name: string;
  active: boolean;
}>();
</script>

<template>
  <div
    class="can-click flex h-11 items-center rounded p-3.5"
    :class="{
      'bg-indigo-400/40': active,
      'group-hover:bg-indigo-400/20': !active
    }"
    v-ripple
  >
    <MIcon :icon="icon" class="w-6 min-w-[1.5rem]" />
    <span class="select-none whitespace-nowrap pl-5">{{ name }}</span>
  </div>
</template>
