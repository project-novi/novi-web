<script setup lang="ts">
defineProps<{
  icon: string;
}>();
</script>

<template>
  <svg width="24" height="24" viewBox="0 0 24 24">
    <path :d="icon" class="fill-current"></path>
  </svg>
</template>
