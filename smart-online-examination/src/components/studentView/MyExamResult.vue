<template>
  <div class="h-full mx-auto w-full bg-white shadow-lg rounded-e-md p-6">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">My Exam Results</h1>

    <!-- Search & Filter -->
    <div
      class="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6"
    >
      <input
        v-model="search"
        type="text"
        placeholder="Search exam..."
        class="border rounded-md p-2 w-full md:w-64"
      />

      <select v-model="selectedExamId" class="border rounded-md p-2">
        <option value="">All Exams</option>
        <option v-for="exam in exams" :key="exam.id" :value="exam.id">
          {{ exam.title }}
        </option>
      </select>
    </div>

    <!-- Exam Results Table -->
    <div class="overflow-x-auto">
      <table class="w-full bg-white rounded-md shadow overflow-hidden">
        <thead class="bg-gray-100">
          <tr class="text-left">
            <th class="p-3">Exam</th>
            <th class="p-3">Subject</th>
            <th class="p-3">Submitted</th>
            <th class="p-3">Score</th>
            <th class="p-3">Status</th>
            <th class="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="result in filteredResults"
            :key="result.examId"
            class="border-b hover:bg-gray-50"
          >
            <td class="p-3">{{ result.examTitle }}</td>
            <td class="p-3">{{ result.subject }}</td>
            <td class="p-3">{{ formatDate(result.submittedAt) }}</td>
            <td class="p-3 font-bold">
              {{ result.totalScore }}/{{ getMaxScore(result) }}
            </td>
            <td class="p-3">
              <span
                class="px-2 py-1 rounded-full text-white font-semibold"
                :class="
                  result.totalScore >= getMaxScore(result) * 0.5
                    ? 'bg-green-500'
                    : 'bg-red-500'
                "
              >
                {{
                  result.totalScore >= getMaxScore(result) * 0.5
                    ? "Pass"
                    : "Fail"
                }}
              </span>
            </td>
            <td class="p-3">
              <button
                @click="viewResult(result)"
                class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                View Details
              </button>
            </td>
          </tr>
          <tr v-if="filteredResults.length === 0">
            <td colspan="6" class="text-center p-4 text-gray-500">
              No results found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
</template>

<script>
import axios from "axios";
import {
  API_BASE_URL,
  API_BASE_PROFILE_URL,
  API_BASE_FILE_URL,
} from "@/config/useWebSocket";
import { useUserStore } from "@/store/store";
import { useToast } from "vue-toastification";

const toast = useToast();
export default {
  data() {
    return {
      API_BASE_PROFILE_URL,
      API_BASE_FILE_URL,
      exams: [],
      results: [],
      search: "",
      selectedExamId: "",
      selectedResult: null,
    };
  },
  computed: {
    filteredResults() {
      return this.results.filter((r) => {
        const matchesSearch = r.examTitle
          .toLowerCase()
          .includes(this.search.toLowerCase());
        const matchesExam =
          !this.selectedExamId || r.examId === this.selectedExamId;
        return matchesSearch && matchesExam;
      });
    },
    maxScore() {
      if (!this.selectedResult?.questions) return 100;
      return this.selectedResult.questions.reduce(
        (sum, q) => sum + (q.maxScore || 0),
        0
      );
    },
    passScore() {
      return this.maxScore * 0.5;
    },
    assignmentText() {
      const a = this.selectedResult?.assignmentInfo;
      if (!a) return "";
      return [
        a.batch?.batchName ? `Batch: ${a.batch.batchName}` : "",
        a.academicYear?.name ? `Year: ${a.academicYear.name}` : "",
        a.major?.name ? `Major: ${a.major.name}` : "",
        a.location?.buildingName ? `Location: ${a.location.buildingName}` : "",
      ]
        .filter(Boolean)
        .join(" - ");
    },
  },
  setup() {
    const userStore = useUserStore();
    const toast = useToast();
    return { userStore, toast };
  },
  methods: {
    async getResults() {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/results/student-summary`,
          { withCredentials: true }
        );
        this.results = res.data;
      } catch (err) {
        console.error(err);
        this.toast.error("Failed to fetch results");
      }
    },
    formatAssignment(a) {
      if (!a) return "";
      return `${a.batch?.batchName || ""} - ${
        a.academicYear?.name || ""
      }`.trim();
    },
    formatDate(dt) {
      return dt ? new Date(dt).toLocaleString() : "";
    },
    getMaxScore(result) {
      return (
        result.questions?.reduce((sum, q) => sum + (q.maxScore || 0), 0) || 100
      );
    },
    async viewResult(result) {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/answer-feedback/student/${this.userStore.user.id}/exam/${result.examId}`,
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
  },
  mounted() {
    this.getResults();
  },
};
</script>

<style scoped>
/* optional minor styling */
</style>
