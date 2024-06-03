<script setup lang="ts">
import { computed, ref } from 'vue';

export interface MInputProps {
  tagName?: string;
  error?: boolean;
  variant?: 'card' | 'outline' | 'flat';
}

const props = withDefaults(defineProps<MInputProps>(), {
  tagName: 'input',
  error: false,
  variant: 'card'
});

defineEmits<{
  blur: [];
  focus: [];
  enter: [KeyboardEvent];
}>();

const model = defineModel();

const rounded = computed(() => props.variant === 'card' || props.variant === 'outline');
const focused = ref(false);
</script>

<template>
  <div class="relative" :class="{ 'overflow-hidden rounded': rounded }">
    <div v-if="variant !== 'outline'" class="absolute bottom-0 flex w-full justify-center">
      <div
        class="transition-[width,height]"
        :class="{
          'size-0': !focused,
          'h-[3px] w-full': focused,
          'bg-indigo-600': !error && variant === 'card',
          'bg-indigo-400': !error && variant === 'flat',
          'bg-red-600': error
        }"
      />
    </div>

    <div class="absolute left-0 top-0 h-full">
      <slot name="prefix" />
    </div>

    <component
      :is="tagName"
      v-bind="$attrs"
      class="w-full p-2 text-sm outline outline-2 -outline-offset-1"
      :class="{
        'bg-white text-black caret-indigo-700 shadow-md outline-none disabled:bg-gray-600 disabled:text-gray-300':
          variant === 'card',
        rounded: focused || variant === 'outline',
        'border-none': variant === 'card' || variant === 'outline',
        'bg-transparent caret-indigo-300 disabled:text-gray-400':
          variant === 'outline' || variant === 'flat',
        'outline-indigo-400 focus:-outline-offset-2  disabled:outline-gray-500': variant === 'outline',
        'border-b-[1px] border-white outline-none ': variant === 'flat',
        'outline-red-600': error && variant !== 'flat'
      }"
      :value="model"
      @input="(e: Event) => (model = (e.target as HTMLInputElement).value)"
      @blur="
        () => {
          focused = false;
          $emit('blur');
        }
      "
      @focus="
        () => {
          focused = true;
          $emit('focus');
        }
      "
      @keydown.enter="(e: KeyboardEvent) => $emit('enter', e)"
    />

    <div class="absolute right-0 top-0 h-full">
      <slot name="suffix" />
    </div>
  </div>
</template>
