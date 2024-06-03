<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div>
    <h2 class="font-bold">{{ title }}</h2>
    <div class="mt-2 w-full rounded-sm bg-gray-700 shadow-xl">
      <slot />
    </div>
  </div>
</template>
