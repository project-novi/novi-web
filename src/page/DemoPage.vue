<script setup lang="ts">
import { push } from 'notivue';

import { MButton, MCheckbox, MProgress, MSpinner, vRipple } from '@/m';

import InputWithCheck from '@/view/InputWithCheck.vue';
import Masonry from '@/view/Masonry.vue';

let s = Array.from({ length: 50 }, () => Math.floor(Math.random() * 300 + 200));

function work() {
  push.error({
    message: 'qwjieoqwje',
    props: {}
  });
}
</script>

<template>
  <div class="">
    <MSpinner />
    <MButton @click="work">Click me</MButton>
    <MCheckbox />
    <MProgress />
    <MProgress :value="50" />
    <InputWithCheck class="max-w-[200px]" />
    <Masonry :items="s" :max-width="240" v-slot="{ item }">
      <div class="select-none bg-indigo-600 p-4" :style="{ height: `${item}px` }" v-ripple>
        {{ item }}
      </div>
    </Masonry>
  </div>
</template>
