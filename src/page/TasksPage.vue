<script lang="ts">
interface Task {
  id: string;
  title: string;
  status: string | null;
  progress: number | null;
  result: string | null;
  error: string | null;
  created: string;
  updated: string;
  finished: boolean;
}
export { type Task };
</script>

<script setup lang="ts">
import humanizeDuration from 'humanize-duration';

import { ref } from 'vue';

import { fetchApi } from '@/misc';

import { MIcon, MProgress, MSpinner, vRipple } from '@/m';

import PageContent from '@/view/PageContent.vue';

import { mdiAlertCircle, mdiCheckCircle, mdiClose } from '@mdi/js';
import { push } from 'notivue';

const tasks = ref<Task[]>();

function loadTasks() {
  tasks.value = undefined;
  fetchApi(
    '/functions/task.list',
    {
      method: 'POST',
      query: {
        filter: '@task'
      }
    },
    (resp) => {
      tasks.value = resp.tasks as Task[];
    }
  );
}
loadTasks();

function describeTask(task: Task) {
  if (task.finished) {
    let duration = new Date(task.updated).getTime() - new Date(task.created).getTime();
    return '已完成，耗时 ' + humanizeDuration(duration, { language: 'zh_CN' });
  }
  return task.status;
}
function removeTask(id: string) {
  fetchApi(
    '/functions/task.remove',
    {
      method: 'POST',
      json: { id }
    },
    () => {
      push.success('任务已删除');
      loadTasks();
    }
  );
}
</script>

<template>
  <PageContent title="任务列表">
    <div class="min-h-20 w-full flex flex-col rounded-sm bg-gray-700 shadow-xl">
      <MSpinner class="mx-auto m-4" size="3rem" v-if="tasks === undefined" />
      <div
        v-for="task in tasks"
        class="flex min-h-20 p-4 hover:bg-white/20 transition-colors items-center"
      >
        <div class="flex w-10 mr-2">
          <MSpinner size="2rem" class="m-auto" v-if="!task.finished" />
          <MIcon
            v-else-if="task.error === null"
            class="m-auto size-8 text-green-500"
            :icon="mdiCheckCircle"
          />
          <MIcon v-else class="m-auto size-8 text-red-500" :icon="mdiAlertCircle" />
        </div>
        <div class="min-w-0 grow">
          <RouterLink
            :to="{ name: 'task', params: { id: task.id } }"
            class="max-w-[60%] block w-fit"
          >
            <h3 class="text-lg font-semibold truncate hover:underline">
              {{ task.title }}
            </h3>
          </RouterLink>
          <MProgress
            v-if="!task.finished"
            class="w-full my-1"
            :value="task.progress || undefined"
          />
          <p class="text-gray-400 text-sm truncate">{{ describeTask(task) }}</p>
        </div>

        <button v-ripple class="ml-2 min-w-8 rounded-full p-1 -m-1">
          <MIcon class="size-6" :icon="mdiClose" @click="removeTask(task.id)" />
        </button>
      </div>
    </div>
  </PageContent>
</template>
