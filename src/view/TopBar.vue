<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { SearchState, useHotKey, useUIState } from '@/ui';

import { MIcon, MInput, MProgress, MSpinner, vRipple } from '@/m';

import { mdiAlert, mdiMagnify, mdiMenu } from '@mdi/js';

import Banner from '@/assets/banner.png';

const route = useRoute();
const router = useRouter();

const ui = useUIState();

const searchText = ref('');
function search() {
  router.push({ name: 'home', query: { q: searchText.value }, force: true });
}

router.afterEach((to) => {
  if (to.name === 'home') searchText.value = String(to.query['q'] ?? '');
});

const input = ref<typeof MInput>();
useHotKey('/', () => {
  const el = input.value?.$el as HTMLElement;
  el.querySelector('input')?.focus();
});
</script>

<template>
  <header class="fixed z-10 w-full bg-indigo-500 shadow-2xl shadow-indigo-300/40">
    <div class="flex h-12 items-center p-2">
      <div class="can-click rounded-full" v-ripple @click="ui.toggleNavRail">
        <MIcon class="m-1.5 w-6" :icon="mdiMenu" />
      </div>
      <RouterLink
        class="router-link-active router-link-exact-active px-1"
        :to="route.name === 'home' ? route : { name: 'home' }"
      >
        <img :src="Banner" class="w-12" />
      </RouterLink>

      <div class="relative ml-auto w-auto">
        <MInput
          placeholder="Novi anything…"
          type="search"
          class="[&_input]:pl-11"
          v-model="searchText"
          @enter="search"
          ref="input"
        >
          <template #prefix>
            <div class="flex h-full items-center justify-center rounded-l bg-indigo-700 px-0.5">
              <div class="flex w-8 justify-center">
                <MIcon v-if="ui.searchState === SearchState.Idle" :icon="mdiMagnify" />
                <MSpinner v-else-if="ui.searchState === SearchState.Searching" class="size-5" />
                <MIcon v-else :icon="mdiAlert" class="text-red-500" />
              </div>
            </div>
          </template>
        </MInput>
      </div>
    </div>
  </header>

  <Transition class="fade">
    <MProgress
      v-if="ui.pageLoading || ui.searchState === SearchState.Searching"
      class="fixed z-20 mt-11 w-screen"
    />
  </Transition>
</template>
