<template>
  <div class="min-h-screen px-4 py-6 lg:px-8 lg:py-10 bg-gray-100">
    <!-- Container max width -->
    <div class="max-w-6xl mx-auto bg-white p-6">
      <!-- Header above the filter row -->
      <header class="flex mb-4">
        <h2 class="text-2xl font-semibold text-gray-700 me-2">
          Student Results
        </h2>
        <StudentIcon class="h-10 w-10 mb-2 text-[#8C09F4]" />
      </header>

      <!-- Filters + search + export button row -->
      <div
        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
      >
        <!-- Assignment Dropdown -->
        <div class="w-full md:w-[350px]">
          <select
            v-model="selectedAssignment"
            class="w-full truncate rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option disabled value="">Select Assignment</option>
            <option
              v-for="assign in assignments"
              :key="assign.id"
              :value="assign"
              :title="formatAssignment(assign)"
            >
              {{ formatAssignment(assign) }}
            </option>
          </select>
        </div>

        <!-- Exam Dropdown -->
        <div class="w-full md:w-[250px]">
          <select
            v-model="selectedExamId"
            class="w-full rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option disabled value="">Select Exam</option>
            <option v-for="exam in exams" :key="exam.id" :value="exam.id">
              {{ exam.title }}
            </option>
          </select>
        </div>

        <!-- Search Input grows -->
        <input
          v-model="search"
          type="text"
          placeholder="Search student..."
          class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 flex-grow max-w-md"
        />

        <!-- Export Button aligned right -->
        <button
          @click="exportResults"
          class="bg-[#57cc99] hover:-translate-y-1 transform transition text-white text-md font-medium py-2 px-4 rounded-md flex-shrink-0"
        >
          Export to Excel
        </button>
      </div>

      <!-- White box for table + modal -->
      <div class="p-6 bg-white rounded-md shadow-md">
        <div class="overflow-auto">
          <table class="min-w-full table-auto border-collapse">
            <thead>
              <tr
                class="bg-gray-100 text-left text-sm font-medium text-gray-700"
              >
                <th class="py-2 px-4 text-gray-500 font-normal">#</th>
                <th class="py-2 px-4 text-gray-500 font-normal">Student</th>
                <th class="py-2 px-4 text-gray-500 font-normal">Score</th>
                <th class="py-2 px-4 text-gray-500 font-normal">Status</th>
                <th class="py-2 px-4 text-gray-500 font-normal">
                  Submitted At
                </th>
                <th class="py-2 px-4 text-gray-500 font-normal">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="(result, index) in filteredResults"
                :key="result.id"
                class="hover:bg-gray-50 border-b"
              >
                <td class="py-3 px-4">{{ index + 1 }}</td>
                <td class="py-3 px-4 font-semibold">
                  {{ result.studentName }}
                </td>
                <td class="py-3 px-4">{{ result.score }}</td>
                <td
                  class="py-3 px-4 font-semibold"
                  :class="
                    result.score >= 50 ? 'text-green-600' : 'text-red-600'
                  "
                >
                  {{ result.score >= 50 ? "Pass" : "Fail" }}
                </td>
                <td class="py-3 px-4">{{ formatDate(result.submittedAt) }}</td>
                <td class="py-3 px-4">
                  <button
                    @click="viewResult(result)"
                    class="text-blue-600 text-sm hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
              <tr v-if="filteredResults.length === 0">
                <td colspan="6" class="text-center py-4 text-gray-500">
                  No results found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Friendly Result Modal -->
      <!-- Friendly Result Modal -->
      <div
        v-if="selectedResult"
        class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4"
      >
        <div
          class="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 space-y-6 overflow-y-auto max-h-[90vh]"
        >
          <!-- Header -->
          <div class="flex items-center gap-4 border-b pb-4">
            <img
              :src="
                API_BASE_PROFILE_URL + '/' + selectedResult.studentAvatar ||
                'https://via.placeholder.com/48'
              "
              alt="Avatar"
              class="w-20 h-20 rounded-full"
            />
            <div>
              <h2 class="text-lg font-semibold text-gray-700">
                {{ selectedResult.studentName }}
              </h2>
              <p class="text-gray-500 text-lg">
                Exam: {{ selectedResult.examTitle }}
              </p>
              <p class="text-gray-500 text-lg">
                Assignment: {{ assignmentText }}
              </p>
              <p class="text-gray-500 text-lg">
                Submitted: {{ formatDate(selectedResult.submittedAt) }}
              </p>
            </div>
          </div>

          <!-- Total Score -->
          <div class="flex justify-between items-center mb-4">
            <div>
              <p class="text-gray-600">Total Score:</p>
              <h3 class="text-2xl font-bold">
                {{ selectedResult.totalScore }}
              </h3>
            </div>
            <div>
              <span
                class="px-3 py-1 rounded-full text-white font-semibold"
                :class="
                  selectedResult.totalScore >= passScore
                    ? 'bg-green-500'
                    : 'bg-red-500'
                "
              >
                {{ selectedResult.totalScore >= passScore ? "Pass" : "Fail" }}
              </span>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              class="bg-green-500 h-3 rounded-full"
              :style="{
                width:
                  Math.min((selectedResult.totalScore / maxScore) * 100, 100) +
                  '%',
              }"
            ></div>
          </div>

          <!-- Question Cards -->
          <div
            v-for="(q, index) in selectedResult.questions"
            :key="q.questionId"
            class="border p-4 rounded-md mb-3 bg-gray-50"
          >
            <div class="flex justify-between items-center mb-2">
              <p v-if="q.questionType !== 'file_exam'" class="font-semibold">
                Q{{ index + 1 }}: {{ q.text }}
              </p>
              <p v-else class="font-semibold">Q{{ index + 1 }}: File exam</p>
              <span class="text-sm text-gray-500">
                {{ q.score }}/{{ q.maxScore }}
              </span>
            </div>

            <!-- ✅ MULTIPLE CHOICE -->
            <div v-if="q.questionType === 'multiple_choice'">
              <p><strong>Options:</strong></p>
              <ul class="list-disc pl-6">
                <li
                  v-for="(opt, i) in q.options"
                  :key="i"
                  :class="{
                    'text-green-600 font-bold': opt === q.correctAnswer,
                    'text-red-600':
                      opt === q.studentAnswer && opt !== q.correctAnswer,
                  }"
                >
                  {{ opt }}
                  <span v-if="opt === q.studentAnswer">(Your Answer)</span>
                </li>
              </ul>
            </div>

            <!-- ✅ TRUE/FALSE -->
            <div v-else-if="q.questionType === 'true_false'">
              <p>
                <strong>Student Answer:</strong>
                <span
                  :class="
                    q.studentAnswer === q.correctAnswer
                      ? 'text-green-600'
                      : 'text-red-600'
                  "
                >
                  {{ q.studentAnswer }}
                </span>
              </p>
              <p>
                <strong>Correct Answer:</strong>
                <span class="text-blue-600">{{ q.correctAnswer }}</span>
              </p>
            </div>

            <!-- ✅ SHORT ANSWER -->
            <div v-else-if="q.questionType === 'short_answer'">
              <p><strong>Student Answer:</strong> {{ q.studentAnswer }}</p>
              <p v-if="q.correctAnswer">
                <strong>Expected Answer:</strong> {{ q.correctAnswer }}
              </p>
            </div>

            <!-- ✅ FILE UPLOAD -->
            <div v-else-if="q.questionType === 'file_exam'">
              <p><strong>Student File:</strong></p>
              <a
                v-if="q.fileUrl"
                :href="API_BASE_FILE_URL + '/' + q.fileUrl"
                target="_blank"
                class="text-blue-500 underline"
              >
                Download Submission
              </a>
              <p v-if="q.correctFileUrl"><strong>Reference File:</strong></p>
              <a
                v-if="q.correctFileUrl"
                :href="API_BASE_FILE_URL + '/' + q.correctFileUrl"
                target="_blank"
                class="text-green-500 underline"
              >
                Download Reference
              </a>
            </div>

            <!-- ✅ FALLBACK (unknown type) -->
            <div v-else>
              <p><strong>Answer:</strong> {{ q.studentAnswer }}</p>
              <p v-if="q.correctAnswer">
                <strong>Correct:</strong> {{ q.correctAnswer }}
              </p>
            </div>

            <!-- Correct / Wrong / Submitted Badge -->
            <div class="mt-2">
              <span
                v-if="q.questionType !== 'file_exam'"
                class="px-2 py-1 text-xs font-semibold rounded-full"
                :class="
                  q.studentAnswer === q.correctAnswer
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                "
              >
                {{
                  q.studentAnswer === q.correctAnswer ? "✔ Correct" : "✘ Wrong"
                }}
              </span>

              <span
                v-else
                class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-700"
              >
                Submitted
              </span>
            </div>

            <!-- Teacher Feedback -->
            <p v-if="q.feedback" class="text-sm text-blue-600 italic mt-1">
              Feedback: {{ q.feedback }}
            </p>
          </div>

          <!-- Close Button -->
          <div class="text-right">
            <button
              @click="selectedResult = null"
              class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { API_BASE_URL, API_BASE_PROFILE_URL, API_BASE_FILE_URL } from "@/config/useWebSocket";
