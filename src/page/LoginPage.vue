<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { push } from 'notivue';

import { fetchApi, loadingGuard } from '@/misc';

import { MButton } from '@/m';
import IconInput from '@/view/IconInput.vue';

import { mdiAccount, mdiLock } from '@mdi/js';

const router = useRouter();

const name = ref('');
const password = ref('');
const loading = ref(false);
function login() {
  if (loading.value) return;
  fetchApi(
    '/login',
    {
      method: 'POST',
      json: {
        name: name.value,
        password: password.value
      }
    },
    () => {
      push.success('登录成功');
      router.back();
    },
    loadingGuard(loading)
  );
}
</script>

<template>
  <div class="flex p-8">
    <div class="mx-auto w-full max-w-xs rounded-lg border border-gray-600 p-4">
      <h1 class="text-4xl font-bold">登录</h1>
      <h2 class="text-gray-300">无限精彩，近在咫尺</h2>
      <div class="mt-2 flex flex-col gap-2">
        <IconInput label="用户名" autofocus :icon="mdiAccount" variant="flat" v-model="name" />
        <IconInput
          label="密码"
          :icon="mdiLock"
          variant="flat"
          type="password"
          v-model="password"
          @enter="login"
        />
        <MButton class="mt-2" :loading="loading" :disabled="loading" @click="login">登录</MButton>
      </div>
    </div>
  </div>
</template>
