<script setup lang="ts">
import { RATINGS } from '@/misc';
import { type IPartialNoviObject } from '@/object';
import { usePref } from '@/pref';

import { MIcon, vRipple } from '@/m';

import { mdiPlayCircleOutline } from '@mdi/js';

import Masonry from './Masonry.vue';

const pref = usePref();

defineProps<{
  objects: IPartialNoviObject[];
}>();

function tryRemove(e: Event) {
  let el = e.target as HTMLElement;
  el.style.opacity = '1';
  let next = el.nextElementSibling as HTMLElement | null;
  if (next && next.tagName === 'DIV') next.remove();
}

function shouldBlur(obj: IPartialNoviObject) {
  return (
    obj.has('@rating') &&
    pref.sensitiveBlur !== 'n' &&
    RATINGS.findIndex((r) => obj.get('@rating') === r.value) >=
      RATINGS.findIndex((r) => pref.sensitiveBlur === r.value)
  );
}
</script>

<template>
  <Masonry
    :items="objects"
    :key-mapper="(obj) => obj.id"
    :gap="14"
    :max-width="240"
    v-slot="{ item }"
  >
    <div
      class="fade-in rounded bg-gray-700"
      @animationend="(ev) => (ev.target as HTMLElement).classList.remove('fade-in')"
      :style="{
        'aspect-ratio': `${item.size[0]} / ${item.size[1]}`
      }"
      v-ripple
    >
      <RouterLink
        class="relative inline-block h-full w-full cursor-pointer transition-[filter] hover:brightness-90"
        :to="{ name: 'object', params: { id: item.id } }"
      >
        <img
          :src="item.url('thumbnail')"
          :width="item.size[0]"
          :height="item.size[1]"
          @load="tryRemove"
          class="w-full transition-[opacity] duration-500"
          :class="{ 'blur-lg': shouldBlur(item) }"
          style="opacity: 0"
          alt="Thumbnail"
        />
        <div
          v-if="!pref.disableAnimation"
          class="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-indigo-100/10 to-transparent"
        />
        <MIcon
          v-if="item.get('@') === 'video'"
          :icon="mdiPlayCircleOutline"
          class="absolute inset-0 m-auto size-16 opacity-70"
        />
      </RouterLink>
    </div>
  </Masonry>
</template>

<style>
@keyframes shimmer {
  0% {
  }
  to {
    transform: translateX(100%);
  }
}
</style>
