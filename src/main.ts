import 'notivue/animations.css';
import { createPinia } from 'pinia';

import { createApp, watch } from 'vue';

import { createNotivue } from 'notivue';

import '@/assets/main.css';

import App from './App.vue';
import { usePref } from './pref';
import router from './router';
import { useUIState } from './ui';

const app = createApp(App);

app
  .use(createPinia())
  .use(router)
  .use(
    createNotivue({
      notifications: {
        global: {
          duration: 3000
        }
      }
    })
  );

app.mount('#app');

const ui = useUIState();
router.beforeEach((_from, _to, next) => {
  ui.pageLoading = true;
  next();
});
router.afterEach(() => (ui.pageLoading = false));

const prefs = usePref();
prefs.$subscribe(() => {
  window.ipfsGateway = prefs.useCustomIpfs ? prefs.ipfsGateway : null;
});
