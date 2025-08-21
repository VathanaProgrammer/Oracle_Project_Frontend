<template>
  <div class="xl:h-44 h-auto flex flex-col md:flex-row mt-12">
    <div class="text-session-course-hour md:w-2/3 w-full pe-4">
      <p class="text-lg font-normal text-gray-600">
        Welcome back,
        <span class="text-xl font-semibold text-gray-700"
          >{{ userStore.user?.lastname }}!</span
        >
      </p>
      <p class="pt-3 text-sm font-normal text-gray-500">
        Your progress this week is Awesome. let's keep it up
      </p>
      <p class="pt-2 text-sm font-normal text-gray-500">
        and get a lot of points reward!
      </p>
      <div
        class="time-spent-and-result-session flex flex-col md:flex-row gap-5 justify-between items-stretch mt-4 xs:mb-8 sm:mb-8"
      >
        <div class="flex">
          <div class="bg-[#4895ef] bg-opacity-20 rounded-lg me-3">
            <LaptopIcon class="text-[#8C09F4] h-16 w-16 p-2" />
          </div>
          <p class="procent-and-text flex flex-col">
            <span class="text-sm font-medium text-gray-600"
              >Time spent today</span
            >
            <span class="text-2xl font-semibold text-[#8C09F4] mt-auto">{{
              userStore.user?.timeSpentToday
            }}</span>
          </p>
        </div>

        <div class="flex">
          <div class="bg-[#4895ef] bg-opacity-20 rounded-lg me-3">
            <LaptopIcon class="text-[#8C09F4] h-16 w-16 p-2" />
          </div>
          <p class="procent-and-text flex flex-col">
            <span class="text-sm font-medium text-gray-600">Test Results</span>
            <span class="text-2xl font-semibold text-[#8C09F4] mt-auto"
              >{{ start?.averageScore }} %</span
            >
          </p>
        </div>

        <div class="flex">
          <div class="bg-[#4895ef] bg-opacity-20 rounded-lg me-3">
            <LaptopIcon class="text-[#8C09F4] h-16 w-16 p-2" />
          </div>
          <p class="procent-and-text flex flex-col">
            <span class="text-sm font-medium text-gray-600"
              >Exam completed</span
            >
            <span class="text-2xl font-semibold text-[#8C09F4] mt-auto">{{
              start.completedCount
            }}</span>
          </p>
        </div>
      </div>
    </div>
    <div
      class="text-session-box w-full h-44 md:w-1/3 border-gray-400 p-4 flex md:border-l-2 md:border-t-0 border-t-2 sm:border-t"
    >
      <div class="flex flex-col justify-between items- h-full w-full">
        <div class="">
          <p class="text-xl font-semibold text-gray-700">Time Spending</p>
          <p class="text-sm font-normal text-gray-700">Weekly Report</p>
        </div>
        <div>
          <p class="text-2xl font-semibold text-gray-700">
            {{ weeklyTime.hours }}
            <span class="text-gray-700 text-opacity-50">h</span>
            {{ weeklyTime.minutes }}
            <span class="text-gray-700 text-opacity-50">min</span>
          </p>
        </div>
      </div>
    </div>
  </div>
  <div class="w-full mt-8 flex flex-col xl:flex-row gap-4">
    <div
      class="graph-session min-h-[300px] w-full xl:w-3/5 rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.1)] sm:me-1 xl:me-2 p-4"
    >
      <p class="text-lg font-normal text-gray-600">Your progress this week</p>
      <GrapView />
    </div>
    <div
      class="upcoming-exam w-full md:w-5/5 xl:w-2/5 rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.1)] xl:ms-2 p-4"
    >
      <header class="h-10 mb-4 flex items-center">
        <p class="text-lg font-normal text-gray-600">Upcoming exam</p>
      </header>
      <table
        class="w-full divide-y divide-gray-200 sm:text-center md:text-center"
      >
        <thead class="border-y-[1px] border-gray-500 border-opacity-30">
          <tr>
            <th class="text-gray-500 text-lg font-normal py-2">
              Subject & Teacher
            </th>
            <th class="text-gray-500 text-lg font-normal py-2">Start Time</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(exam, index) in exams"
            :key="index"
            class="border-b border-gray-200"
          >
            <td class="py-2 px-4 whitespace-nowrap text-gray-700">
              <div class="flex items-center space-x-3">
                <img
                  :src="API_BASE_PROFILE_URL + '/' + exam.teacherImage"
                  alt="Teacher photo"
                  class="h-10 w-10 rounded-full object-cover"
                />
                <div class="flex flex-col">
                  <span class="font-medium">{{ exam.teacher }}</span>
                  <span class="text-sm text-gray-500">{{ exam.subject }}</span>
                </div>
              </div>
            </td>
            <td class="py-2 px-4 whitespace-nowrap text-gray-500">
              {{ formatDatetime(exam.datetime) }}
            </td>
          </tr>
          <tr v-if="exams.length === 0">
            <td colspan="4" class="py-4 text-center text-gray-600">
              No upcoming exams yet.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <!-- Teacher Messages or Announcements Exam completed section -->
  <div class="w-full flex flex-col xl:flex-row gap-4 md:mt-4 sm:mt-4">
    <div
      class="upcoming-exam w-full xl:w-3/5 max-h[300px] h-96 overflow-auto rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.1)] xl:me-2 sm:me-1 p-4"
    >
      <header class="h-10 mb-4 flex items-center">
        <p class="text-lg font-normal text-gray-600">
          Teacher Messages or Announcements
        </p>
      </header>
      <table class="w-full divide-y divide-gray-200">
        <thead class="border-y-[1px] border-gray-500 border-opacity-30">
          <tr>
            <th class="text-gray-500 text-lg font-normal py-2">
              Message Details
            </th>
            <th class="text-gray-500 text-lg font-normal py-2 text-center">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="teacher_message in announcements"
            :key="teacher_message.id"
            class="border-b border-gray-200"
          >
            <td class="py-3 px-4">
              <div class="flex items-start space-x-3">
                <img
                  :src="
                    API_BASE_PROFILE_URL + '/' + teacher_message.senderProfile
                  "
                  alt="Teacher photo"
                  class="h-10 w-10 rounded-full object-cover mt-1"
                />
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <span class="font-medium text-gray-800">{{
                      teacher_message.senderName
                    }}</span>
                    <span class="text-sm text-gray-500"
                      >| {{ teacher_message.senderRole }}</span
                    >
                  </div>
                  <p class="text-sm text-gray-700 mt-1">
                    {{ teacher_message.content }}
                  </p>
                  <span class="text-xs text-gray-400 mt-1">{{
                    formattedDateTime(teacher_message.timestamp)
                  }}</span>
                </div>
              </div>
            </td>
            <td class="text-center px-4 whitespace-nowrap">
              <span
                :class="[
                  'inline-block rounded-full px-3 py-1 text-sm font-medium',
                  teacher_message.status.toLowerCase() === 'unread'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-green-100 text-green-600',
                ]"
              >
                {{ teacher_message.status }}
              </span>
            </td>
          </tr>
          <tr v-if="announcements.length === 0">
            <td colspan="4" class="py-4 text-center text-gray-600">
              No announcements yet.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="min-h-[300px] h-[500px] overflow-auto w-full xl:w-2/5 rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.1)] xl:ms-2 p-4"
    >
      <header class="h-10 mb-4 flex items-center">
        <p class="text-lg font-normal text-gray-600">Completed exams</p>
      </header>
      <div class="space-y-4">
        <div
          v-for="exam in examCompleted"
          :key="exam.id"
          class="flex justify-between items-center p-4 rounded-md hover:-translate-y-2 hover:shadow-lg cursor-pointer transition-all duration-300 bg-white border border-gray-200"
        >
          <!-- Left: Subject & Score -->
          <div class="flex items-center space-x-3">
            <SmallCycleChat :score="exam.totalScore" />
            <div>
              <h4 class="text-md font-semibold text-gray-800">
                {{ exam.subject }}
              </h4>
              <p class="text-sm text-gray-500">Score: {{ exam.totalScore }}</p>
            </div>
          </div>

          <!-- Center: Date -->
          <div class="text-sm text-gray-500 text-center w-32">
            {{ exam.datetime }}
          </div>

          <!-- Right: Status -->
          <div>
            <span
              :class="[
                'text-sm font-medium px-3 py-1 rounded-full',
                exam.status === 'Passed'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600',
              ]"
            >
              {{ exam.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LaptopIcon from "../icons/LaptopIcon.vue";
import GrapView from "./GrapView.vue";
import TimeSpentChart from "./TimeSpentChart.vue";
import SmallCycleChat from "./SmallCycleChat.vue";
import { useUserStore } from "@/store/store";
import { API_BASE_URL } from "@/config/useWebSocket";
import axios from "axios";
import { useToast } from "vue-toastification";
import { errorMessages } from "vue/compiler-sfc";
import { API_BASE_PROFILE_URL } from "@/config/useWebSocket";
import { connectWebSocket, registerHandler } from "@/config/useWebSocket";
const toast = useToast();
export default {
  components: {
    LaptopIcon,
    GrapView,
    TimeSpentChart,
    SmallCycleChat,
  },
  setup() {
    const userStore = useUserStore();
    return {
      userStore,
    };
  },
  data() {
    return {
      API_BASE_URL,
      API_BASE_PROFILE_URL,
      exams: [],

      announcements: [],
      examCompleted: [],
      start: {},
    };
  },
  methods: {
    async starts() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/students/start`, {
          withCredentials: true,
        });
        this.start = response.data;
        console.table(response);
      } catch (err) {
        toast.error("False fetch exam from start!", errorMessages);
      }
    },
    async getExamComingSoon() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/exams/coming`, {
          withCredentials: true,
        });
        this.exams = response.data;
        console.table(response);
      } catch (err) {
        toast.error("False fetch exam from coming status!", errorMessages);
      }
    },
    formatDatetime(datetime) {
      if (!datetime) return "";
      const date = new Date(datetime);
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      return date.toLocaleString(undefined, options);
    },
    formattedDateTime() {
      return (datetime) => {
        // If datetime is a string, remove microseconds
        let date;
        if (typeof datetime === "string") {
          const cleanDateStr = datetime.split(".")[0];
          date = new Date(cleanDateStr);
        } else if (datetime instanceof Date) {
          date = datetime;
        } else {
          return ""; // invalid input
        }

        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
      };
    },
    async loadAnnouncements() {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/admin-chat/ad-announcements`,
          {
            withCredentials: true,
          }
        );
        // Filter out messages sent by yourself
        this.announcements = res.data.filter(
          (message) => message.senderId !== this.userStore.user.id
        );

        console.log(this.announcements);
      } catch (err) {
        console.error("Failed to load announcements", err);
      }
    },
    async getComputedExams() {
      try {
        const response = await axios.get(
          API_BASE_URL + "/api/exams/completed/student",
          { withCredentials: true }
        );
        console.log("completed exam load ");
        console.log(response);
        this.examCompleted = response.data;
      } catch (e) {
        console.log(e);
      }
    },
  },
  mounted() {
    this.loadAnnouncements();
    this.getExamComingSoon();
    this.starts();
    this.getComputedExams();

    connectWebSocket();
    // 2️⃣ Subscribe to announcements topic
    registerHandler("/topic/ad-announcements", (message) => {
      if (message.senderId !== this.userStore.user.id) {
        // Update status locally immediately
        const dto = { ...message, status: "READ" };
        this.announcements.unshift(dto); // newest at top
      } // newest messages at top
    });
  },
  computed: {
    formattedDateTime() {
      return (datetime) => {
        // If datetime is a string, remove microseconds
        let date;
        if (typeof datetime === "string") {
          const cleanDateStr = datetime.split(".")[0];
          date = new Date(cleanDateStr);
        } else if (datetime instanceof Date) {
          date = datetime;
        } else {
          return ""; // invalid input
        }

        return date.toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
      };
    },
    weeklyTime() {
      const raw = this.userStore?.user?.timeSpentThisWeek || "0h 0m";
      const [h, m] = raw.split(" ");
      return {
        hours: h.replace("h", ""),
        minutes: m.replace("m", ""),
      };
    },
  },
};
</script>
