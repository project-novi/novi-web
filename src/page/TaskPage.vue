<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import { fetchApi, loadingGuard } from '@/misc';

import { MSpinner } from '@/m';

import PageContent from '@/view/PageContent.vue';

import type { Task } from './TasksPage.vue';

const route = useRoute();

const id = String(route.params.id);

const task = ref<Task>();

fetchApi(
  '/functions/task.get',
  {
    method: 'POST',
    json: { id }
  },
  (resp) => {
    task.value = resp as Task;
  }
);
</script>

<template>
  <PageContent title="任务详情" back>
    <MSpinner v-if="task === undefined" size="2rem" class="m-auto" />
    <div v-else>
      <table>
        <tbody>
          <tr>
            <td>任务 ID</td>
            <td>{{ task.id }}</td>
          </tr>
          <tr>
            <td>标题</td>
            <td>{{ task.title }}</td>
          </tr>
          <tr>
            <td>是否完成</td>
            <td>{{ task.finished }}</td>
          </tr>
          <tr>
            <td>状态</td>
            <td>{{ task.status }}</td>
          </tr>
          <tr>
            <td>进度</td>
            <td>{{ task.progress }}</td>
          </tr>
          <tr>
            <td>结果</td>
            <td>{{ task.result }}</td>
          </tr>
          <tr>
            <td>错误</td>
            <td>{{ task.error }}</td>
          </tr>
          <tr>
            <td>创建时间</td>
            <td>{{ task.created }}</td>
          </tr>
          <tr>
            <td>更新时间</td>
            <td>{{ task.updated }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </PageContent>
</template>

<style scoped>
td:first-child {
  @apply w-20;
}
</style>