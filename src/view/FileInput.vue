<script setup lang="ts">
import { ref } from 'vue';

import { MIcon } from '@/m';

import { mdiFileUpload } from '@mdi/js';

defineProps<{
  accept?: string;
}>();

const dragging = ref(false);
const fileInput = ref<HTMLInputElement>();
const file = defineModel<File>();
</script>

<template>
  <div
    class="min-w-60 border-dashed border-2 rounded min-h-20 flex flex-col items-center p-10"
    @dragover.prevent="dragging = true"
    @dragleave="dragging = false"
    @drop.prevent="(e) => (file = e.dataTransfer?.files[0])"
    @click="fileInput?.click()"
  >
    <input
      type="file"
      multiple
      name="file"
      id="fileInput"
      class="hidden"
      ref="fileInput"
      :accept="accept"
      @change="(e) => (file = (e.target as HTMLInputElement).files?.[0])"
    />

    <MIcon :icon="mdiFileUpload" class="size-16 mb-2" />

    <label v-if="!file" for="fileInput">
      <div v-if="dragging">松开以上传</div>
      <div v-else>拖动文件或点击上传</div>
    </label>
    <p v-else>
      {{ file.name }}
    </p>
  </div>
</template>
