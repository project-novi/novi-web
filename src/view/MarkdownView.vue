<script setup lang="ts">
import markdownit from 'markdown-it';
import markdownItReplaceLink, { type ReplaceLinkOptions } from 'markdown-it-replace-link';
import type { Token } from 'markdown-it/index.js';

import { inject, provide, ref } from 'vue';

import { callFunction } from '@/misc';
import type { IRawPartialNoviObject } from '@/model';
import { NoviObject } from '@/object';
import { compactModeKey, depthKey } from '@/ui';

import ObjectContent from '@/view/ObjectContent.vue';

const props = defineProps<{
  objectId: string;
}>();

const mdOptions = {
  linkify: true
};

const md = markdownit(mdOptions);
// @ts-ignore
markdownItReplaceLink(md, {
  processHTML: true,
  replaceLink: function (link, env, token, htmlToken) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(link) ? `/object/${link}` : link;
  }
} as ReplaceLinkOptions);
md.block.ruler.after('table', 'object_link', (state, startLine, endLine, silent) => {
  let start = state.bMarks[startLine] + state.tShift[startLine];
  let end = start + 40;
  if (end > state.eMarks[startLine]) return false;
  let matches = state.src
    .substring(start, end)
    .match(/^\[\[([0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12})\]\]$/i);
  if (!matches) return false;

  let id = matches[1];
  if (silent) return true;
  state.line = startLine + 1;
  if (!silent) {
    const el = state.push('object', 'object-content', 0);
    el.attrs = [['object-id', id]];
    el.map = [startLine, state.line];
    el.markup = '';
    el.info = '';
  }
  return true;
});

class ObjectId {
  constructor(public id: string) {}
}

interface Rendered {
  content: string;
  objects: IRawPartialNoviObject[];
}

const depth = inject(depthKey, 0);
provide(depthKey, depth + 1);

const compact = inject(compactModeKey, ref(false));

const content = ref<(string | ObjectId)[]>();
callFunction('markdown.render', { id: props.objectId }, (res) => {
  const raw = res as Rendered;
  let rawContent = md.parse(raw.content, {});
  if (depth >= 1) rawContent = rawContent.slice(0, 30);
  let buffer: Token[] = [];
  let c = [];
  function flush() {
    if (buffer.length > 0) {
      c.push(md.renderer.render(buffer, mdOptions, {}));
      buffer = [];
    }
  }
  for (let token of rawContent) {
    if (token.type === 'object') {
      flush();
      c.push(new ObjectId(token.attrs![0][1]));
    } else {
      buffer.push(token);
    }
  }
  flush();
  for (let obj of raw.objects) NoviObject.fromRaw(obj);
  content.value = c;
});
</script>

<template>
  <div
    class="m-auto min-w-[40vw] overflow-hidden lg:px-16 lg:py-8"
    :class="{
      'px-4 py-6': !compact
    }"
  >
    <article
      class="prose flex w-full max-w-none flex-col dark:prose-invert prose-pre:p-0 prose-img:mx-auto"
      :class="{ 'prose-img:my-0': compact }"
    >
      <template v-if="content" v-for="part in content">
        <div v-if="part instanceof ObjectId" class="self-center relative">
          <ObjectContent :objectId="part.id" />
        </div>
        <div v-else v-html="part" />
      </template>
    </article>
  </div>
</template>
