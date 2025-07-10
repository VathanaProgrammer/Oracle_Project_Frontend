<!-- components/ActionIcon.vue -->
<template>
  <div
    :class="[
      'flex-shrink-0 h-9 w-9 rounded-full p-1.5 flex items-center justify-center',
      iconMap[normalizedType]?.bg || 'bg-gray-300'
    ]"
  >
    <component
      :is="iconMap[normalizedType]?.icon || DefaultIcon"
      class="w-5 h-5 text-white"
    />
  </div>
</template>
<script>
import { CheckCircle, User, Trash, Pencil, XCircle } from 'lucide-vue-next'  // import XCircle for ended exam

const iconMap = {
  login:  { icon: User,        bg: 'bg-emerald-500' },
  submit: { icon: CheckCircle, bg: 'bg-indigo-500'  },
  delete: { icon: Trash,       bg: 'bg-rose-500'    },
  update: { icon: Pencil,      bg: 'bg-amber-500'   },
  ended_exam:  { icon: XCircle,     bg: 'bg-red-600'     }  // new icon + background for ended exam
}

export default {
  props: {
    type: { type: String, default: '' }
  },
  computed: {
    normalizedType() {
      return this.type?.toLowerCase()
    }
  },
  components: {
    CheckCircle,
    User,
    Trash,
    Pencil,
    XCircle,       // register XCircle component
    DefaultIcon: User
  },
  data() {
    return {
      iconMap
    }
  }
}
</script>
