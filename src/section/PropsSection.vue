<script setup lang="ts">
import { inject, nextTick, ref, watch } from 'vue';

import { push } from 'notivue';

import type { IRawNoviObject } from '@/model';
import { type INoviObject, NoviObject } from '@/object';
import { useFetch } from '@/query';
import { openSectionKey, useHotKey } from '@/ui';

import { MButton, MIcon, MInput } from '@/m';

import { mdiCloseThick, mdiMinusThick, mdiPlusThick } from '@mdi/js';

const props = defineProps<{
  object: INoviObject;
}>();

const openSection = inject(openSectionKey)!;

const editing = ref(false),
  saving = ref(false);

type Tags = [string, string | null][];
const properties = ref<Tags>([]);
watch(
  () => props.object,
  (obj) => {
    let tags: Tags = [];
    for (let tag in obj.tags) if (tag.startsWith('@')) tags.push([tag.substring(1), obj.tags[tag]]);
    tags.sort((a, b) => a[0].localeCompare(b[0]));
    properties.value = tags;
  },
  { immediate: true }
);
const display = ref<Tags>([]);
watch(
  properties,
  (tags) => {
    if (editing.value) return;
    display.value = tags;
  },
  { immediate: true }
);

const newProperty = ref('');
function startEdit() {
  if (editing.value) return false;
  openSection();
  newProperty.value = '';
  editing.value = true;
  display.value = [];
  for (let tv of properties.value) display.value.push([...tv]);
}
useHotKey('Shift+E', startEdit, { allowEdit: true });

function cancelEdit() {
  if (!editing.value) return false;
  editing.value = false;
  display.value = properties.value;
}
useHotKey('Escape', cancelEdit, { allowEdit: true });

function saveEdit() {
  if (!editing.value || saving.value) return false;
  editing.value = false;
  let tags: Record<string, string | null> = {};
  for (let [tag, value] of Object.entries(props.object.tags))
    if (!tag.startsWith('@')) tags[tag] = value;
  for (let [prop, value] of display.value) tags['@' + prop] = value;

  useFetch(
    `/objects/${props.object.id}`,
    {
      method: 'PUT',
      query: { scopes: '*' },
      json: tags
    },
    {
      loading: saving,
      toast: true,
      map(raw) {
        NoviObject.fromRaw(raw as IRawNoviObject);
        push.success('已保存');
      }
    }
  );
}

const tbody = ref<HTMLTableSectionElement>();
function focusProperty(prop: string) {
  for (let i = 0; i < display.value.length; i++) {
    if (display.value[i][0] === prop) {
      let row = tbody.value?.rows[i];
      let selector = display.value[i][1] === null ? 'p' : 'input';
      (row?.querySelector(selector) as HTMLElement | null)?.focus();
      break;
    }
  }
}
function addProperty() {
  let tag = newProperty.value.trim();
  newProperty.value = '';
  if (!tag) return;
  for (let [prop, _] of display.value)
    if (prop === tag) {
      push.warning('属性已存在');
      focusProperty(tag);
      return;
    }
  display.value.push([tag, '']);
  display.value.sort((a, b) => a[0].localeCompare(b[0]));
  nextTick(() => focusProperty(tag));
}
</script>

<template>
  <div class="max-h-[300px] overflow-y-scroll">
    <table class="border-collapse w-full">
      <thead>
        <tr>
          <th class="p-1">属性</th>
          <th class="p-1">值</th>
        </tr>
      </thead>

      <tbody ref="tbody">
        <tr v-for="tv in display">
          <td class="text-gray-300 p-2 max-w-32 text-ellipsis overflow-hidden" :title="tv[0]">
            {{ tv[0] }}
          </td>
          <td v-if="!editing" class="p-2 max-w-64">
            <p
              v-if="tv[1] !== null"
              class="grow whitespace-nowrap text-ellipsis overflow-hidden"
              :title="tv[1]"
            >
              {{ tv[1] }}
            </p>
            <p v-else class="italic text-gray-400">空</p>
          </td>
          <td v-else class="p-1">
            <div class="flex gap-2">
              <template v-if="tv[1] !== null">
                <MInput variant="outline" class="grow min-w-24" v-model="tv[1]" />
                <button class="text-gray-300" @click="tv[1] = null">
                  <MIcon :icon="mdiMinusThick" />
                </button>
              </template>
              <template v-else>
                <p class="italic text-gray-400 grow" tabindex="-1">空</p>
                <button class="text-green-500" @click="tv[1] = ''">
                  <MIcon :icon="mdiPlusThick" />
                </button>
              </template>
              <button class="text-red-500" @click="display.splice(display.indexOf(tv), 1)">
                <MIcon :icon="mdiCloseThick" />
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="editing">
          <td class="p-1">
            <MInput
              variant="outline"
              class="min-w-0"
              size="10"
              v-model="newProperty"
              @enter="addProperty"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="flex justify-end gap-2 items-center mt-2">
    <MButton v-if="!editing && !saving" color="flat" @click="startEdit">编辑</MButton>
    <template v-else>
      <MButton color="red" :disabled="saving" @click="cancelEdit">取消</MButton>
      <MButton color="green" :disabled="saving" :loading="saving" @click="saveEdit">保存</MButton>
    </template>
  </div>
</template>

<style lang="scss">
table {
  border-collapse: collapse;
}
table td,
table th {
  @apply border border-slate-500;
}
table tr:first-child th {
  border-top: 0;
}
table tr:last-child td {
  border-bottom: 0;
}
table tr td:first-child,
table tr th:first-child {
  border-left: 0;
}
table tr td:last-child,
table tr th:last-child {
  border-right: 0;
}
</style>
