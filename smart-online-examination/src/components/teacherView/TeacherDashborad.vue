<template>
  <div class="h-screen w-screen bg-gray-100 flex">
    <!-- Overlay: fades only -->
    <transition name="overlay-fade">
      <div
        v-if="sidebarVisible"
        class="fixed inset-0 bg-black bg-opacity-30 z-40 xl:hidden"
        @click.self="sidebarVisible = false"
      ></div>
    </transition>

    <!-- Sidebar for small screens: slide + fade -->
    <transition name="fade-slide">
      <aside
        v-if="sidebarVisible"
        class="fixed left-0 top-0 bg-white w-64 h-full shadow-lg z-50 flex flex-col xl:hidden"
      >
        <div class="p-4 flex justify-between w-full">
          <div class="flex items-center justify-center">
            <EduIcon class="w-11 h-11 text-[#8C09F4]" />
            <span class="text-2xl text-gray-700 font-bold ps-1">SmartExam</span>
          </div>
          <button
            @click="sidebarVisible = false"
            class="text-gray-700 hover:text-gray-900 focus:outline-none"
            title="Close sidebar"
          >
            <CloseIcon class="w-6 h-6 opacity-70"/>
          </button>
        </div>

        <div class="w-full px-4 pb-2 mt-5">
          <div
            class="px-4 py-2 rounded-[5px] flex justify-start items-center bg-[#8c09f4] text-white cursor-pointer hover:bg-[#8c09f4]"
          >
            <DashboardIcon class="text-white w-5 h-5"></DashboardIcon>
            <span class="text-lg text-white font-normal ps-2">Dashboard</span>
            <RightPointerIcon
              :class="showDashboardMenu
                ? ['fill-white', 'ms-auto', 'w-7', 'h-7', 'rotate-90', 'transition-transform', 'duration-300']
                : ['fill-white', 'ms-auto', 'w-7', 'h-7']"
            />
          </div>
        </div>

        <!-- ✅ Logout Button -->
        <div class="mt-auto w-full px-4 pb-6">
          <button
            @click="logout"
            class="flex items-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white text-base py-2 px-4 rounded-[5px] transition-all duration-300"
          >
            <LogoutIcon class="w-5 h-5 text-white" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </transition>

    <!-- Permanent Sidebar for xl+ screens -->
    <aside class="hidden xl:flex bg-white shadow-lg w-96 h-screen flex flex-col">
      <div class="p-4 flex justify-between w-full">
        <div class="flex items-center justify-center">
          <EduIcon class="w-11 h-11 text-[#8C09F4]" />
          <span class="text-2xl text-gray-700 font-bold ps-1">SmartExam</span>
        </div>
        <div class="flex flex-col items-center justify-center">
          <ExpaneIcon class="fill-current text-gray-700" />
        </div>
      </div>

      <RouterLink to="/teacher-dashboard" class="w-full px-4 pb-2 mt-5">
        <div
          class="px-4 py-2 rounded-[5px] flex justify-start items-center bg-[#8c09f4] text-white cursor-pointer hover:bg-[#8c09f4]"
        >
          <DashboardIcon class="text-white w-5 h-5"></DashboardIcon>
          <span class="text-lg text-white font-[500] ps-2">Dashboard</span>
          <RightPointerIcon
            @click="toggleDashboardMenu()"
            :class="showDashboardMenu
              ? ['fill-white', 'ms-auto', 'w-7', 'h-7', 'rotate-90', 'transition-transform', 'duration-300']
              : ['fill-white', 'ms-auto', 'w-7', 'h-7']"
          />
        </div>
      </RouterLink>

      <RouterLink to="/teacher-dashboard/ExamManagement" class="w-full px-4 pb-2 mt-1">
        <div
          class="px-4 py-2 rounded-[5px] flex justify-start items-center bg-[#8c09f4] text-white cursor-pointer hover:bg-[#8c09f4]"
        >
          <ListIcon class="text-white w-5 h-5"></ListIcon>
          <span class="text-lg text-white font-[500] ps-2">Exam Management</span>
          <RightPointerIcon
            :class="showDashboardMenu
              ? ['fill-white', 'ms-auto', 'w-7', 'h-7', 'rotate-90', 'transition-transform', 'duration-300']
              : ['fill-white', 'ms-auto', 'w-7', 'h-7']"
          />
        </div>
      </RouterLink>

      <RouterLink to="/teacher-dashboard/student-results" class="w-full px-4 pb-2 mt-1">
        <div
          class="px-4 py-2 rounded-[5px] flex justify-start items-center bg-[#8c09f4] text-white cursor-pointer hover:bg-[#8c09f4]"
        >
          <ResultIcon class="text-white w-5 h-5"></ResultIcon>
          <span class="text-lg text-white font-[500] ps-2">Student Results</span>
          <RightPointerIcon
            :class="showDashboardMenu
              ? ['fill-white', 'ms-auto', 'w-7', 'h-7', 'rotate-90', 'transition-transform', 'duration-300']
              : ['fill-white', 'ms-auto', 'w-7', 'h-7']"
          />
        </div>
      </RouterLink>

      <RouterLink to="" class="w-full px-4 pb-2 mt-1">
        <div
          class="px-4 py-2 rounded-[5px] flex justify-start items-center bg-[#8c09f4] text-white cursor-pointer hover:bg-[#8c09f4]"
        >
          <MaterrialsIcon class="text-white w-5 h-5"></MaterrialsIcon>
          <span class="text-lg text-white font-[500] ps-2">View Materails</span>
          <RightPointerIcon
            :class="showDashboardMenu
              ? ['fill-white', 'ms-auto', 'w-7', 'h-7', 'rotate-90', 'transition-transform', 'duration-300']
              : ['fill-white', 'ms-auto', 'w-7', 'h-7']"
          />
        </div>
      </RouterLink>

      <RouterLink to="/student-dashboard/settings/account" class="w-full px-4 pb-2 mt-1">
        <div
          class="px-4 py-2 rounded-[5px] flex justify-start items-center bg-[#8c09f4] text-white cursor-pointer hover:bg-[#8c09f4]"
        >
          <SettingIcon class="text-white w-5 h-5"></SettingIcon>
          <span class="text-lg text-white font-[500] ps-2">Profile Settings</span>
          <RightPointerIcon
            :class="showDashboardMenu
              ? ['fill-white', 'ms-auto', 'w-7', 'h-7', 'rotate-90', 'transition-transform', 'duration-300']
              : ['fill-white', 'ms-auto', 'w-7', 'h-7']"
          />
        </div>
      </RouterLink>

      <!-- ✅ Logout Button -->
      <div class="mt-auto w-full px-4 pb-6">
        <button
          @click="logout"
          class="flex items-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white text-base py-2 px-4 rounded-[5px] transition-all duration-300"
        >
          <LogoutIcon class="w-5 h-5 text-white" />
          <span>Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="w-full px-3 overflow-y-auto h-screen">
      <!-- Header -->
      <header class="flex items-center justify-between bg-white shadow-md rounded-md px-4 py-3 my-4 sticky top-3">
        <!-- Left: Hamburger + Search -->
        <div class="flex items-center gap-2">
          <button @click="sidebarVisible = true" class="xl:hidden p-2 rounded hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div class="flex items-center rounded-md px-3 py-1">
            <SearchBarIcon class="w-5 h-5 text-gray-500" />
            <span class="ml-2 text-gray-500">Search</span>
          </div>
        </div>

        <!-- Right: Notifications + Profile -->
        <div class="flex items-center gap-4">
          <button class="relative p-2 rounded hover:bg-gray-200">
            <NotifIcon class="w-5 h-5 text-gray-600" />
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <img src="../../assets/images/85806da35744d137146ba5f57e4dcc1f.jpg" alt="Profile" class="w-8 h-8 rounded-full object-cover" />
        </div>
      </header>

      <main class="mx-auto max-w-screen-xl">
        <RouterView />
      </main>
    </div>
  </div>
