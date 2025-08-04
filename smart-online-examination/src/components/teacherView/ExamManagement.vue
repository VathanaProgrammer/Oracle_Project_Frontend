<template>
  <div class="min-h-screen px-4 py-6 lg:px-8 lg:py-10 bg-gray-100">
    <div class="max-w-6xl mx-auto p-6">
      <!-- Header -->
      <header class="flex items-center justify-between mb-6 space-x-4">
        <h2 class="text-2xl font-semibold text-gray-700 flex-shrink-0">
          Exam Management
        </h2>

        <!-- Search input -->
        <input v-model="searchQuery" type="text" placeholder="Search title or description..."
          class="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#57cc99] flex-grow max-w-md" />

        <RouterLink to="/teacher-dashboard/exam-management/new">
          <button
            class="bg-[#57cc99] hover:-translate-y-1 transform transition text-white text-md font-medium py-2 px-4 rounded-sm hover:bg-[#48b57f] flex-shrink-0">
            New Exam
          </button>
        </RouterLink>
      </header>

      <!-- Exam List -->
      <div class="bg-white rounded-md p-4 shadow-[0_4px_20px_rgba(0,0,0,0.1)] overflow-x-visible min-h-56">
        <table class="min-w-full table-auto border-collapse relative">
          <thead>
            <tr class="bg-gray-100 text-left text-sm font-medium text-gray-700">
              <th class="py-2 px-4 text-gray-500 font-normal">#</th>
              <th class="py-2 px-4 text-gray-500 font-normal">Title</th>
              <th class="py-2 px-4 text-gray-500 font-normal">Description</th>
              <th class="py-2 px-4 text-gray-500 font-normal">Start Time</th>
              <th class="py-2 px-4 text-gray-500 font-normal">End Time</th>
              <th class="py-2 px-4 text-gray-500 font-normal">Duration</th>
              <th class="py-2 px-4 text-gray-500 font-normal relative cursor-pointer select-none"
                @click="toggleStatusDropdown">
                Status
                <span class="inline-block ml-1 text-gray-600 transition-transform duration-200"
                  :class="{ 'rotate-180': statusDropdownOpen }">
                  ▼
                </span>

                <!-- Dropdown menu -->
                <div v-if="statusDropdownOpen"
                  class="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-300 rounded shadow-lg z-30">
                  <ul class="divide-y divide-gray-200 max-h-48 overflow-auto">
                    <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      :class="{ 'font-semibold': statusFilter === '' }" @click="selectStatus('')">
                      All
                    </li>
                    <li v-for="status in statuses" :key="status.value"
                      class="px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize" :class="{
                        'font-semibold': statusFilter === status.value,
                      }" @click="selectStatus(status.value)">
                      {{ status.label }}
                    </li>
                  </ul>
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(exam, index) in filteredExams" :key="exam.id"
              :class="' group relative border-b hover:bg-gray-50 transition-colors duration-300'">
              <td class="py-3 px-4 text-gray-600">{{ index + 1 }}</td>
              <td class="py-3 px-4 whitespace-nowrap font-semibold text-blue-700">
                {{ exam.title }}
              </td>
              <td class="py-3 px-4 text-gray-500 whitespace-nowrap">
                {{ exam.description }}
              </td>
              <td class="py-3 px-4 text-gray-500 whitespace-nowrap">
                {{ formatDate(exam.startTime) }}
              </td>
              <td class="py-3 px-4 text-gray-500 whitespace-nowrap">
                {{ formatDate(exam.endTime) }}
              </td>
              <td class="py-3 px-4 text-gray-500 whitespace-nowrap">
                {{ formatDuration(exam.duration) }}
              </td>
              <td class="py-3 px-4 whitespace-nowrap capitalize">
                {{ exam.status }}
              </td>

              <!-- Floating Popup Buttons -->
              <td class="relative w-0">
                <div class="popup-container py-2 px-2" style="white-space: nowrap">
                  <button @click="editExam(exam.id)" class="popup-btn edit-btn">
                    Edit
                  </button>
                  <button @click="deleteExam(exam.id)" class="popup-btn delete-btn">
                    Delete
                  </button>
                  <div class="popup-arrow"></div>
                </div>
              </td>
            </tr>
            <tr v-if="filteredExams.length === 0">
              <td colspan="8" class="text-center py-4 text-gray-500">
                No exams found for selected filters.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import dayjs from 'dayjs';
