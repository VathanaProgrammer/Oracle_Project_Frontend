<template>
  <div
    class="p-6 rounded-md min-h-[500px] w-full bg-white mx-auto shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
  >
    <div v-if="exam">
      <!-- Student Info -->
      <div class="flex items-center mb-6 space-x-4">
        <img
          v-if="exam.student?.profile"
          :src="`${API_BASE_PROFILE_URL}/${exam.student.profile}`"
          alt="Profile"
          class="w-16 h-16 rounded-full object-cover border"
        />
        <div>
          <p class="font-semibold text-xl">
            {{ exam.student.firstName }} {{ exam.student.lastName }}
          </p>
          <p class="text-gray-500 text-sm">Student ID: {{ exam.student.id }}</p>
        </div>
      </div>

      <!-- Exam Title -->
      <header class="flex justify-between mb-6">
        <h2 class="text-3xl font-bold text-gray-800">{{ exam.exam.title }}</h2>
        <span
          class="font-semibold px-2 py-1 rounded"
          :class="{
            'bg-yellow-100 text-yellow-700': exam.exam.type === 'QUIZ',
            'bg-purple-100 text-purple-700': exam.exam.type === 'MIDTERM',
            'bg-green-100 text-green-700': exam.exam.type === 'FINAL',
          }"
        >
          {{ exam.exam.type }}
        </span>
      </header>

      <div
        v-for="(answer, index) in exam.answers"
        :key="answer.questionDTO.id"
        class="mb-6 p-4 rounded-md border border-gray-200 shadow-sm"
      >
        <p class="font-semibold text-lg mb-2">
          {{ index + 1 }}.
          <span v-if="answer.questionDTO.type === 'file_exam'">File Exam</span>
          <span v-else>{{ answer.questionDTO.content }}</span>
          (<span class="text-green-600">{{ answer.questionDTO.score }}pt</span>)
        </p>

        <!-- Student's Answer -->
        <p>
          <span class="font-semibold">Student Answer: </span>
          <span v-if="answer.questionDTO.type === 'true_false'">
            {{
              answer.answerTrueFalse === true
                ? "True"
                : answer.answerTrueFalse === false
                ? "False"
                : "No answer"
            }}
          </span>
          <span v-else-if="answer.questionDTO.type === 'multiple_choice'">
            {{
              answer.answerIndex !== null
                ? answer.questionDTO.options[answer.answerIndex]
                : "No answer"
            }}
          </span>
          <span v-else-if="answer.questionDTO.type === 'short_answer'">
            {{ answer.answerContent || "No answer" }}
          </span>
          <span v-else-if="answer.questionDTO.type === 'file_exam'">
            <a
              v-if="answer.answerFilePath"
              :href="`${API_BASE_FILE_URL}/${answer.answerFilePath}`"
              target="_blank"
              class="text-blue-600 underline"
            >
              Download Your File
            </a>
            <span v-else>No file submitted</span>
          </span>
        </p>

        <!-- Correct Answer -->
        <p v-if="answer.questionDTO.autoScore">
          <span class="font-semibold">Correct Answer:</span>
          <span v-if="answer.questionDTO.type === 'true_false'">
            {{ answer.questionDTO.correctAnswer === "true" ? "True" : "False" }}
          </span>
          <span v-else-if="answer.questionDTO.type === 'multiple_choice'">
            {{
              answer.questionDTO.correctAnswerIndex !== null
                ? answer.questionDTO.options[
                    answer.questionDTO.correctAnswerIndex
                  ]
                : "Not available"
            }}
          </span>
          <span v-else-if="answer.questionDTO.type === 'short_answer'">
            {{ answer.questionDTO.correctAnswer || "Not available" }}
          </span>
          <span v-else-if="answer.questionDTO.type === 'file_exam'">
            Manual grading required
          </span>
        </p>

        <!-- Score Section -->
        <div class="mt-2 flex items-center space-x-3">
          <span class="font-semibold">Score:</span>

          <!-- File exam manual score -->
          <input
            v-if="
              !answer.questionDTO.autoScore &&
              answer.questionDTO.type === 'file_exam'
            "
            type="number"
            min="0"
            :max="answer.questionDTO.score"
            v-model.number="answer.reviewScore"
            class="w-20 border rounded p-1"
            placeholder="0"
          />

          <!-- Other manual score -->
          <input
            v-else-if="!answer.questionDTO.autoScore"
            type="number"
            min="0"
            :max="answer.questionDTO.score"
            v-model.number="answer.reviewScore"
            class="w-20 border rounded p-1"
            placeholder="0"
          />

          <!-- Auto score (including file_exam) -->
          <span v-else class="text-green-600 font-semibold">
            {{ autoCalculateScore(answer) }} / {{ answer.questionDTO.score }}
          </span>
        </div>

        <!-- Correctness Badge -->
        <p class="mt-2">
          <span
            v-if="answer.questionDTO.autoScore && isAnswerCorrect(answer)"
            class="text-green-600 font-semibold"
            >✔ Correct</span
          >
          <span
            v-else-if="answer.questionDTO.autoScore && !isAnswerCorrect(answer)"
            class="text-red-600 font-semibold"
            >✖ Wrong</span
          >
          <span v-else class="text-gray-500 font-semibold">Needs review</span>
        </p>
      </div>

      <!-- Teacher Feedback Submit Button -->
      <button
        @click="submitFeedback"
        class="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Feedback
      </button>
    </div>

    <div v-else class="text-center text-gray-500 py-10">
      <p>Loading exam...</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  API_BASE_URL,
  API_BASE_FILE_URL,
  API_BASE_PROFILE_URL,
} from "../../config/useWebSocket";
import { parseISO, format } from "date-fns";
import { useUserStore } from "@/store/store";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();

