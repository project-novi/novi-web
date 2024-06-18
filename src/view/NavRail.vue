<script setup lang="ts">
import { useRoute, useRouter, type RouteLocationRaw } from 'vue-router';

import { useUIState } from '@/ui';

import NavRailItem from './NavRailItem.vue';

import { mdiCog, mdiCompass, mdiImageSearch, mdiInvoiceList, mdiLogin } from '@mdi/js';

const route = useRoute();
const router = useRouter();

const ui = useUIState();

function goto(route: RouteLocationRaw) {
  ui.navRailExpanded = false;
  router.push(route);
}
</script>

<template>
  <div class="z-20">
    <div
      class="absolute -z-10 h-full w-screen transition-colors md:hidden md:transition-none"
      :class="{
        'bg-black/40': ui.navRailExpanded,
        'pointer-events-none bg-black/0': !ui.navRailExpanded
      }"
      @click="ui.navRailExpanded = false"
    />
    <div
      class="h-full overflow-x-hidden bg-gray-800 shadow-lg transition-[width] duration-200"
      :class="{
        'w-0': ui.navRailHidden,
        'w-0 md:w-16': !ui.navRailExpanded && !ui.navRailHidden,
        'w-[250px]': ui.navRailExpanded
      }"
      @mouseenter="ui.navRailExpanded = true"
      @mouseleave="ui.navRailExpanded = false"
    >
      <div class="flex h-full flex-col justify-between border-r border-solid border-gray-400 p-1.5">
        <div class="no-scrollbar flex flex-col gap-1 overflow-y-scroll">
          <NavRailItem
            :icon="mdiCompass"
            name="内容"
            :active="route.name === 'home' || route.name === 'object'"
            @click="goto({ name: 'home' })"
          />
          <NavRailItem
            :icon="mdiInvoiceList"
            name="任务列表"
            :active="route.name === 'task' || route.name === 'tasks'"
            @click="goto({ name: 'tasks' })"
          />
          <NavRailItem
            :icon="mdiImageSearch"
            name="按图搜索"
            :active="route.name === 'image-search'"
            @click="goto({ name: 'image-search' })"
          />

        </div>

        <div class="flex flex-col gap-1">
          <NavRailItem
            :icon="mdiCog"
            name="设置"
            :active="route.name === 'settings'"
            @click="goto({ name: 'settings' })"
          />
          <NavRailItem
            :icon="mdiLogin"
            name="登录"
            :active="route.name === 'login' || route.name === 'register'"
            @click="goto({ name: 'login' })"
          />
        </div>
      </div>
    </div>
  </div>
</template>