import axios from "axios";
import { useUserStore } from "@/store/store";
import { useToast } from "vue-toastification";
import StudentIcon from "../icons/StudentIcon.vue";
const toast = useToast();
import { useRouter } from "vue-router";
export default {
  components: {
    StudentIcon,
  },
  data() {
    return {
      API_BASE_PROFILE_URL,
      API_BASE_URL,
      API_BASE_FILE_URL,
      userStore: null,
      assignments: [],
      exams: [
        { id: 1, title: "Java Basics" },
        { id: 2, title: "Spring Boot Test" },
      ],
      selectedAssignment: "",
      selectedExamId: "",
      search: "",
      results: [],
      selectedResult: null,
    };
  },
  computed: {
    assignmentText() {
      const a = this.selectedResult?.assignmentInfo;
      if (!a) return "";

      return [
        a.batch?.batchName ? `Batch: ${a.batch.batchName}` : "",
        a.academicYear?.name ? `Academic Year: ${a.academicYear.name}` : "",
        a.location?.buildingName ? `Location: ${a.location.buildingName}` : "",
        a.major?.name ? `Major: ${a.major.name}` : "",
        a.course?.courseName ? `Course: ${a.course.courseName}` : "",
        a.teacher?.fullName ? `Teacher: ${a.teacher.fullName}` : "",
        a.section?.name ? `Section: ${a.section.name}` : "",
        a.room?.roomNumber ? `Room: ${a.room.roomNumber}` : "",
        a.schedule?.day
          ? `Schedule: ${a.schedule.day} ${a.schedule.time || ""}`
          : "",
      ]
        .filter(Boolean) // remove empty strings
        .join(" - ");
    },
    filteredResults() {
      return this.results
        .filter((r) =>
          r.studentName.toLowerCase().includes(this.search.toLowerCase())
        )
        .filter((r) => {
          if (
            this.selectedAssignment &&
            r.examId !== this.selectedAssignment.id
          )
            return false;
          if (this.selectedExamId && r.examId !== this.selectedExamId)
            return false;
          return true;
        });
    },
    maxScore() {
      if (!this.selectedResult?.questions) return 100; // fallback
      return this.selectedResult.questions.reduce(
        (sum, q) => sum + (q.maxScore || 0),
        0
      );
    },
    passScore() {
      return this.maxScore * 0.5; // 50% passing
    },
  },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    return { userStore, router };
  },
  methods: {
    async getAssignment() {
      try {
        const teacherId = this.userStore?.user.id;
        console.log(`teacherId: `, teacherId);
        const response = await axios.get(
          `${API_BASE_URL}/api/assignments/teacher/${teacherId}`,
          {
            withCredentials: true,
          }
        );
        this.assignments = response.data;
      } catch (err) {
        toast.error(err?.message);
      }
    },
    formatAssignment(assign) {
      return `Batch ${assign.batch} - Year ${assign.year} - ${assign.major} - ${assign.location} - Shift: ${assign.shiftName} (${assign.shiftTime})`;
    },
    formatDate(dt) {
      if (!dt) return "";
      return new Date(dt).toLocaleString();
    },
    async viewResult(result) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/answer-feedback/student/${result.studentId}/exam/${result.examId}`,
          { withCredentials: true }
        );
        const feedbacks = response.data;
        console.log(response.data);

        // Compute totalScore safely
        const totalScore = Array.isArray(feedbacks)
          ? feedbacks.reduce((sum, f) => sum + (f.score || 0), 0)
          : feedbacks.totalScore || 0;

        this.selectedResult = {
          studentName: result.studentName,
          studentId: result.studentId,
          studentAvatar:
            feedbacks.profilePicture || "https://via.placeholder.com/48",
          examTitle: feedbacks.examTitle || "Unknown Exam",
          assignmentInfo: feedbacks.assignmentInfo,
          submittedAt: result.submittedAt,
          totalScore,
          teacherComment: result.teacherComment || "",
          questions: feedbacks.questions || [],
        };
      } catch (err) {
        console.error(err);
        toast.error("Failed to load result: " + err?.message);
      }
    },
    exportResults() {
      alert("Export to Excel triggered (implement later)");
    },
    async getAllResults() {
      try {
        const teacherId = this.userStore?.user.id;
        const response = await axios.get(
          `${API_BASE_URL}/api/results/teacher/${teacherId}`,
          { withCredentials: true }
        );
        this.results = response.data; // only results for this teacher
        console.log("result for current teacher: ");
        console.log(response.data);
      } catch (err) {
        toast.error("Failed to load results: " + err?.message);
      }
    },
  },
  mounted() {
    this.getAssignment();
    this.getAllResults();
  },
};
</script>

<style scoped>
.popup-container {
  opacity: 0;
  scale: 0.9;
  pointer-events: none;

  transition: all 0.3s ease-in-out;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 0.5rem;

  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);

  font-size: 0.875rem;
  color: #374151;

  transform-origin: center right;
}

tbody tr.group:hover .popup-container {
  opacity: 1 !important;
  scale: 1 !important;
  pointer-events: auto !important;
}

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

.edit-btn {
  background-color: #2563eb;
}

.edit-btn:hover {
  background-color: #1d4ed8;
  transform: scale(1.05);
  box-shadow: 0 0 8px #1d4ed8;
}

.popup-arrow {
  position: absolute;
  bottom: -6px;
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

/* Optional: Smooth scrolling for long modal */
.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
