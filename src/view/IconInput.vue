<script setup lang="ts">
import { MIcon, MInput } from '@/m';

defineProps<{
  label?: string;
  icon: string;
}>();

defineOptions({
  inheritAttrs: false
});

const model = defineModel();
</script>

<template>
  <div>
    <label v-if="label" class="text-sm text-gray-400">{{ label }}</label>
    <MInput class="[&_input]:pl-8" v-model="model" v-bind="$attrs">
      <template #prefix>
        <div class="flex size-8 h-full p-1.5">
          <MIcon :icon="icon" class="text-indigo-400" />
        </div>
      </template>
    </MInput>
  </div>
</template>
