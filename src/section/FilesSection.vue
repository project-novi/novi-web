<script setup lang="ts">
import { computed } from 'vue';

import type { INoviObject } from '@/object';

import FileTag from './files/FileTag.vue';

const props = defineProps<{
  object: INoviObject;
}>();

const variants = computed(() => props.object.subtags('@file'));
const displayVariants = computed(() => {
  let vars = { ...variants.value };
  let result = [];
  for (let [v, name] of [
    ['original', '原始文件'],
    ['mozjpeg', '优化图片 (MozJPEG)'],
    ['avif', '优化图片 (AVIF)'],
    ['thumbnail', '缩略图']
  ])
    if (v in vars) {
      result.push([name, v]);
      delete vars[v];
    }

  for (let v of Object.keys(vars).sort()) result.push([v, v]);
  return result;
});
</script>

<template>
  <div class="-mb-1">
    <FileTag
      v-for="t in displayVariants"
      :object="object"
      :name="t[0]"
      :variant="t[1]"
      :key="t[1]"
    />
  </div>
</template>
