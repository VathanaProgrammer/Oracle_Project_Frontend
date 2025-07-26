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
      class="filter-search-role-export-add-new-user rounded-md py-6 px-8 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] mt-5 md:min-h-[600px]"
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
            v-model="searchQuery"
            @input="handleSearch"
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
          @click.self="openedUserId = null"
          class="mt-4 overflow-visible border-t-2 border-gray-200 rounded-md shadow-sm"
        >
          <table
            class="min-w-full divide-y divide-gray-200 bg-white rounded-md shadow-md"
          >
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-4 py-3 text-left text-sm font-semibold text-gray-600"
                >
                  Select
                </th>
                <th
                  class="px-4 py-3 text-left text-sm font-semibold text-gray-600"
                >
                  User
                </th>
                <th
                  class="px-4 py-3 text-left text-sm font-semibold text-gray-600"
                >
                  Role
                </th>
                <th
                  class="px-4 py-3 text-left text-sm font-semibold text-gray-600"
                >
                  Phone
                </th>
                <th
                  class="px-4 py-3 text-left text-sm font-semibold text-gray-600"
                >
                  Action
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              <tr v-if="users.length === 0">
                <td colspan="5" class="px-4 py-3 text-center text-gray-500">
                  No users found.
                </td>
              </tr>

              <tr v-for="user in users" :key="user.id">
                <td class="px-4 py-3">
                  <input
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
                      >
                        (You)
                      </span>
                    </p>
                    <p class="text-sm text-gray-500">{{ user.email }}</p>
                  </div>
                </td>

                <td class="px-4 py-3 text-sm font-medium text-gray-500">
                  <div class="flex items-center space-x-1">
                    <template v-if="user.role === 'ADMIN'">
                      <AdminDisplayInTheTableIcon class="w-6 h-6 text-white" />
                    </template>
                    <template v-else-if="user.role === 'TEACHER'">
                      <TeacherDisplayInTheTableIcon
                        class="w-6 h-6 text-white"
                      />
                    </template>
                    <template v-else-if="user.role === 'STUDENT'">
                      <StudentDisplayInTheTableIcon
                        class="w-6 h-6 text-white"
                      />
                    </template>
                    <span class="leading-none">{{ user.role }}</span>
                  </div>
                </td>

                <td class="px-4 py-3 text-sm font-medium text-gray-500">
                  {{ formatPhone(user.phone) }}
                </td>

                <td
                  class="relative px-4 py-3 text-sm font-medium text-gray-700"
                >
                  <div class="flex items-center space-x-3">
                    <RigularTrashIcon
                      class="h-6 w-6 text-gray-700 cursor-pointer"
                      @click="handleDelete(user)"
                    />
                    <RigularEyeIcon
                      class="h-6 w-6 text-gray-700 cursor-pointer"
                      @click="handleView(user.id)"
                    />
                    <div class="relative">
                      <button
                        type="button"
                        class="rounded-full focus:outline-none focus:bg-gray-400 focus:bg-opacity-50 p-1"
                        @click.stop="toggleMenu(user.id)"
                      >
                        <OptionIcon class="h-6 w-6 text-gray-700" />
                      </button>

                      <transition name="fade">
                        <div
                          v-if="openedUserId === user.id"
                          class="absolute right-0 top-8 w-32 bg-white border rounded-md shadow-lg z-50"
                        >
                          <button
                            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            @click="handleView(user.id)"
                          >
                            View
                          </button>
                          <button
                            class="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                            @click="handleEdit(user)"
                          >
                            Edit
                          </button>
                          <button
                            class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                            @click="handleDelete(user)"
                          >
                            Delete
                          </button>
                        </div>
                      </transition>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
  <div
    v-if="showEditModal"
    class="fixed inset-0 p-2 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div
      class="bg-white w-full p-2 sm:p-6 max-w-md min-w-[55%] rounded-md shadow-lg"
    >
      <header
        class="flex rounded-md flex-row justify-between items-center mb-3"
      >
        <h2 class="text-xl font-semibold text-gray-800">Edit Student Info</h2>
        <CloseIcon
          class="h-8 w-8 cursor-pointer"
          @click="showEditModal = false"
        />
      </header>
      <hr class="mb-2" />
      <form class="mt-10 w-full" @submit.prevent="submitEditForm">
        <div
          class="w-full flex md:flex-row flex-col justify-between gap-3 my-5"
        >
          <div class="w-full">
            <label for="firstname" class="text-gray-500 font-sm block mb-1"
              >First name</label
            >
            <input
              type="text"
              v-model="editStudentForm.firstName"
              class="px-3 py-1 w-full text-gray-600 font-sm font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-md focus:shadow-lg shadow-blue-500"
            />
          </div>
          <div class="w-full">
            <label for="firstname" class="text-gray-500 font-sm block mb-1"
              >Last name</label
            >
            <input
              type="text"
              v-model="editStudentForm.lastName"
              class="px-3 py-1 w-full text-gray-600 font-sm font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-md focus:shadow-lg shadow-blue-500"
            />
          </div>
        </div>
        <div
          class="w-full flex md:flex-row flex-col justify-between gap-2 my-5"
        >
          <div class="w-full">
            <label for="firstname" class="text-gray-500 font-sm block mb-1"
              >Phone number</label
            >
            <input
              type="text"
              v-model="editStudentForm.phone"
              class="px-3 py-1 w-full text-gray-600 font-sm font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-md focus:shadow-lg shadow-blue-500"
            />
          </div>
          <div class="w-full">
            <label for="firstname" class="text-gray-500 font-sm block mb-1"
              >E-mail</label
            >
            <input
              type="text"
              v-model="editStudentForm.email"
              class="px-3 py-1 w-full text-gray-600 font-sm font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-md focus:shadow-lg shadow-blue-500"
            />
          </div>
        </div>
        <div
          class="w-full flex md:flex-row flex-col justify-between gap-2 my-5"
        >
          <!-- Gender Dropdown -->
          <div class="w-full">
            <label for="gender" class="text-gray-500 font-sm block mb-1"
              >Gender</label
            >
            <select
              id="gender"
              v-model="editStudentForm.gender"
              class="px-3 py-1.5 w-full text-gray-600 font-sm font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-md focus:shadow-lg shadow-blue-500"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <!-- Major (Disabled) -->
          <div class="w-full">
            <label for="major" class="text-gray-500 font-sm block mb-1"
              >Major</label
            >
            <input
              disabled
              v-model="editStudentForm.major"
              type="text"
              id="major"
              class="px-3 py-1 w-full text-gray-600 font-sm font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-md focus:shadow-lg shadow-blue-500"
            />
          </div>
        </div>

        <div
          class="w-full flex md:flex-row flex-col justify-between gap-2 my-5"
        >
          <div class="w-full">
            <label for="firstname" class="text-gray-500 font-sm block mb-1"
              >Batch</label
            >
            <input
              type="text"
              v-model="editStudentForm.batch"
              disabled
              class="px-3 py-1 w-full text-gray-600 font-sm font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-md focus:shadow-lg shadow-blue-500"
            />
          </div>
          <div class="w-full">
            <label for="firstname" class="text-gray-500 font-sm block mb-1"
              >Year</label
            >
            <input
              type="text"
              v-model="editStudentForm.year"
              disabled
              class="px-3 py-1 w-full text-gray-600 font-sm font-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 rounded-md focus:shadow-lg shadow-blue-500"
            />
          </div>
        </div>
        <div>
          <p
            v-if="updateStudentModelError"
            class="text-red-500 text-md font-normal"
          >
            {{ updateStudentModelError }}
          </p>
          <div class="flex items-center justify-center flex-col gap-2">
            <SuccessIcon
              v-if="updateStudentModelSuccess"
              fill="#70e000"
              class="w-6 h-6"
            />
            <p
              v-if="updateStudentModelSuccess"
              class="text-green-500 text-md font-normal"
            >
              {{ updateStudentModelSuccess }}
            </p>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button
            type="submit"
            class="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import CloseIcon from "../icons/CloseIcon.vue";
