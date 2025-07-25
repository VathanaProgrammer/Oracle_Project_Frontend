<template>
  <button
    :class="[
      'ripple-btn inline-flex items-center gap-2 px-4 py-2 text-md font-medium rounded-md shadow focus:outline-none transition relative overflow-hidden',
      bgColor,
      hoverColor,
      textColor
    ]"
    @click="triggerRipple"
  >
    <!-- Icon slot, fallback to plus icon if none provided -->
    <slot name="icon">
      <svg class="w-5 h-5 z-10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    </slot>

    <span class="z-10">{{ label }}</span>

    <span
      v-for="ripple in ripples"
      :key="ripple.id"
      class="ripple-bar animate"
      @animationend="removeRipple(ripple.id)"
    ></span>
  </button>
</template>

<script>
let rippleId = 0;

export default {
  name: 'ReusableRippleButton',
  props: {
    label: {
      type: String,
      default: 'Button',
    },
    bgColor: {
      type: String,
      default: 'bg-indigo-600',
    },
    hoverColor: {
      type: String,
      default: 'hover:bg-indigo-700',
    },
    textColor: {
      type: String,
      default: 'text-white',
    },
  },
  data() {
    return {
      ripples: [],
    };
  },
  methods: {
    triggerRipple() {
      const id = rippleId++;
      this.ripples.push({ id });
    },
    removeRipple(id) {
      this.ripples = this.ripples.filter(r => r.id !== id);
    },
  },
};
</script>

<style scoped>
.ripple-btn {
  position: relative;
  overflow: hidden;
}

.ripple-bar {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  border-radius: 4px;
  z-index: 0;
}

.animate {
  animation: ripple-horizontal 0.6s ease-out forwards;
}

@keyframes ripple-horizontal {
  0% {
    width: 0%;
    opacity: 1;
  }
  100% {
    width: 200%;
    opacity: 0;
  }
}
</style>
