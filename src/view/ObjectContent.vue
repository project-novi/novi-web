<script setup lang="ts">
import { component as Viewer } from 'v-viewer';

import { computed, defineAsyncComponent, inject } from 'vue';
import 'vue-plyr/dist/vue-plyr.css';

import { NoviObject } from '@/object';
import { depthKey } from '@/ui';

import { MSpinner } from '@/m';

import MarkdownView from '@/view/MarkdownView.vue';

const VuePlyr = defineAsyncComponent(async () => {
  await import('viewerjs/dist/viewer.css');
  // @ts-ignore
  return await import('vue-plyr');
});

const props = defineProps<{
  objectId: string;
}>();

const depth = inject(depthKey, 0);

const object = NoviObject.fetchPartialRef(props.objectId);
const ty = computed(() => object.value?.get('@'));
const size = computed(() => object.value?.size);
</script>

<template>
  <div v-if="object && size" class="object-content relative">
    <Viewer
      v-if="ty === 'image'"
      :id="`object-${objectId}`"
      class="relative lg:max-w-full"
      :images="[object.url()]"
      :options="{ container: 'dialog' }"
    >
      <img
        v-if="depth === 0"
        :src="object.url('thumbnail')"
        :width="size[0]"
        :height="size[1]"
      />
      <img
        :class="{
          'absolute inset-0': depth === 0
        }"
        :src="object.url('avif,original')"
        loading="lazy"
        :width="size[0]"
        :height="size[1]"
      />
    </Viewer>

    <VuePlyr v-else-if="ty === 'video'">
      <video controls playsinline :width="size[0]" :height="size[1]">
        <source :src="object.url()" />
      </video>
    </VuePlyr>

    <MarkdownView v-else-if="ty == 'text'" :object-id="objectId" />
  </div>
  <MSpinner v-else class="w-12" />
</template>
