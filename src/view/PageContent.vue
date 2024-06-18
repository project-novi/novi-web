<script setup lang="ts">
import { useRouter } from 'vue-router';

import { MIcon, vRipple } from '@/m';

import { mdiArrowLeft } from '@mdi/js';

withDefaults(
  defineProps<{
    title: string;
    size?: keyof typeof SIZES;
    back?: boolean;
  }>(),
  {
    size: 'md',
    back: false
  }
);

const SIZES = {
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg'
};

const router = useRouter();
</script>

<template>
  <div class="p-6 flex">
    <div class="w-full mx-auto" :class="[SIZES[size]]">
      <div class="flex items-center mb-4">
        <button v-if="back" v-ripple class="mr-2 rounded-full p-1 -m-1">
          <MIcon class="size-8" :icon="mdiArrowLeft" @click="router.back" />
        </button>
        <h2 class="text-3xl font-black truncate">{{ title }}</h2>
      </div>
      <slot />
    </div>
  </div>
</template>
