// @ts-ignore
import rawTailwindConfig from '../tailwind.config';
import { defineStore } from 'pinia';
import resolveConfig from 'tailwindcss/resolveConfig';

import {
  type InjectionKey,
  type Ref,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted
} from 'vue';

const taliwindConfig = resolveConfig(rawTailwindConfig);

export function useEventListener(
  name: string,
  callback: EventListenerOrEventListenerObject,
  target: EventTarget = document
) {
  onMounted(() => target.addEventListener(name, callback));
  onActivated(() => target.addEventListener(name, callback));
  onUnmounted(() => target.removeEventListener(name, callback));
  onDeactivated(() => target.removeEventListener(name, callback));
}

export function parseKeyPattern(key: string) {
  let ctrl = key.startsWith('Ctrl+');
  if (ctrl) key = key.slice(5);
  let shift = key.startsWith('Shift+');
  if (shift) key = key.slice(6);
  let alt = key.startsWith('Alt+');
  if (alt) key = key.slice(4);
  return { ctrl, shift, alt, key };
}

interface HotKeyOptions {
  allowEdit?: boolean;
}
export function useHotKey(
  pattern: string,
  callback: (event: KeyboardEvent) => boolean | void,
  options?: HotKeyOptions
) {
  let { ctrl, shift, alt, key } = parseKeyPattern(pattern);
  useEventListener('keydown', (e) => {
    if (e.defaultPrevented) return;
    let target = e.target as HTMLElement;
    if (!options?.allowEdit && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'))
      return;
    let keyEvent = e as KeyboardEvent;
    if (keyEvent.ctrlKey !== ctrl || keyEvent.shiftKey !== shift || keyEvent.altKey !== alt) return;
    if (keyEvent.key !== key) return;
    if (callback(keyEvent) !== false) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  });
}

export enum SearchState {
  Idle,
  Searching,
  Error
}

export const useUIState = defineStore('ui-state', {
  state: () => ({
    searchState: SearchState.Idle,
    navRailExpanded: false,
    navRailHidden: false,
    pageLoading: false
  }),
  actions: {
    toggleNavRail() {
      if (window.innerWidth >= getScreenBreakpoint('md')) this.navRailHidden = !this.navRailHidden;
      else this.navRailExpanded = !this.navRailExpanded;
    }
  }
});

export function getScreenBreakpoint(breakpoint: string) {
  return parseInt(taliwindConfig.theme.screens[breakpoint]);
}

export const depthKey = Symbol() as InjectionKey<number>;
export const compactModeKey = Symbol() as InjectionKey<Ref<boolean>>;
