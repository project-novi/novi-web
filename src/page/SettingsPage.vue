<script setup lang="ts">
import { reactive, ref, watch } from 'vue';

import { push } from 'notivue';

import { RATING_MAP } from '@/misc';
import { usePref } from '@/pref';
import { useUIState } from '@/ui';

import { MButton, MCheckbox, MInput, MSelect } from '@/m';

import InputWithCheck from '@/view/InputWithCheck.vue';

import { mdiAlphaEBox, mdiFanOff, mdiFilter } from '@mdi/js';

import Item from './settings/Item.vue';
import Section from './settings/Section.vue';

const IPFS_SVG =
  'M12 0 1.608 6v12L12 24l10.392-6V6zm-1.073 1.445h.001a1.8 1.8 0 0 0 2.138 0l7.534 4.35a1.794 1.794 0 0 0 0 .403l-7.535 4.35a1.8 1.8 0 0 0-2.137 0l-7.536-4.35a1.795 1.795 0 0 0 0-.402zM21.324 7.4c.109.08.226.147.349.201v8.7a1.8 1.8 0 0 0-1.069 1.852l-7.535 4.35a1.8 1.8 0 0 0-.349-.2l-.009-8.653a1.8 1.8 0 0 0 1.07-1.851zm-18.648.048 7.535 4.35a1.8 1.8 0 0 0 1.069 1.852v8.7c-.124.054-.24.122-.349.202l-7.535-4.35a1.8 1.8 0 0 0-1.069-1.852v-8.7a1.85 1.85 0 0 0 .35-.202z';

const ui = useUIState();

const pref = usePref();
const edit = reactive({ ...pref.$state });

const modified = ref(false);
watch(edit, () => (modified.value = true));

function save() {
  pref.$patch(edit);
  pref.save();
  modified.value = false;
  push.success('设置已保存');
}

const editingFilter = ref<string | null>(null);
const editingIpfsGateway = ref<string | null>(null);
</script>

<template>
  <div>
    <div class="p-4">
      <div class="mx-auto flex max-w-xl flex-col gap-4">
        <Section title="搜索">
          <Item
            :icon="mdiAlphaEBox"
            title="敏感内容阈值"
            description="对评级高于阈值的内容缩略图打码"
          >
            <MSelect
              :values="['g', 's', 'q', 'e', 'n']"
              v-model="edit.sensitiveBlur"
              v-slot="{ value, preview }"
            >
              <p class="select-none p-2" :class="{ 'min-w-[100px]': !preview }">
                {{ value === 'n' ? '不限制' : RATING_MAP[value] }}
              </p>
            </MSelect>
          </Item>

          <Item :icon="mdiFilter" title="额外过滤">
            <MButton
              color="flat"
              :class="{ 'text-red-500': editingFilter !== null }"
              @click="editingFilter = editingFilter === null ? edit.extraFilter : null"
            >
              {{ editingFilter === null ? '编辑' : '取消' }}
            </MButton>
            <template #extra>
              <div
                class="overflow-hidden transition-[max-height]"
                :class="{
                  'max-h-0': editingFilter === null,
                  'max-h-12': editingFilter !== null
                }"
              >
                <InputWithCheck
                  class="mt-1 w-full"
                  variant="flat"
                  check-color="text-white"
                  @commit="
                    () => {
                      edit.extraFilter = editingFilter!;
                      editingFilter = null;
                    }
                  "
                  v-model="editingFilter"
                />
              </div>
            </template>
          </Item>
        </Section>

        <Section title="文件">
          <Item :icon="IPFS_SVG" title="使用自定义 IPFS 网关">
            <MCheckbox v-model="edit.useCustomIpfs" />
            <template #extra>
              <div
                class="overflow-hidden transition-[max-height]"
                :class="{
                  'max-h-0': !edit.useCustomIpfs,
                  'max-h-12': edit.useCustomIpfs
                }"
              >
                <MInput
                  class="mt-1 w-full"
                  variant="flat"
                  check-color="text-white"
                  v-model="edit.ipfsGateway"
                />
              </div>
            </template>
          </Item>
        </Section>

        <Section title="界面">
          <Item :icon="mdiFanOff" title="禁用动画" description="禁用动画以减少性能损耗">
            <MCheckbox v-model="edit.disableAnimation" />
          </Item>
        </Section>
      </div>
    </div>

    <div
      class="fixed left-0 right-0 h-12 px-4 transition-[left,top]"
      :class="{
        'md:left-16': !ui.navRailHidden,
        'top-full opacity-0': !modified,
        'top-[calc(100%-3.75rem)]': modified
      }"
    >
      <div
        class="mx-auto flex h-full w-full max-w-lg items-center rounded-sm bg-gray-700 p-4 shadow-xl"
      >
        <p class="text-sm">设置已发生更改</p>
        <MButton color="flat" class="-mr-2 ml-auto" @click="save">保存</MButton>
      </div>
    </div>
  </div>
</template>
