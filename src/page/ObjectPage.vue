<script setup lang="ts">
import { provide, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { NoviObject } from '@/object';
import { compactModeKey, useHotKey } from '@/ui';

import { MIcon, MSpinner } from '@/m';

import ObjectContent from '@/view/ObjectContent.vue';

import AttrsSection from '@/section/AttrsSection.vue';
import TagsSection from '@/section/TagsSection.vue';

import { mdiArrowLeft, mdiFullscreen, mdiFullscreenExit, mdiPageLayoutHeaderFooter } from '@mdi/js';
import FilesSection from '@/section/FilesSection.vue';

const route = useRoute();
const router = useRouter();
const objectId = String(route.params['id']);

const object = NoviObject.fetchRef(objectId);

enum Mode {
  Normal,
  Fullscreen,
  Compact
}
const mode = ref(Mode.Normal);

function toggleMode() {
  switch (mode.value) {
    case Mode.Normal:
      mode.value = Mode.Fullscreen;
      break;
    case Mode.Fullscreen:
      if (object.value && object.value.get('@') === 'text') mode.value = Mode.Compact;
      else mode.value = Mode.Normal;
      break;
    case Mode.Compact:
      mode.value = Mode.Normal;
      break;
  }
}
const compactMode = ref(false);
provide(compactModeKey, compactMode);
watch(mode, (newMode) => {
  compactMode.value = newMode === Mode.Compact;
});

useHotKey('Escape', () => {
  router.back();
});
useHotKey('f', () => {
  if (mode.value !== Mode.Fullscreen) mode.value = Mode.Fullscreen;
  else mode.value = Mode.Normal;
});
</script>

<template>
  <div class="block lg:flex h-full lg:max-h-full flex-col lg:overflow-y-hidden lg:flex-row">
    <div
      id="object-content-panel"
      class="relative flex min-h-[240px] max-w-full shrink-0 flex-col bg-opacity-30 lg:h-full"
      :class="{
        'max-h-[60%] w-full lg:max-h-none lg:w-3/4': mode === Mode.Normal,
        'h-full lg:w-full': mode !== Mode.Normal
      }"
      :data-compact="mode === Mode.Compact"
    >
      <div class="flex h-full max-h-full overflow-y-scroll">
        <ObjectContent :object-id="objectId" class="m-auto" />
      </div>
      <button
        id="back-button"
        class="absolute left-4 top-4 flex size-12 rounded-full bg-black bg-opacity-30 outline-none hover:bg-opacity-40"
        @click="router.back()"
      >
        <MIcon :icon="mdiArrowLeft" class="m-auto" />
      </button>
      <button
        id="fullscreen-button"
        class="absolute right-4 top-4 flex size-12 rounded-full bg-black bg-opacity-30 outline-none hover:bg-opacity-40"
        @click="toggleMode"
      >
        <MIcon
          :icon="
            mode === Mode.Compact
              ? mdiPageLayoutHeaderFooter
              : mode === Mode.Fullscreen
                ? mdiFullscreenExit
                : mdiFullscreen
          "
          class="m-auto size-8"
        />
      </button>
    </div>

    <div
      class="grow bg-gray-700 p-4 flex pb-4 flex-col gap-2 min-h-[80vh] lg:min-h-[inherit] lg:overflow-y-scroll"
      :class="{
        hidden: mode !== Mode.Normal
      }"
    >
      <div v-if="!object" class="w-full h-full flex">
        <MSpinner class="m-auto w-12" />
      </div>
      <template v-else>
        <TagsSection :object="object" />
        <FilesSection :object="object" />
        <AttrsSection :object="object" />
      </template>
    </div>
  </div>
</template>