import { API_BASE_URL } from '@/config/useWebSocket';
export default {
  name: "ExamManagement",
  data() {
    return {
      API_BASE_URL,
      statusFilter: "",
      statusDropdownOpen: false,
      searchQuery: "",
      statuses: [
      { label: "Pending", value: "pending" },
      { label: "Ongoing", value: "ongoing" },
      { label: "Cancelled", value: "cancelled" },
      { label: "Expired", value: "expired" },
      { label: "Draft", value: "draft" },
      { label: "Published", value: "published" },
      { label: "Ended", value: "ended" },
      ],
      exams: [
      ],
    };
  },
  computed: {
    filteredExams() {
      let filtered = this.exams;

      if (this.statusFilter) {
        filtered = filtered.filter((exam) => exam.status === this.statusFilter);
      }

      if (this.searchQuery) {
        const q = this.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (exam) =>
            exam.title.toLowerCase().includes(q) ||
            exam.description.toLowerCase().includes(q)
        );
      }

      return filtered;
    },
  },
  methods: {
    toggleStatusDropdown() {
      this.statusDropdownOpen = !this.statusDropdownOpen;
    },
    selectStatus(status) {
      this.statusFilter = status.toUpperCase();
      this.statusDropdownOpen = false;
    },
   formatDate(dateString) {
      return dayjs(dateString).format('YYYY-MM-DD HH:mm A') // or 'MMM D, YYYY h:mm A'
   },
    formatDuration(durationStr) {
  const totalMins = parseInt(durationStr); // e.g., "1425 mins" → 1425
  const hours = Math.floor(totalMins / 60);
  const minutes = totalMins % 60;
  return `${hours} hrs ${minutes} mins`;
  },
    calculateDuration(start, end) {
      const startTime = new Date(start);
      const endTime = new Date(end);
      const diffMs = endTime - startTime;
      const minutes = Math.floor(diffMs / 60000);

      if (minutes < 60) return `${minutes} min`;
      const hours = Math.floor(minutes / 60);
      const remainingMin = minutes % 60;

      return `${hours} hr${hours > 1 ? "s" : ""}${remainingMin ? ` ${remainingMin} min` : ""
        }`;
    },
    statusClass(status) {
      switch (status) {
        case "draft":
          return "bg-yellow-50";
        case "published":
          return "bg-blue-50";
        case "pending":[]
          return "bg-green-50";
        case "expired":
          return "bg-red-50";
        case "canceled":
          return "bg-red-50";
        case "ended":
          return "bg-red-50";
        default:
          return "";
      }
    },
    editExam(id) {
        this.$router.push({ name: "editExams", params: { id: id } });
    },
deleteExam(id) {
  const index = this.exams.findIndex(exam => exam.id === id);
  if (index === -1) {
    alert("Exam not found.");
    return;
  }

  if (confirm("Are you sure you want to cancel this exam?")) {
    axios.put(`${API_BASE_URL}/api/exams/canceled/${id}`, null, {
      withCredentials: true,   // if backend uses session cookies
      // headers: { Authorization: 'Bearer <token>' } // if using JWT
    })
    .then(() => {
      this.exams[index].status = 'CANCELED';
      console.log(`Exam with id ${id} canceled`);
    })
    .catch(error => {
      console.error("Failed to cancel exam:", error);
      alert("Failed to cancel exam. Please try again.");
    });
  }
},
    handleClickOutside(event) {
      const dropdown = this.$el.querySelector("th.relative");
      if (dropdown && !dropdown.contains(event.target)) {
        this.statusDropdownOpen = false;
      }
    },
    async getAllExam(){
      try{
        const response = await axios.get(API_BASE_URL + "/api/exams/all",
          {withCredentials:true}
        );
        console.log(response)
        this.exams = response.data;
      }catch(ex){
            console.log(ex)
      }
    }
  },
  mounted() {
    this.getAllExam();
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<style scoped>
tr {
  position: relative;
}

/* Initially hide popup buttons */
.popup-container {
  opacity: 0;
  scale: 0.9;
  pointer-events: none;

  transition: all 0.3s ease-in-out;
  position: absolute;
  right: 1rem;
  top: -2.5rem;
  display: flex;
  gap: 0.5rem;

  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);

  font-size: 0.875rem;
  color: #374151;

  transform-origin: bottom right;
}

/* Show popup buttons on row hover only */
tbody tr.group:hover .popup-container {
  opacity: 1 !important;
  scale: 1 !important;
  pointer-events: auto !important;
}

/* Popup buttons style */
.popup-btn {
  font-weight: 600;
  cursor: pointer;
  border-radius: 0.375rem;
  padding: 0.25rem 0.75rem;
  transition: all 0.25s ease;
  border: none;
  color: white;
  user-select: none;
  white-space: nowrap;
  letter-spacing: 0.02em;
}

/* Edit button */
.edit-btn {
  background-color: #2563eb;
  /* blue-600 */
}

.edit-btn:hover {
  background-color: #1d4ed8;
  /* blue-700 */
  transform: scale(1.05);
  box-shadow: 0 0 8px #1d4ed8;
}

/* Delete button */
.delete-btn {
  background-color: #dc2626;
  /* red-600 */
}

.delete-btn:hover {
  background-color: #b91c1c;
  /* red-700 */
  transform: scale(1.05);
  box-shadow: 0 0 8px #b91c1c;
}

/* Arrow under popup buttons */
.popup-arrow {
  position: absolute;
  bottom: -6px;
  /* just below the popup */
  right: 16px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid white;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.group:hover .popup-arrow {
  opacity: 1;
}
</style>