import SuccessIcon from "../icons/SuccessIcon.vue";
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
    CloseIcon,
    SuccessIcon,
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
      showEditModal: false,
      editStudentForm: {
        userId: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        batch: "",
        year: "",
        gender: "",
        major: "",
      },
      updateStudentModelError: "",
      updateStudentModelSuccess: null,
      API_BASE_PROFILE_URL,
      API_BASE_URL,
      users: [],
      roles: ["All Roles", "STUDENT", "TEACHER", "ADMIN"], // Match backend roles
      selectedRole: "All Roles",
      limits: ["10", "20", "50", "100"],
      selectedLimit: "10",
      searchQuery: "",
      openedUserId: null,
    };
  },
  methods: {
    formatPhone(phone) {
      if (!phone) return "-";
      return phone.startsWith("0") ? "+855" + phone.substring(1) : phone;
    },
    async loadAllUsers() {
      const params = {
        role: this.selectedRole !== "All Roles" ? this.selectedRole : undefined,
        limit: this.selectedLimit,
        search: this.searchQuery || undefined,
      };

      const response = await axios.get(API_BASE_URL + "/api/user/all", {
        params,
        withCredentials: true,
      });

      if (response.status === 200) {
        this.users = response.data;
      }

      console.log("Users loaded:", this.users);
    },
    async loadUserInfo(user) {
      try {
        if (user.role == "STUDENT") {
          const response = await axios.get(
            API_BASE_URL + "/api/students/" + user.id,
            {
              withCredentials: true,
            }
          );
          this.editStudentForm = {
            userId: response.data.data.userId,
            firstName: response.data.data.firstname,
            lastName: response.data.data.lastname,
            phone: response.data.data.phone,
            email: response.data.data.email,
            major: response.data.data.major,
            batch: response.data.data.batch,
            year: response.data.data.year,
            gender: response.data.data.gender,
          };
        } else {
          this.updateStudentModelError =
            response2.data.message || "User is not a student.";
          this.updateStudentModelSuccess = "";
        }

        this.showEditModal = true;
      } catch (error) {
        this.updateStudentModelError =
          "Error loading user info: " + error.message;
        console.error("Error loading user info:", error);
      }
    },
    async submitEditForm() {
      try {
        const response2 = await axios.put(
          API_BASE_URL + "/api/students/update-for-admin",
          this.editStudentForm,
          {
            withCredentials: true,
          }
        );

        if (response2.data.success === true) {
          this.updateStudentModelSuccess =
            response2.data.message || "Student info updated successfully!";
          this.updateStudentModelError = "";
        } else {
          this.updateStudentModelError =
            response2.data.message || "Failed to update student info.";
        }
      } catch (error) {
        this.updateStudentModelError = "Error updating user: " + error.message;
        console.error("Error updating user:", error);
      }
    },
    toggleMenu(id) {
      this.openedUserId = this.openedUserId === id ? null : id;
    },
    async handleView(id) {
      try {
        const response = await axios.get(
          API_BASE_URL + "/api/user/beforeDetail/" + id,
          {
            withCredentials: true,
          }
        );
        console.log(response.data.data.role);

        if (response.data.data.role == "STUDENT") {
          this.$router.push({ name: "studentDetail", params: { id: id } });
        }
      } catch (e) {
        console.log(e);
      }
      //this.$router.push({ name: "userDetails", params: { id: id}})
    },
    handleEdit(user) {
      this.loadUserInfo(user);
      this.openedUserId = null;
    },
    handleDelete(user) {
      console.log("Delete", user);
      this.openedUserId = null;
    },
    handleClickOutside(event) {
      if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
        this.closeMenu();
      }
    },
    handleEsc(event) {
      if (event.key === "Escape") {
        this.closeMenu();
      }
    },
    handleSearch() {
      this.loadAllUsers();
    },
    openDetailPage(id) {
      this.$router.push({ name: "studentDetail", params: { id: id } });
    },
  },
  mounted() {
    this.loadAllUsers();
  },
  watch: {
    selectedRole() {
      this.loadAllUsers();
    },
    selectedLimit() {
      this.loadAllUsers();
    },
  },
};
</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
