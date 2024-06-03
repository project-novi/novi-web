<script setup lang="ts">
import { ref } from 'vue';

import { MDropdown, MIcon } from '@/m';

import { mdiMenuDown } from '@mdi/js';

defineProps<{
  values: string[];
}>();

const model = defineModel();

const dropdown = ref<typeof MDropdown>();
</script>

<template>
  <MDropdown ref="dropdown">
    <template #default>
      <div class="can-click flex items-center">
        <slot :value="model" :preview="true" />
        <MIcon
          :icon="mdiMenuDown"
          class="-ml-1 transition-transform duration-200"
          :class="{
            'rotate-180': dropdown?.collapsed
          }"
        />
      </div>
    </template>

    <template #dropdown>
      <ul class="min-w-[60px]">
        <li v-for="value in values" :key="value" class="hover:bg-white/10" @click="model = value">
          <slot :value="value" :preview="false" />
        </li>
      </ul>
    </template>
  </MDropdown>
</template>
