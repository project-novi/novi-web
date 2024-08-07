<script setup lang="ts">
import { inject, nextTick, ref, watch } from 'vue';

import { push } from 'notivue';

import type { IRawNoviObject } from '@/model';
import { type INoviObject } from '@/object';
import { useFetch } from '@/query';
import { openSectionKey, useHotKey } from '@/ui';

import { MButton } from '@/m';

import TagInput from '@/view/TagInput.vue';
import TagView from '@/view/TagView.vue';

const props = defineProps<{
  object: INoviObject;
}>();

const openSection = inject(openSectionKey)!;

const editing = ref(false),
  saving = ref(false);

const userTags = ref<string[]>([]);
watch(
  () => props.object,
  (obj) => {
    let tags = [];
    for (let tag in obj.tags) if (!tag.startsWith('@')) tags.push(tag);
    tags.sort();
    userTags.value = tags;
  },
  { immediate: true, deep: true }
);
const display = ref<string[]>([]);
watch(
  userTags,
  (tags) => {
    if (editing.value) return;
    display.value = tags;
  },
  { immediate: true }
);

const tagInputEl = ref<typeof TagInput>();
function startEdit() {
  if (editing.value) return false;
  openSection();
  tagInput.value = '';
  editing.value = true;
  display.value = [...userTags.value];
  nextTick(() => {
    let el = tagInputEl.value;
    if (!el) return;
    (el.$el as HTMLElement).querySelector('input')?.focus();
  });
}
useHotKey('e', startEdit);

function cancelEdit() {
  if (!editing.value) return false;
  editing.value = false;
  display.value = userTags.value;
}
useHotKey('Escape', cancelEdit, { allowEdit: true });

function saveEdit() {
  if (!editing.value || saving.value) return false;
  addTag();
  let tags: Record<string, null> = {};
  for (let tag of display.value) tags[tag] = null;
  useFetch(
    `/objects/${props.object.id}`,
    {
      method: 'PUT',
      query: { scopes: '' },
      json: tags
    },
    {
      loading: saving,
      toast: true,
      map(raw) {
        props.object.assign(raw as IRawNoviObject);
        push.success('已保存');
        editing.value = false;
      }
    }
  );
}

function deleteTag(tag: string) {
  if (!editing.value) return;
  display.value = display.value.filter((t) => t !== tag);
}
const tagInput = ref('');
function addTag() {
  if (!editing.value) return;
  let tag = tagInput.value.trim();
  tagInput.value = '';
  if (!tag) return;
  if (display.value.includes(tag)) {
    push.warning('标签已存在');
    return;
  }
  display.value.push(tag);
}
</script>

<template>
  <div v-if="display">
    <TransitionGroup name="tags">
      <TagView
        v-for="tag in display"
        :tag="tag"
        :key="tag"
        :editing="editing"
        @delete="deleteTag"
      />
    </TransitionGroup>
  </div>
  <div v-else class="flex p-4">
    <span class="mx-auto italic font-semibold">暂无标签</span>
  </div>
  <div class="flex justify-end gap-2 items-center mt-2">
    <MButton v-if="!editing && !saving" color="flat" @click="startEdit">编辑</MButton>
    <template v-else>
      <TagInput
        class="grow"
        :disabled="saving"
        autofocus
        @enter="
          (e: KeyboardEvent) => {
            addTag();
            e.preventDefault();
            if (e.ctrlKey) saveEdit();
          }
        "
        v-model="tagInput"
        ref="tagInputEl"
      />
      <MButton color="red" :disabled="saving" @click="cancelEdit">取消</MButton>
      <MButton color="green" :disabled="saving" :loading="saving" @click="saveEdit"> 保存 </MButton>
    </template>
  </div>
</template>

<style>
.tags-move,
.tags-enter-active,
.tags-leave-active {
  transition: all 0.4s;
  transition-property: transform, opacity;
}

.tags-enter-from,
.tags-leave-to {
  opacity: 0;
  transform: translate(30px, 0);
}

.tags-leave-active {
  position: absolute;
}
</style>
