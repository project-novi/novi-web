import { defineStore } from 'pinia';

export const usePref = defineStore('settings', {
  state: () => {
    let defaults = {
      sensitiveBlur: 'q',
      extraFilter: '@ -@hidden',
      useCustomIpfs: false,
      ipfsGateway: 'http://127.0.0.1:8080',
      orderByCreated: true,
      disableAnimation: false
    };
    try {
      let t = localStorage.getItem('settings');
      if (t) Object.assign(defaults, JSON.parse(t));
    } catch (e) {
      console.error(e);
    }
    return defaults;
  },
  actions: {
    save() {
      localStorage.setItem('settings', JSON.stringify(this.$state));
    }
  }
});
