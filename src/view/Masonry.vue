<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';

import { useElementSize } from '@vueuse/core';

type Key = string | number;

const root = ref<HTMLDivElement>();
const { width: elWidth } = useElementSize(root);

const props = withDefaults(
  defineProps<{
    items: any[];
    keyMapper?: (item: any, index: number) => Key;
    minWidth?: number;
    maxWidth?: number;
    width?: number;
    minColumns?: number;
    maxColumns?: number;
    gap?: number;
  }>(),
  {
    keyMapper: (_: any, index: number) => index,
    minColumns: 1,
    width: 140,
    gap: 5
  }
);

interface Column {
  items: any[];
  height?: number;
}
const columns = ref<Column[]>([]);

const columnCount = computed(() => {
  const count = (c: number) => Math.floor((elWidth.value + props.gap) / (c + props.gap));

  let columnCount = count(props.width);
  if (props.minWidth) columnCount = Math.min(columnCount, count(props.minWidth));
  if (props.maxWidth) columnCount = Math.max(columnCount, count(props.maxWidth));
  columnCount = Math.max(columnCount, props.minColumns);
  if (props.maxColumns) columnCount = Math.min(columnCount, props.maxColumns);

  return columnCount;
});

// can't believe I have to write this myself
function arrayEqual(a: any[], b: any[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

var lastKeys: Key[] = [];
var redrawing = false,
  hasPendingRedraw = false,
  lastRedrawColumnCount = 0;
async function redraw() {
  if (elWidth.value === 0) return;
  if (redrawing) {
    hasPendingRedraw = true;
    return;
  }
  const keys = props.items.map((item, index) => props.keyMapper(item, index));
  if (lastRedrawColumnCount === columnCount.value && arrayEqual(keys, lastKeys)) return;
  redrawing = true;
  lastRedrawColumnCount = columnCount.value;

  const scrollY = window.scrollY;

  let reuse = 0;
  if (columnCount.value === columns.value.length) {
    while (reuse < keys.length && reuse < lastKeys.length && keys[reuse] === lastKeys[reuse])
      reuse++;
    for (let column of columns.value) {
      let l = 0,
        r = column.items.length;
      while (l < r) {
        const m = Math.floor((l + r) / 2);
        if (column.items[m] < reuse) l = m + 1;
        else r = m;
      }
      if (l < column.items.length) column.items.splice(l, column.items.length - l);
    }
  } else
    columns.value = Array.from({ length: columnCount.value }, () => ({
      items: [],
      height: undefined
    }));

  lastKeys = keys;
  await nextTick();
  const columnDivs = [].slice.call(root.value?.children) as HTMLDivElement[];
  for (let i = 0; i < columns.value.length; i++)
    columns.value[i].height = columnDivs[i].scrollHeight;

  const firstCol = columns.value[0].items,
    initialLength = firstCol.length;
  for (let i = reuse; i < props.items.length; i++) firstCol.push(i);
  await nextTick();

  let itemHeights = [];
  for (let child of columnDivs[0].children) itemHeights.push(child.getBoundingClientRect().height);
  itemHeights = itemHeights.slice(initialLength);
  firstCol.splice(initialLength, firstCol.length - initialLength);

  // TODO optimize
  let heights = columns.value.map((col) => col.height!);
  for (let i = 0; i < props.items.length - reuse; i++) {
    let bestCol = 0;
    for (let j = 1; j < columns.value.length; j++)
      if ((heights[j] ?? 0) < (heights[bestCol] ?? 0)) {
        bestCol = j;
      }
    columns.value[bestCol].items.push(reuse + i);
    heights[bestCol] = (heights[bestCol] ?? 0) + (itemHeights[i] ?? 0) + props.gap;
  }
  for (let column of columns.value) column.height = undefined;
  await nextTick();

  window.scrollTo({ top: scrollY });

  redrawing = false;
  if (hasPendingRedraw) {
    hasPendingRedraw = false;
    redraw();
  }
}

watch([columnCount, () => props.items], () => redraw(), { immediate: true });
</script>

<template>
  <div class="flex justify-center" :style="{ gap: `${gap}px` }" ref="root">
    <div
      v-for="column in columns"
      class="flex min-w-0 flex-grow flex-col"
      :style="{
        gap: `${gap}px`,
        'max-width': maxWidth ? `${maxWidth}px` : 'auto',
        'flex-basis': `${width}px`,
        height:
          column.height === undefined
            ? (['-webkit-max-content', '-moz-max-content', 'max-content'] as any)
            : `${column.height}px`,
        'overflow-y': column.height === undefined ? undefined : 'hidden'
      }"
    >
      <div v-for="index in column.items" :key="keyMapper(items[index], index)">
        <slot :item="items[index]" />
      </div>
    </div>
  </div>
</template>
