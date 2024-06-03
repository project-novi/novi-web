<script setup lang="ts">
withDefaults(
  defineProps<{
    color?: string;
    size?: string;
  }>(),
  {
    color: 'white',
    size: '1.3rem'
  }
);
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 10 10" :width="size">
    <circle
      fill="none"
      stroke-dasharray="30"
      stroke-dashoffset="8"
      :stroke="color"
      stroke-width="1.1"
      r="4"
    />
  </svg>
</template>

<style scoped>
svg {
  animation: rotate 1.4s linear infinite;
}
@keyframes rotate {
  to {
    transform: rotate(270deg);
  }
}

circle {
  animation: spin 1.4s ease-in-out infinite;
}
@keyframes spin {
  50% {
    transform: rotate(135deg);
    stroke-dashoffset: 8;
  }
  to {
    transform: rotate(450deg);
  }
  0%,
  to {
    stroke-dashoffset: 28;
  }
}
</style>
