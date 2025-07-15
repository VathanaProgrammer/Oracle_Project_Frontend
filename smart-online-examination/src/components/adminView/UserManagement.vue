<template>
  <div>
    <!-- Summary cards -->
    <section class="count-students-teachers-admin-summary">
      <div class="flex flex-col md:flex-row gap-4">
        <div
          class="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-lg px-6 py-6 flex justify-between items-stretch w-full md:w-1/3 min-h-36"
        >
          <div class="flex flex-col justify-between">
            <h2 class="text-gray-700 font-semibold text-5xl">1287</h2>
            <h3 class="text-gray-500 text-md font-[500] self-start">
              Total Students
            </h3>
          </div>
          <div class="bg-blue-800 bg-opacity-20 rounded-md p-2 h-fit">
            <StudentIcon class="w-11 h-11 text-[#8C09F4]" />
          </div>
        </div>

        <div
          class="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-lg px-6 py-6 flex justify-between items-stretch w-full md:w-1/3 min-h-36"
        >
          <div class="flex flex-col justify-between">
            <h2 class="text-gray-700 font-semibold text-5xl">120</h2>
            <h3 class="text-gray-500 text-md font-[500] self-start">
              Total Teachers
            </h3>
          </div>
          <div class="bg-green-500 bg-opacity-20 rounded-md p-2 h-fit">
            <TeacherIcon class="w-11 h-11 text-green-600" />
          </div>
        </div>

        <div
          class="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] rounded-lg px-6 py-6 flex justify-between items-stretch w-full md:w-1/3 min-h-36"
        >
          <div class="flex flex-col justify-between">
            <h2 class="text-gray-700 font-semibold text-5xl">3</h2>
            <h3 class="text-gray-500 text-md font-[500] self-start">
              Total Admins
            </h3>
          </div>
          <div class="bg-yellow-400 bg-opacity-20 rounded-md p-2 h-fit">
            <AdminIcon class="w-11 h-11 text-yellow-500" />
          </div>
        </div>
      </div>
    </section>

    <!-- Filter and search -->
    <section
      class="filter-search-role-export-add-new-user rounded-md py-6 px-8 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] mt-5 md:min-h-[500px]"
    >
      <h3 class="text-gray-700 text-md font-normal mb-2">Filter</h3>

      <div class="flex items-center justify-between gap-4">
        <!-- ✅ Listbox with no Transition -->
        <Listbox v-model="selectedRole" v-slot="{ open }">
          <div class="relative w-64">
            <ListboxButton
              :class="[
                'relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-[0_4px_20px_rgba(0,0,0,0.1)] sm:text-sm transition-all',
                open ? 'ring-2 ring-[#8c09f4]' : '',
              ]"
            >
              <span class="block truncate">{{
                selectedRole || "All Roles"
              }}</span>
              <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                <svg
                  class="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.653a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </ListboxButton>

            <ListboxOptions
              class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none lg:text-md sm:text-sm"
            >
              <ListboxOption
                v-for="role in roles"
                :key="role"
                :value="role"
                class="cursor-pointer select-none py-2 pl-4 pr-4 hover:bg-indigo-100 flex items-center gap-2"
                v-slot="{ selected }"
              >
                <span v-if="selected" class="text-indigo-600">✔</span>
                <span :class="selected ? 'font-semibold' : 'font-normal'">
                  {{ role }}
                </span>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>

        <!-- Search -->
        <div class="flex justify-end items-center w-full lg:max-w-[600px]">
          <input
            type="text"
            placeholder="search for all user or role"
            class="w-full min-w-[280px] px-4 py-[6px] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8c09f4]"
          />
          <SearchIcon
            class="w-[38px] h-[38px] text-white bg-[#8c09f4] shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-1 rounded-md ms-2"
          />
        </div>
      </div>
      <div class="mt-4 py-4">
        <div class="flex items-center justify-between gap-4">
          <!-- Limit Listbox -->
          <Listbox v-model="selectedLimit" v-slot="{ open }">
            <div class="relative w-24">
              <ListboxButton
                :class="[
                  'relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-[0_4px_20px_rgba(0,0,0,0.1)] sm:text-sm transition-all',
                  open ? 'ring-2 ring-[#8c09f4]' : '',
                ]"
              >
                <span class="block truncate">{{
                  selectedLimit || "Limit: 10"
                }}</span>
                <span class="absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg
                    class="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.653a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
              </ListboxButton>

              <ListboxOptions
                class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              >
                <ListboxOption
                  v-for="limit in limits"
                  :key="limit"
                  :value="limit"
                  class="cursor-pointer select-none py-2 pl-4 pr-4 hover:bg-indigo-100 flex items-center gap-2"
                  v-slot="{ selected }"
                >
                  <span v-if="selected" class="text-indigo-600">✔</span>
                  <span :class="selected ? 'font-semibold' : 'font-normal'">
                    {{ limit }}
                  </span>
                </ListboxOption>
              </ListboxOptions>
            </div>
          </Listbox>

          <!-- Add New Button -->
          <RippleButton
            label="Add new user"
            bg-color="bg-green-600"
            hover-color="hover:bg-green-700"
          >
          </RippleButton>
        </div>
        <div
          class="mt-4 overflow-x-auto border-t-2 border-gray-200 rounded-md shadow-sm"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  <input
                    class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-2 focus:rounded focus:ring-blue-500"
                    type="checkbox"
                  />
                </th>
                <th
                  class="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  class="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  class="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Phone
                </th>
                <th
                  class="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Example row -->
              <tr v-if="users.length === 0">
                <td colspan="5" class="px-4 py-3 text-center text-gray-500">
                  No users found.
                </td>
              </tr>

              <tr v-for="user in users" :key="user.id">
                <td class="px-4 py-3">
                  <input
                    class="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-2 focus:rounded focus:ring-blue-500"
                    type="checkbox"
                  />
                </td>

                <td class="px-4 py-3 flex items-center space-x-3">
                  <img
                    :src="API_BASE_PROFILE_URL + '/' + user.profilePicture"
                    alt="Profile"
                    class="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p class="font-medium text-gray-700">
                      {{ user.firstname }} {{ user.lastname }}
                      <span
                        v-if="user.id === userStore.user.id"
                        class="text-blue-500"
                        >(You)</span
                      >
                    </p>
                    <p class="text-sm text-gray-500">{{ user.email }}</p>
                  </div>
                </td>

                <td class="px-4 py-3 text-sm font-[500] text-gray-500">
                  <div class="flex items-center space-x-1">
                    <template v-if="user.role === 'ADMIN'">
                      <AdminDisplayInTheTableIcon class="w-6 h-6 text-white" />
                    </template>
                    <template v-else-if="user.role === 'TEACHER'">
                      <TeacherDisplayInTheTableIcon class="w-6 h-6 mb-2 text-white" />
                    </template>
                    <template v-else-if="user.role === 'STUDENT'">
                      <StudentDisplayInTheTableIcon class="w-6 h-6 mb-2 text-white" />
                    </template>
                    <span class="leading-none">{{ user.role }}</span>
                  </div>
                </td>

                <td class="px-4 py-3 text-sm font-[500] text-gray-500">
                  {{ formatPhone(user.phone) }}
                </td>

                <td
                  class="flex px-4 py-3 text-sm font-[500] text-indigo-600 cursor-pointer hover:underline"
                >
                  <RigularTrashIcon class="h-6 w-6 text-gray-700 me-3" />
                  <RigularEyeIcon
                    class="text-gray-700 h-[22px] w-[22px] mt-[1px] me-3"
                  />
                  <OptionIcon class="text-gray-700" />
                </td>
              </tr>

              <!-- Add your v-for loop here to populate more rows -->
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import SearchIcon from "../icons/SearchIcon.vue";
import StudentIcon from "../icons/StudentIcon.vue";
import TeacherIcon from "../icons/TeacherIcon.vue";
import AdminIcon from "../icons/AdminIcon.vue";
import RippleButton from "../Custom/RippleButton.vue";
import RigularEyeIcon from "../icons/RigularEyeIcon.vue";
import RigularTrashIcon from "../icons/RigularTrashIcon.vue";
import OptionIcon from "../icons/OptionIcon.vue";
import AdminDisplayInTheTableIcon from "../icons/AdminDisplayInTheTableIcon.vue";
import StudentDisplayInTheTableIcon from "../icons/StudentDisplayInTheTableIcon.vue";
import TeacherDisplayInTheTableIcon from "../icons/TeacherDisplayInTheTableIcon.vue";
import { API_BASE_PROFILE_URL, API_BASE_URL } from "@/config/useWebSocket";
import { useUserStore } from "@/store/store";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  TransitionRoot,
  TransitionChild,
} from "@headlessui/vue";
import axios from "axios";
export default {
  components: {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    TransitionRoot,
    TransitionChild,
    TeacherIcon,
    AdminIcon,
    StudentIcon,
    SearchIcon,
    RippleButton,
    RigularEyeIcon,
    RigularTrashIcon,
    OptionIcon,
    AdminDisplayInTheTableIcon,
    TeacherDisplayInTheTableIcon,
    StudentDisplayInTheTableIcon,
  },
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  data() {
    return {
      API_BASE_PROFILE_URL,
      API_BASE_URL,
      users: [],
      roles: ["All Roles", "Students", "Teachers", "Admins"],
      selectedRole: "All Roles",

      limits: ["10", "20", "50", "100"],
      selectedLimit: "10",
    };
  },
  methods: {
    formatPhone(phone) {
      if (!phone) return "-";
      return phone.startsWith("0") ? "+855" + phone.substring(1) : phone;
    },
    handleAddNew() {
      // Logic to handle adding a new user
      console.log("Add New User button clicked");
    },
    async loadAllUsers() {
      const response = await axios.get(API_BASE_URL + "/api/user/all", {
        withCredentials: true,
      });
      if (response.status === 200) {
        this.users = response.data;
        console.log("Users loaded successfully:", this.users);
      } else {
        console.error("Failed to load users:", response.statusText);
      }
    },
  },
  mounted() {
    this.loadAllUsers();
  },
};
</script>
