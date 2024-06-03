<script setup lang="ts">
import { Notivue, NotivueSwipe } from 'notivue';

import { ref } from 'vue';
import { useRoute } from 'vue-router';

import { usePref } from '@/pref';
import { persistedPositions } from '@/router';
import { useUIState } from '@/ui';

import NavRail from '@/view/NavRail.vue';
import Notification from '@/view/Notification.vue';
import TopBar from '@/view/TopBar.vue';

const ui = useUIState();
const pref = usePref();

const route = useRoute();

const container = ref<HTMLElement>();

function onPageEnter() {
  const name = String(route.name);
  if (name in persistedPositions) {
    let { left, top } = persistedPositions[name];
    window.scrollTo(left, top);
  } else window.scrollTo(0, 0);
}
</script>

<template>
  <div
    :class="{ 'no-transition': pref.disableAnimation }"
    class="max-w-screen h-full overflow-x-clip"
  >
    <Notivue v-slot="item">
      <NotivueSwipe :item="item">
        <Notification :item="item" />
      </NotivueSwipe>
    </Notivue>

    <TopBar />
    <div
      class="h-screen pt-12 transition-[margin-left] duration-200"
      :class="{ 'md:ml-16': !ui.navRailHidden }"
    >
      <div
        ref="container"
        class="h-full max-h-full"
        @animationend="container?.classList.remove('fade-in')"
      >
        <RouterView v-slot="{ Component }">
          <Transition name="slide" mode="out-in" @enter="onPageEnter">
            <KeepAlive include="HomePage">
              <component :is="Component" />
            </KeepAlive>
          </Transition>
        </RouterView>
      </div>
    </div>
    <NavRail class="fixed bottom-0 top-0 z-30 md:top-12 md:z-auto" />
  </div>
</template>

<style>
.fade-in {
  animation: fade-in 0.2s ease-out;
}
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.no-transition * {
  transition: none !important;
}
</style>