export default {
  data() {
    return {
      API_BASE_PROFILE_URL,
      API_BASE_FILE_URL,
      API_BASE_URL,
      userId: this.$route.params.userId,
      examId: this.$route.params.id,
      exam: null,
      files: [],
      answers: [],
      answersPayload: [],
      uploadedFiles: {},
    };
  },
  setup() {
    const router = useRouter();
    const userStore = useUserStore();
    return { userStore, router };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    totalScore() {
      if (!this.exam || !this.exam.answers) return 0;
      return this.exam.answers.reduce(
        (sum, answer) => sum + this.autoCalculateScore(answer),
        0
      );
    },
    totalPossible() {
      if (!this.exam || !this.exam.answers) return 0;
      return this.exam.answers.reduce(
        (sum, answer) => sum + answer.questionDTO.score,
        0
      );
    },
    questions() {
      return this.exam ? this.exam.questions : [];
    },
    student() {
      return this.userStore.user;
    },
  },
  mounted() {
    this.fetchExamDetails();
    console.log("Total Score:", this.totalScore);
    console.log("Total Possible Score:", this.totalPossible);
  },
  methods: {
    isAnswerCorrect(answer) {
      const q = answer.questionDTO;
      if (q.type === "file_exam" && q.autoScore) return true;
      if (q.type === "true_false")
        return (
          answer.answerTrueFalse != null &&
          answer.answerTrueFalse === (q.correctAnswer === "true")
        );
      if (q.type === "multiple_choice")
        return (
          answer.answerIndex != null &&
          answer.answerIndex === q.correctAnswerIndex
        );
      if (q.type === "short_answer")
        return (
          answer.answerContent != null &&
          answer.answerContent === q.correctAnswer
        );
      return false;
    },
    autoCalculateScore(answer) {
      const q = answer.questionDTO;
      if (!q.autoScore) return 0;

      switch (q.type) {
        case "true_false":
          return answer.answerTrueFalse === (q.correctAnswer === "true")
            ? q.score
            : 0;
        case "multiple_choice":
          return answer.answerIndex === q.correctAnswerIndex ? q.score : 0;
        case "short_answer":
          return answer.answerContent === q.correctAnswer ? q.score : 0;
        default:
          return 0;
      }
    },
    autoTotalScore() {
      if (!this.exam || !this.exam.answers) return 0;
      return this.exam.answers.reduce(
        (sum, answer) => sum + this.autoCalculateScore(answer),
        0
      );
    },
    totalPossibleScore() {
      if (!this.exam || !this.exam.answers) return 0;
      return this.exam.answers.reduce(
        (sum, answer) => sum + answer.questionDTO.score,
        0
      );
    },
    logAnswerChange(questionId) {
      const answer = this.exam.answers.find(
        (a) => a.questionDTO.id === questionId
      );
      console.log(`Question ${questionId} selected value:`, answer);
    },
    async fetchExamDetails() {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/complete-exams/${this.examId}/viewAnswer/${this.userId}`,
          { headers: { Accept: "application/json" }, withCredentials: true }
        );
        this.exam = response.data;
        console.log("Fetched exam details:", this.exam);
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    },
    handleFileUpload(event, questionId) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedFiles = {
          ...this.uploadedFiles,
          [questionId]: file,
        };
        console.log(`File uploaded for question ${questionId}:`, file.name);
      }
    },
    async submitFeedback() {
      if (!this.exam || !this.exam.student?.id) {
        toast.error("Student information missing.");
        return;
      }
      const feedbackPayload = this.exam.answers.map((answer) => {
        return {
          userId: this.exam.student.id,
          examId: this.exam.exam.id,
          questionId: answer.questionDTO.id,
          score: answer.questionDTO.autoScore
            ? this.autoCalculateScore(answer) // auto score if correct
            : answer.reviewScore || 0, // manual score
        };
      });

      console.log("Feedback payload:", feedbackPayload);

      // Uncomment below to actually submit
      
      try {
        const response = await axios.post(
          `${this.API_BASE_URL}/answer-feedback/create`,
          feedbackPayload,
          {
            withCredentials: true,
          }
        );

        console.table(response.data);
        if(response.data.success){
          toast.success("Feedback saved!", {
            position: "bottom-center"
          })
        }else{
          toast.error(response.data.message || "failed to save feedback", { position: "bottom-center"})
        }
      } catch (error) {
        toast.error(
          `Error saving feedback: ${error.response?.data?.message || error.message}`
        );
        console.error("Save error:", error);
      }
      
    },
    formatDuration(durationStr) {
      if (!durationStr) return "";
      const minutes = parseInt(durationStr);
      if (isNaN(minutes)) return "";
      const hrs = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
      if (hrs > 0) return `${hrs}h`;
      return `${mins}m`;
    },
    formatDateTime(datetimeStr) {
      try {
        const dateObj = parseISO(datetimeStr.replace(" ", "T"));
        return format(dateObj, "EEE, MMM d, yyyy • hh:mm a");
      } catch {
        return datetimeStr;
      }
    },
  },
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
