<script setup lang="ts">
import { type NotivueItem } from 'notivue';

import { MButton, MIcon } from '@/m';

import { mdiAlert, mdiCheckCircle, mdiInformation, mdiLightbulbAlert } from '@mdi/js';

export interface NotificationProps {
  action?: [string, () => void];
}

const props = defineProps<{
  item: NotivueItem<NotificationProps>;
}>();

const ICONS: Record<NotivueItem['type'], [string, string]> = {
  info: [mdiInformation, 'text-blue-400'],
  error: [mdiAlert, 'text-red-500'],
  warning: [mdiLightbulbAlert, 'text-yellow-500'],
  success: [mdiCheckCircle, 'text-green-500'],
  promise: ['', ''],
  'promise-resolve': ['', ''],
  'promise-reject': ['', '']
};

function onClick() {
  props.item.props.action![1]();
  props.item.clear();
}
</script>

<template>
  <div
    class="relative flex min-h-12 max-w-screen-sm items-center rounded bg-gray-700 p-3 shadow-lg"
  >
    <MIcon :icon="ICONS[item.type][0]" class="mr-2 size-6" :class="ICONS[item.type][1]" />
    <p :role="item.ariaRole" :aria-live="item.ariaLive" class="line-clamp-4" aria-atomic="true">
      {{ item.message }}
    </p>
    <MButton v-if="item.props.action" @click="onClick" color="flat" class="-mr-1 ml-3 text-nowrap">
      {{ item.props.action[0] }}
    </MButton>
  </div>
</template>
