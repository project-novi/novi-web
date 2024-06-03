import { ref, watch } from 'vue';

import { usePref } from '@/pref';

export default {
  mounted: (el: HTMLElement) => {
    const pref = usePref();
    let holding = ref(false);
    function addRipple(e: MouseEvent) {
      if (holding.value || pref.disableAnimation) return;
      holding.value = false;
      holding = ref(true);

      const ripple = document.createElement('span'),
        d = Math.max(el.clientWidth, el.clientHeight) * 2.5,
        rect = el.getBoundingClientRect();
      Object.assign(ripple.style, {
        position: 'absolute',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        width: `${d}px`,
        height: `${d}px`,
        top: `${e.clientY - rect.top - d / 2}px`,
        left: `${e.clientX - rect.left - d / 2}px`,
        pointerEvents: 'none'
      });

      ripple.classList.add('ripple-in');

      let first = false;
      const myHolding = holding;
      ripple.addEventListener('animationend', () => {
        if (first) el.removeChild(ripple);
        else {
          first = true;
          watch(
            myHolding,
            (holding) => {
              if (!holding && !ripple.classList.contains('ripple-out'))
                ripple.classList.add('ripple-out');
            },
            { immediate: true }
          );
        }
      });

      el.appendChild(ripple);
    }
    function cancel() {
      holding.value = false;
    }
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.addEventListener('mousedown', addRipple);
    el.addEventListener('mouseup', cancel);
    el.addEventListener('mouseleave', cancel);
  }
};
