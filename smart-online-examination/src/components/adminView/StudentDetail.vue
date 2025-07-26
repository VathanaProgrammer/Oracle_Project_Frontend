<template>
  <div class="min-h-full">
    <div class="container px-0 py-0 mx-auto sm:px-4 sm:py-10">
      <div
        class="bg-white rounded-xl shadow-lg p-2 py-4 md:p-4 lg:p-6 flex flex-col lg:flex-row gap-8"
      >
        <!-- Left Section -->
        <div
          class="lg:w-1/3 flex flex-col items-center justify-center text-center"
        >
          <div
            class="w-32 h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 overflow-hidden rounded-full border-4 border-[#00b4d8] shadow-md"
          >
            <img
              class="w-full h-full object-cover"
              :src="
                API_BASE_PROFILE_URL + '/' + studentInfo.info.profilePicture
              "
              alt="Student Avatar"
            />
          </div>
          <h2 class="text-3xl font-bold mt-2 text-[#03045e]">
            {{ studentInfo.info?.name }}
          </h2>
          <div class="text-sectio text-start">
            <p class="text-gray-600 text-md">
              Ful name: {{ studentInfo.info?.name }}
            </p>
            <p class="text-gray-600 text-md">
              Gender: {{ studentInfo.info?.gender }}
            </p>
            <p class="text-gray-600 text-md">
              Role: {{ formatRole(studentInfo.info?.role) }}
            </p>
            <p class="text-gray-600 text-md">
              Batch: {{ studentInfo.info?.batch }}
            </p>
            <p class="text-gray-600 text-md">
              Year: {{ studentInfo.info?.year }}
            </p>
            <p class="text-gray-600 text-md">
              Major: {{ studentInfo.info?.major }}
            </p>
            <p class="text-gray-600 text-md">
              Email: {{ studentInfo.info?.email }}
            </p>
            <p class="text-gray-600 text-md">
              Phone: {{ studentInfo.info?.phone }}
            </p>
          </div>
          <div class="flex flex-row gap-3 mt-4">
            <div class="flex flex-row">
              <button
                @click="openEditModal"
                class="flex items-center gap-2 px-4 py-2 rounded-md shadow-md text-white bg-[#8C09F4] font-normal text-md"
              >
                <EditIcon class="w-5 h-5" />
                Edit
              </button>
            </div>
            <div class="flex flex-row">
              <button
                class="flex items-center gap-2 px-4 py-2 rounded-md shadow-md text-white bg-blue-500 font-normal text-md"
              >
                <MessageRigularIcon class="w-5 h-5" />
                Message
              </button>
            </div>
          </div>
        </div>

        <!-- Right Section -->
        <div class="lg:w-2/3 space-y-10" id="for-user-activities">
          <!-- Exams Table -->
          <section class="">
            <header class="flex flex-row justify-between items-center">
              <h2 class="text-2xl font-semibold text-gray-700 mb-4">
                Upcoming & Recent Exams
              </h2>
              <p class="text-sm text-gray-600 font-semibold">View all</p>
            </header>
            <div
              class="overflow-x-auto border-t-2 border-gray-200 rounded-md shadow-sm"
            >
              <table
                class="min-w-full text-left divide-y divide-gray-200 bg-white rounded-md shadow-md"
              >
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-4 py-3 text-left text-md font-semibold text-gray-600"
                    >
                      EXAM
                    </th>
                    <th
                      class="px-4 py-3 text-left text-md font-semibold text-gray-600"
                    >
                      DATE
                    </th>
                    <th
                      class="px-4 py-3 text-left text-md font-semibold text-gray-600"
                    >
                      TYPE
                    </th>
                    <th
                      class="px-4 py-3 text-left text-md font-semibold text-gray-600"
                    >
                      STATUS
                    </th>
                    <th
                      class="px-4 py-3 text-left text-md font-semibold text-gray-600"
                    >
                      SCORE
                    </th>
                  </tr>
                </thead>
                <tbody class="text-gray-700 bg-white">
                  <tr
                    v-for="exam in exams"
                    :key="exam.id"
                    class="border-t hover:bg-gray-100 transition"
                  >
                    <td class="py-3 px-4">{{ exam.name }}</td>
                    <td class="py-3 px-4">{{ formatDate(exam.date) }}</td>
                    <td class="py-3 px-4">{{ exam.type }}</td>
                    <td
                      class="py-3 px-4 font-medium"
                      :class="{
                        'text-green-600': exam.status === 'Upcoming',
                        'text-red-600': exam.status === 'Completed',
                        'text-yellow-600': exam.status === 'Missed',
                      }"
                    >
                      {{ exam.status }}
                    </td>
                    <td class="py-3 px-4">
                      {{ exam.score !== null ? exam.score + "%" : "--" }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Activity Feed -->
          <section>
            <header class="flex flex-row justify-between items-center">
              <h2 class="text-2xl font-semibold text-gray-700 mb-4">
                Recent Activities
              </h2>
              <p class="text-sm font-semibold text-gray-600">View all</p>
            </header>
            <!-- Minimal Recent Activities (Icon + Description + Time) -->
            <div
              v-if="studentInfo.recentActivities.length"
              class="space-y-3 max-h-[260px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
            >
              <div
                v-for="a in studentInfo.recentActivities"
                :key="a.id"
                class="flex items-start gap-3 p-3 rounded-md border border-gray-200 hover:-translate-y-1 hover:shadow-md transition"
              >
                <!-- icon -->
                <ActionIcon :type="a.type.toLowerCase()" />

                <!-- description + timestamp -->
                <div class="flex-1 flex flex-col">
                  <p class="text-sm text-gray-600 line-clamp-2">
                    {{ a.description }}
                  </p>
                  <time
                    :datetime="a.timestamp"
                    class="text-sm text-gray-600 line-clamp-2"
                  >
                    {{ formatDate(a.timestamp) }}
                  </time>
                </div>

                <time
                  :datetime="a.timestamp"
                  class="text-xs text-gray-400 whitespace-nowrap"
                >
                  {{ formatAgo(a.timestamp) }}
                </time>
              </div>
            </div>

            <!-- Empty state -->
            <div
              v-else
              class="flex flex-col items-center justify-center h-[240px] text-gray-400"
            >
              <svg
                class="w-10 h-10 mb-2"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 13h6m-6 4h3m4 3H6a2 2 0 0 1-2-2V8
         a2 2 0 0 1 2-2h2l2-2h4l2 2h2a2 2 0 0 1 2 2v10
         a2 2 0 0 1-2 2z"
                />
              </svg>
              <span>No recent activity</span>
            </div>
          </section>
        </div>
      </div>

      <div class="bg-white mt-4 rounded-xl shadow-lg p-6 flex flex-col gap-8">
        <!-- security -->
        <section class="w-full mt-4 h-full">
          <header>
            <h2 class="text-2xl font-semibold text-gray-700 mb-4">Security</h2>
          </header>
          <h2 class="text-xl font-normal text-gray-700 mb-4">
            Change password
          </h2>
          <form action="" @submit.prevent="handleChangePasswordOfThisUser()">
            <div
              class="w-full flex md:flex-row flex-col justify-between gap-3 my-5"
            >
              <div class="w-full">
                <PasswordInput label="New Password" v-model="newPassword" />
              </div>
              <div class="w-full">
                <PasswordInput
                  label="Confirm New Password"
                  v-model="confirmPassowrd"
                />
              </div>
            </div>
            <div v-if="changePassError">
              <p class="text-sm text-red-500 font-normal">
                {{ changePassError }}
              </p>
            </div>
            <div v-if="changePassSuccess">
              <p class="text-sm text-green-500 font-normal">
                {{ changePassSuccess }}
              </p>
            </div>
            <div class="my-5">
              <p class="text-gray-600 font-medium text-sm">
                Password Requirements
              </p>
              <ul class="list-disc pl-8 mt-2 gap-2">
                <li class="text-gray-500 font-normal text-sm py-2">
                  Minimum 8 characters long - the more, the better
                </li>
                <li class="text-gray-500 font-normal text-sm py-2">
                  At least one lowercase character
                </li>
                <li class="text-gray-500 font-normal text-sm py-2">
                  At least one number, symbol, or whitespace character
                </li>
              </ul>
            </div>
            <div class="flex justify-start gap-3">
              <button
                type="submit"
                class="text-white bg-[#8C09F4] px-4 py-2 rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.1)]shadow-md"
              >
                Save change
              </button>
              <button
                class="text-gray-600 bg-gray-600 bg-opacity-20 font-medium px-4 py-2 rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>

        <section class="w-full mt-4 h-full">
          <header class="flex flex-row justify-between items-center">
            <h2 class="text-2xl font-semibold text-gray-700 mb-4">
              Recent Devices
            </h2>
            <p class="text-sm font-semibold text-gray-600">View all</p>
          </header>
          <div
            class="overflow-x-auto border-t-2 border-gray-200 rounded-md shadow-sm"
          >
            <table
              class="min-w-full text-left divide-y divide-gray-200 bg-white rounded-md shadow-md"
            >
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-4 py-3 text-left text-md font-semibold text-gray-600"
                  >
                    BROWSER
                  </th>
                  <th
                    class="px-4 py-3 text-left text-md font-semibold text-gray-600"
                  >
                    DEVICE
                  </th>
                  <th
                    class="px-4 py-3 text-left text-md font-semibold text-gray-600"
                  >
                    LOCATION
                  </th>
                  <th
                    class="px-4 py-3 text-left text-md font-semibold text-gray-600"
                  >
                    DATE
                  </th>
                </tr>
              </thead>
              <tbody class="text-gray-700 bg-white">
                <tr
                  v-for="recent in studentInfo.recentDevices"
                  :key="recent.id"
                  class="border-t hover:bg-gray-100 transition"
                >
                  <td class="py-3 px-4 flex items-center">
                    <ActionIcon :type="recent.deviceType" />
                    <span class="ps-2">{{ recent.browser }}</span>
                  </td>
                  <td class="py-3 px-4">{{ recent.device }}</td>
                  <td class="py-3 px-4">{{ recent.location }}</td>
                  <td class="py-3 px-4">
                    {{ formatDate(recent.createdAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
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
        <CloseIcon class="h-8 w-8 cursor-pointer" @click="showEditModal = false" />
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
          <p v-if="updateStudentModelError" class="text-red-500 text-md font-normal">{{ updateStudentModelError }}</p>
          <div class="flex items-center justify-center flex-col gap-2">
            <SuccessIcon v-if="updateStudentModelSuccess" fill="#70e000" class="w-6 h-6" />
            <p v-if="updateStudentModelSuccess" class="text-green-500 text-md font-normal">{{ updateStudentModelSuccess }}</p>
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
import dayjs from "dayjs";
import SuccessIcon from "../icons/SuccessIcon.vue";
import CloseIcon from "../icons/CloseIcon.vue";
import MessageRigularIcon from "../icons/MessageRigularIcon.vue";
import EditIcon from "../icons/EditIcon.vue";
import PasswordInput from "../studentView/PasswordInput.vue";
import ActionIcon from "../icons/ActionIcon.vue";
import axios from "axios";
import RippleButton from "../Custom/RippleButton.vue";
import { API_BASE_PROFILE_URL, API_BASE_URL } from "@/config/useWebSocket";
export default {
  name: "StudentDetail",
  components: {
    MessageRigularIcon,
    ActionIcon,
    EditIcon,
    PasswordInput,
    RippleButton,
    CloseIcon,
    SuccessIcon,
  },
  data() {
    return {
      updateStudentModelError: "",
      updateStudentModelSuccess: "",
      editStudentForm: {
        firstName: "",
        lastName: "",
        email: "",
        gender: "",
        batch: "",
        year: "",
        major: "",
        phone: "",
        email: "",
      },
      user: {
        firstname: "Sieng",
        lastname: "Vathana",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        email: "Siengvathana@gmail.com",
        phoneNumber: "018239543",
        batch: "8",
        year: "2",
      },
      showEditModal: false,
      changePassSuccess: "",
      changePassError: "",
      confirmPassowrd: "",
      oldPassword: "",
      newPassword: "",
      API_BASE_PROFILE_URL,
      API_BASE_URL,
      studentInfo: {
        info: {},
        recentActivities: [],
        recentDevices: [],
      },
      userId: this.$route.params.id,
      exams: [
        {
          id: 1,
          name: "Math Final",
          date: "2025-07-25",
          status: "Upcoming",
          type: "FINAL",
          score: null,
        },
        {
          id: 2,
          name: "Science Quiz",
          date: "2025-07-10",
          type: "FINAL",
          status: "Completed",
          score: 84,
        },
        {
          id: 3,
          name: "History Test",
          date: "2025-07-01",
          type: "QUIZ",
          status: "Missed",
          score: 0,
        },
      ],
    };
  },
  methods: {
    formatDate(dateStr) {
      return dayjs(dateStr).format("MMMM DD, YYYY hh:mm A");
    },
    formatDateTime(datetimeStr) {
      try {
        // Replace space with 'T' for ISO parsing if needed
        const dateObj = parseISO(datetimeStr.replace(" ", "T"));
        return format(dateObj, "EEE, MMM d, yyyy • hh:mm a");
      } catch {
        return datetimeStr;
      }
    },
    formatAgo(iso) {
      const diff = Date.now() - new Date(iso).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "just now";
      if (mins < 60) return `${mins} m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs} h ago`;
      const days = Math.floor(hrs / 24);
      return `${days} d ago`;
    },
    async loadStudentIfo() {
      try {
        const response = await axios.get(
          API_BASE_URL + "/api/students/" + this.userId,
          { withCredentials: true }
        );
        this.studentInfo.info = response.data.data;
        console.log(response.data);
      } catch (e) {
        console.log(e);
      }
    },
    formatRole(role) {
      if (!role) return "";
      return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
    },
    async fetchRecentDevices() {
      try {
        const response = await axios.get(
          API_BASE_URL + "/api/session-logs/" + this.userId,
          { withCredentials: true }
        );
        const data = response.data.data;
        this.studentInfo.recentDevices = data;
        console.log(this.studentInfo.recentDevices);
      } catch (e) {
        console.log(e);
      }
    },
    async fetchUserRecentAction() {
      try {
        const response = await axios.get(
          API_BASE_URL + "/api/actions/" + this.userId,
          { withCredentials: true }
        );
        console.log(response.data);
        this.studentInfo.recentActivities = response.data.data;
      } catch (e) {
        console.log(e);
      }
    },
    async submitEditForm() {
      try {
        const response = await axios.put(
          API_BASE_URL + "/api/students/update-for-admin",
          this.editStudentForm,
          { withCredentials: true }
        );
        console.log(this.editStudentForm);
        if (response.data.success) {
          this.updateStudentModelSuccess = response.data.message  ||  "Student information updated successfully.";
          this.loadStudentIfo(); // Reload student info after edit
        } else {
          this.updateStudentModelError = response.data.message || "Failed to update student information.";
        }
      } catch (error) {
        console.error("Error updating student info:", error);
      }
    },
    // ...existing methods
    openEditModal() {
      const s = this.studentInfo.info;
      this.editStudentForm = {
        userId: s.userId || "",
        firstName: s.firstname || "",
        lastName: s.lastname || "",
        gender: s.gender || "",
        email: s.email || "",
        batch: s.batch || "",
        year: s.year || "",
        major: s.major || "",
        phone: s.phone || "",
        email: s.email || "",
      };
      this.showEditModal = true;
    },
    async handleChangePasswordOfThisUser() {
      if (this.newPassword !== this.confirmPassowrd) {
        this.changePassError =
          "New password and confirm password do not match.";
        return;
      }
      try {
        const response = await axios.put(
          API_BASE_URL + "/api/user/changePasswordForAdmin",
          {
            userId: this.userId,
            newPassword: this.newPassword,
          },
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
        if (response.data.success === true) {
          this.changePassSuccess =
            response.data.message || "Password changed successfully.";
          this.newPassword = "";
          this.confirmPassowrd = "";
        } else {
          this.changePassError =
            response.data.message || "Failed to change password.";
        }
      } catch (e) {
        console.log(e);
        if (e.response && e.response.data && e.response.data.message) {
          this.changePassError = e.response.data.message;
        } else {
          this.changePassError =
            "An error occurred while changing the password.";
        }
      }
    },
  },
  mounted() {
    this.loadStudentIfo();
    this.fetchRecentDevices();
    this.fetchUserRecentAction();
  },
};
</script>

<style scoped>
/* Optional: Custom Scrollbar */
::-webkit-scrollbar-track {
  background: #f0f0f0;
}
::-webkit-scrollbar-thumb {
  background: #90e0ef;
  border-radius: 4px;
}
</style>
