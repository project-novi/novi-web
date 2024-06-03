<script setup lang="ts">
const COLORS = {
  default: 'bg-pink-500'
};

withDefaults(
  defineProps<{
    value?: number;
    max?: number;
    color?: keyof typeof COLORS;
  }>(),
  {
    max: 100,
    color: 'default'
  }
);
</script>

<template>
  <div class="w-full">
    <div class="relative h-1 bg-opacity-30" :class="COLORS[color]" role="progressbar">
      <template v-if="value === undefined">
        <div
          class="indeterminate absolute bottom-0 left-0 right-auto top-0 w-auto"
          :class="COLORS[color]"
        />
        <div
          class="indeterminate-short absolute bottom-0 left-0 right-auto top-0 w-auto"
          :class="COLORS[color]"
        />
      </template>
      <div
        v-else
        class="absolute bottom-0 left-0 top-0"
        :class="COLORS[color]"
        :style="{
          width: `${(value / max) * 100}%`
        }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.indeterminate {
  animation: indeterminate 2s linear infinite;
}
@keyframes indeterminate {
  0% {
    left: -90%;
    right: 100%;
  }
  60% {
    left: -90%;
    right: 100%;
  }
  to {
    left: 100%;
    right: -35%;
  }
}

.indeterminate-short {
  animation: indeterminate-short 2s linear infinite;
}
@keyframes indeterminate-short {
  0% {
    left: -200%;
    right: 100%;
  }
  60% {
    left: 107%;
    right: -8%;
  }
  to {
    left: 107%;
    right: -8%;
  }
}
</style>
