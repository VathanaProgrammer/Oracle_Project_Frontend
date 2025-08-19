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
          <span v-else-if="answer.questionDTO.type === 'file_exam'"
            >Manual grading required</span
          >
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
      userId: this.$route.params.userId,
      examId: this.$route.params.id,
      API_BASE_FILE_URL,
      API_BASE_URL,
      exam: null,
      files: [],
      answers: {},
      answersPayload: [], // store user's answers, e.g. answers[questionId] = answerValue
      uploadedFiles: {}, // questionId -> File object
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
    isMcqType() {
      return (
        this.exam &&
        ["QUIZ", "MIDTERM", "FINAL"].includes(this.exam.type) &&
        Array.isArray(this.exam.questions) &&
        this.exam.questions.length > 0
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
    console.log(this.userStore.user?.lastname);
    this.fetchExamDetails();
  },
  methods: {
    isAnswerCorrect(answer) {
      const q = answer.questionDTO;

      if (q.type === "file_exam" && q.autoScore) return true; // Always correct if autoScore
      if (q.type === "true_false")
        return answer.answerTrueFalse === (q.correctAnswer === "true");
      if (q.type === "multiple_choice")
        return answer.answerIndex === q.correctAnswerIndex;
      if (q.type === "short_answer")
        return answer.answerContent === q.correctAnswer;

      return false; // file_exam manual check
    },

    autoCalculateScore(answer) {
      const q = answer.questionDTO;
      if (q.type === "file_exam" && q.autoScore) return q.score; // full points for auto-scored file_exam
      return this.isAnswerCorrect(answer) ? q.score : 0;
    },
    logAnswerChange(questionId) {
      console.log(
        `Question ${questionId} selected value:`,
        this.answers[questionId]
      );
    },
    async fetchExamDetails() {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/complete-exams/${this.examId}/viewAnswer/${this.userId}`,
          {
            headers: { Accept: "application/json" },
            withCredentials: true,
          }
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
        this.uploadedFiles = { ...this.uploadedFiles, [questionId]: file };
        console.log(`File uploaded for question ${questionId}:`, file.name);
      }
    },
    async submitAnswers() {
      if (!this.userStore.user.id || !this.userStore.user.id) {
        toast.error("Student information not found.", {
          position: "bottom-center",
          closeOnClick: true,
          pauseOnHover: true,
        });
        return;
      }

      console.log("Submitting answers for student ID:", this.userStore.user.id);

      const answersPayload = this.questions.map((question, index) => {
        const userAnswer = this.answers[question.id]; // use question.id as key (not index)

        let answerContent = null;
        let answerTrueFalse = null;
        let answerIndex = index;
        let answerFilePath = null;

        if (question.type === "short_answer") {
          answerContent = userAnswer || "";
        } else if (question.type === "true_false") {
          // If you stored true/false as string, convert to boolean
          answerTrueFalse =
            userAnswer === "true"
              ? true
              : userAnswer === "false"
              ? false
              : null;
        } else if (question.type === "multiple_choice") {
          // If your answers[q.id] stores selected choice index or value, assign it here
          answerIndex = userAnswer || 0;
        }
        // For file_exam, file is handled separately

        return {
          answerContent,
          answerTrueFalse,
          answerIndex,
          answerFilePath,
          studentDTO: { id: this.userStore.user.id },
          questionDTO: { id: question.id },
        };
      });
      const formData = new FormData();
      //   files.forEach(file => {
      //   formData.append("files", file, `${file.questionId}_${file.name}`);
      // });
      formData.append("answers", JSON.stringify(answersPayload));
      answersPayload.forEach((item, index) => {
        console.log(index, item);
      });
      formData.forEach((value, key) => {
        console.log("Key:", key);
        console.log("Value:", value);
      });
      for (const q of this.questions) {
        const userAnswer = this.answers[q.id];
        const file = this.uploadedFiles[q.id];

        switch (q.type) {
          case "multiple_choice":
            if (!userAnswer) {
              toast.error(`Please select an option for question ${q.id}.`);
              return;
            }
            break;

          case "true_false":
            if (userAnswer !== "true" && userAnswer !== "false") {
              toast.error(`Please select True or False for question ${q.id}.`);
              return;
            }
            break;

          case "short_answer":
            if (!userAnswer || userAnswer.trim() === "") {
              toast.error(`Please provide an answer for question ${q.id}.`);
              return;
            }
            break;

          case "file_exam":
            if (!file) {
              toast.error(`Please upload a file for question ${q.id}.`);
              return;
            }
            break;

          default:
            toast.error(`Unknown question type for question ${q.id}.`);
            return;
        }

        if (file) {
          formData.append("files", file, `${q.id}_${file.name}`);
        }
      }

      try {
        const response = await axios.post(
          `${API_BASE_URL}/api/answers`,
          formData,
          {
            withCredentials: true,
          }
        );
        toast.success("Answers submitted successfully!");
        console.log("Submission response:", response.data);
      } catch (error) {
        toast.error(`Submit error: ${error.response?.data || error.message}`);
        console.error("Submit error:", error);
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
