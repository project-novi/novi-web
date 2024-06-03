<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { fetchApi } from '@/misc';
import { type IRawNoviObject } from '@/model';
import { type INoviObject, NoviObject } from '@/object';
import { usePref } from '@/pref';
import { SearchState, useEventListener, useUIState } from '@/ui';

import ObjectMasonry from '@/view/ObjectMasonry.vue';

const pref = usePref();
const route = useRoute();
const router = useRouter();

const ui = useUIState();

const objects = ref<INoviObject[]>();
let abort: AbortController | null = null;
let possiblyMore = true,
  currentFilter: string | null = null;
function fetchObjects(filter: string, append: boolean = false) {
  currentFilter = filter;
  abort?.abort();
  abort = new AbortController();

  let query: Record<string, string> = {
    filter: pref.extraFilter + ' ' + filter,
    order: 'created',
    limit: '25'
  };
  if (append && objects.value && objects.value.length > 0) {
    const last = objects.value[objects.value.length - 1];
    query['created_before'] = String(new Date(new Date(last.created).getTime() - 1).toISOString());
  }
  if (!append) objects.value = undefined;
  fetchApi(
    '/objects',
    { query, signal: abort.signal },
    (res) => {
      abort = null;
      const objs = res.map((obj: IRawNoviObject) => NoviObject.fromRaw(obj) as INoviObject);
      possiblyMore = !!objs.length;
      if (append) objects.value = objects.value?.concat(objs);
      else objects.value = objs;
    },
    async (p) => {
      const handle = setTimeout(() => {
        ui.searchState = SearchState.Searching;
      }, 200);
      try {
        await p;
        clearTimeout(handle);
        ui.searchState = SearchState.Idle;
      } catch (e) {
        clearTimeout(handle);
        if (!(e instanceof DOMException && e.name === 'AbortError'))
          ui.searchState = SearchState.Error;
        throw e;
      }
    }
  );
}

fetchObjects(String(route.query?.['q'] ?? ''));
router.beforeEach((to, from, next) => {
  if (to.name === 'home') {
    let newFilter = String(to.query?.['q'] ?? '');
    if (from.name === 'home' || currentFilter !== newFilter || ui.searchState === SearchState.Error)
      fetchObjects(newFilter);
  }
  next();
});

useEventListener(
  'scroll',
  () => {
    if (
      possiblyMore &&
      window.scrollY + window.innerHeight + 200 >= document.body.scrollHeight &&
      !abort
    )
      fetchObjects(currentFilter || '', true);
  },
  window
);
</script>

<template>
  <div class="min-h-[110vh] p-4">
    <ObjectMasonry v-if="objects" :objects="objects" :max-columns="7" class="w-full" />
  </div>
</template>
