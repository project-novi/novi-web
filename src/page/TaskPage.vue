<script setup lang="ts">
import { useRoute } from 'vue-router';

import { useFetch } from '@/query';

import PageContent from '@/view/PageContent.vue';
import QueryView from '@/view/QueryView.vue';

import type { Task } from './TasksPage.vue';

const route = useRoute();

const id = String(route.params.id);

const query = useFetch(
  '/functions/task.get',
  { method: 'POST', json: { id } },
  (resp) => resp as Task
);
</script>

<template>
  <PageContent title="任务详情" back>
    <QueryView :query="query" v-slot="{ data: task }">
      <div>
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
    </QueryView>
  </PageContent>
</template>

<style scoped>
td:first-child {
  @apply w-20;
}
</style>