</template>


<script>
import EduIcon from '../icons/EduIcon.vue';
import ExpaneIcon from '../icons/ExpaneIcon.vue';
import DashboardIcon from '../icons/DashboardIcon.vue';
import RightPointerIcon from '../icons/RightPointerIcon.vue';
import SearchBarIcon from '../icons/SearchBarIcon.vue';
import NotifIcon from '../icons/NotifIcon.vue';
import CloseIcon  from '../icons/CloseIcon.vue';
import ListIcon from '../icons/ListIcon.vue';
import MaterrialsIcon from '../icons/MaterrialsIcon.vue';
import ResultIcon from '../icons/ResultIcon.vue';
import SettingIcon from '../icons/SettingIcon.vue';
import LogoutIcon from '../icons/LogoutIcon.vue';
import axios from 'axios';
import { API_BASE_URL } from '@/config/useWebSocket';
export default {
  components: {
    EduIcon,
    ExpaneIcon,
    DashboardIcon,
    RightPointerIcon,
    SearchBarIcon,
    NotifIcon,
    CloseIcon,
    ListIcon,
    MaterrialsIcon,
    ResultIcon,
    SettingIcon,
    LogoutIcon
  },
  data() {
    return {
      sidebarVisible: false,
      showDashboardMenu: true,
    };
  },
  methods: {
    toggleDashboardMenu() {
      this.showDashboardMenu = !this.showDashboardMenu;
    },
    async logout() {
      if (confirm("Are you sure you want to logout?")) {
        try {
          const response = await axios.post(
            API_BASE_URL + "/api/user/logout",
            {}, // empty body
            { withCredentials: true } // ✅ put it here
          );
          // this.userStore.logout();
          this.$router.push("/");
          this.userStore.user = null; // Clear user from store
          console.log("Logout successful:", this.userStore.user);
          console.log("Logout response:", response.data); 
        } catch (error) {
          console.error("Logout failed:", error);
        }
      } else {
        console.log("Logout cancelled.");
      }
    },
  },
};
</script>

<style>
/* Overlay fade only */
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: opacity 0.3s ease;
}
.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
}
.overlay-fade-enter-to,
.overlay-fade-leave-from {
  opacity: 1;
}


.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}

/* Dashboard submenu slide fade (optional, keep your original styles) */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-0.5rem);
}
.slide-fade-enter-to,
.slide-fade-leave-from {
max-height: 10rem;
opacity: 1;
transform: translateY(0);
}
</style>