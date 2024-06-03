<script setup lang="ts">
const model = defineModel<boolean>({
  default: false
});
</script>

<template>
  <div class="can-click relative flex size-10 p-2.5" role="checkbox" @click="model = !model">
    <div class="absolute inset-0 rounded-full hover:bg-white/10" />
    <div
      class="flex h-full w-full rounded border-2 border-indigo-500 p-[1px]"
      :class="{
        'bg-indigo-500': model
      }"
    >
      <Transition name="fade">
        <svg v-if="model" focusable="false" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="none"
            stroke="currentColor"
            stroke-width="3.12"
            d="M1.73,12.91 8.1,19.28 22.79,4.59"
          />
        </svg>
      </Transition>
    </div>
  </div>
</template>
