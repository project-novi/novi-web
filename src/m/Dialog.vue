<script setup lang="ts">
import { MIcon, vRipple } from '.';

import { ref } from 'vue';

import { mdiArrowLeft } from '@mdi/js';

defineProps<{
  title: string;
}>();

const dialog = ref<HTMLDialogElement>();

defineExpose({
  open() {
    console.log(dialog.value);
    dialog.value!.showModal();
  },
  close() {
    dialog.value!.close();
  }
});
</script>

<template>
  <dialog
    class="bg-slate-700 rounded min-w-72 backdrop:bg-black/50 text-white"
    ref="dialog"
    @click="dialog?.close"
  >
    <div @click.stop>
      <div class="flex p-2 items-center pb-0">
        <button v-ripple class="flex size-8 rounded-full" @click="dialog?.close">
          <MIcon :icon="mdiArrowLeft" class="m-auto" />
        </button>
        <h2 class="text-lg font-bold flex-1 truncate ml-1">{{ title }}</h2>
      </div>
      <div class="w-full px-3 py-3">
        <slot />
      </div>
    </div>
  </dialog>
</template>
