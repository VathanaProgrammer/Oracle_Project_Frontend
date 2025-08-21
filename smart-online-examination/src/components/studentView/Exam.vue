<template>
  <div
    class="p-6 rounded-md min-h-[500px] w-full bg-white mx-auto shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
  >
    <div v-if="exam">
      <header class="flex justify-between items-center mb-6">
        <h2 class="text-3xl font-bold text-gray-800">{{ exam.title }}</h2>
        <div class="text-right">
          <p class="text-gray-600 mb-1">
            <span
              v-if="exam.type === 'QUIZ'"
              class="font-semibold text-yellow-500"
              >{{ exam.type }}</span
            >
            <span
              v-if="exam.type === 'MIDTERM'"
              class="font-semibold text-purple-600"
              >{{ exam.type }}</span
            >
            <span
              v-if="exam.type === 'FINAL'"
              class="font-semibold text-green-700"
              >{{ exam.type }}</span
            >
          </p>
          <p class="font-semibold" :class="examFinished ? 'text-red-500' : 'text-blue-600'">
            {{ examFinished ? 'Time is up!' : 'Time Remaining: ' + formatTime(remainingTime) }}
          </p>
        </div>
      </header>

      <div v-if="isMcqType">
        <div
          v-for="(q, index) in exam.questions"
          :key="q.id"
          class="mb-6 p-4 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition"
        >
          <p class="font-semibold text-lg mb-3">
            {{ index + 1 }}.
            <span v-if="q.type === 'file_exam'"
              >File Exam (<span class="text-green-600">{{ q.score }}pt</span>)</span
            >
            <span v-else>{{ q.content }} (<span class="text-green-600">{{ q.score }}pt</span>)</span>
          </p>

          <!-- multiple_choice -->
          <ul v-if="q.type === 'multiple_choice'" class="ml-4 mt-2 space-y-3">
            <li v-for="(opt, i) in q.options" :key="i">
              <label
                class="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition"
              >
                <input
                  type="radio"
                  :name="'q' + q.id"
                  :value="i"
                  v-model="answers[q.id]"
                  @change="logAnswerChange(q.id)"
                  class="form-radio text-blue-600"
                  :disabled="examFinished"
                />
                <span>{{ opt }}</span>
              </label>
            </li>
          </ul>

          <!-- true_false -->
          <ul v-else-if="q.type === 'true_false'" class="ml-4 mt-2 space-y-3">
            <li v-for="opt in ['true', 'false']" :key="opt">
              <label
                class="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition"
              >
                <input
                  type="radio"
                  :name="'q' + q.id"
                  :value="opt"
                  v-model="answers[q.id]"
                  class="form-radio text-blue-600"
                  :disabled="examFinished"
                />
                <span class="capitalize">{{ opt }}</span>
              </label>
            </li>
          </ul>

          <!-- file_exam -->
          <div
            v-else-if="q.type === 'file_exam'"
            class="bg-gray-50 p-4 border rounded"
          >
            <div v-for="(file, i) in q.fileExams" :key="i" class="mb-3">
              <p class="font-semibold text-blue-700 mb-2">{{ file.title }}</p>
              <p class="text-sm text-gray-600">{{ file.description }}</p>
              <a
                :href="`${API_BASE_FILE_URL}/${file.fileUrl}`"
                class="text-blue-600 underline hover:text-blue-800"
                target="_blank"
                download
              >
                ⬇ Download File
              </a>
            </div>
            <input
              type="file"
              class="mt-4"
              @change="handleFileUpload($event, q.id)"
              :disabled="examFinished"
            />
          </div>

          <!-- short_answer -->
          <div v-else-if="q.type === 'short_answer'" class="mt-4">
            <label class="block text-gray-700 mb-2">Your Answer:</label>
            <textarea
              v-model="answers[q.id]"
              class="w-full p-2 border rounded"
              rows="4"
              placeholder="Type your answer here..."
              :disabled="examFinished"
            ></textarea>
          </div>

          <div v-else class="text-red-500 font-medium">Unknown question type.</div>
        </div>

        <button
          v-if="!examFinished && userStore.user.role !== 'ADMIN'"
          class="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold transition"
          @click="submitAnswers"
        >
          Submit
        </button>
      </div>

      <div v-else class="text-center text-red-500 font-medium mt-6">
        Unsupported or unknown exam type.
      </div>
    </div>

    <div v-else class="text-center text-gray-500 py-10">
      <p>Loading exam...</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_BASE_URL, API_BASE_FILE_URL } from "../../config/useWebSocket";
import { parseISO, format } from "date-fns";
import { useUserStore } from "@/store/store";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

const toast = useToast();

export default {
  data() {
    return {
      API_BASE_FILE_URL,
      API_BASE_URL,
      exam: null,
      answers: {},
      uploadedFiles: {},
      remainingTime: 0,
      examFinished: false,
      timerInterval: null,
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
  },
  mounted() {
    this.fetchExamDetails();
  },
  methods: {
    logAnswerChange(questionId) {
      console.log(`Question ${questionId} selected value:`, this.answers[questionId]);
    },
    async fetchExamDetails() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/exams/forStudent/${this.id}`, {
          withCredentials: true,
        });
        this.exam = response.data.exam;

        const now = new Date();
        const endTime = new Date(this.exam.endTime);

        const diffSeconds = Math.floor((endTime - now) / 1000);
        if (diffSeconds <= 0) {
          this.remainingTime = 0;
          this.examFinished = true;
        } else {
          this.remainingTime = diffSeconds;
          this.startTimer();
        }
      } catch (error) {
        console.error("Error fetching exam details:", error);
      }
    },
    startTimer() {
      this.timerInterval = setInterval(() => {
        if (this.remainingTime <= 0) {
          clearInterval(this.timerInterval);
          this.examFinished = true;
          toast.info("Exam time is over. Auto-submitting your answers...", { position: "bottom-center"});
          this.submitAnswers(); // auto-submit when time is up
        } else {
          this.remainingTime--;
        }
      }, 1000);
    },
    formatTime(seconds) {
      const m = Math.floor(seconds / 60).toString().padStart(2, "0");
      const s = (seconds % 60).toString().padStart(2, "0");
      return `${m}:${s}`;
    },
    handleFileUpload(event, questionId) {
      const file = event.target.files[0];
      if (file) {
        this.uploadedFiles = { ...this.uploadedFiles, [questionId]: file };
      }
    },
    async submitAnswers() {
      if (!this.userStore.user?.id) return;

      const formData = new FormData();
      const answersPayload = [];

      for (const q of this.questions) {
        const userAnswer = this.answers[q.id];
        const file = this.uploadedFiles[q.id];

        // Validation
        if (!this.examFinished) {
          switch (q.type) {
            case "multiple_choice":
              if (userAnswer == null) return toast.error(`Please select option for question ${q.id}`, { position: "bottom-center",});
              break;
            case "true_false":
              if (userAnswer !== "true" && userAnswer !== "false")
                return toast.error(`Please select True/False for question ${q.id}`, { position: "bottom-center",});
              break;
            case "short_answer":
              if (!userAnswer?.trim())
                return toast.error(`Please provide answer for question ${q.id}`, { position: "bottom-center",});
              break;
            case "file_exam":
              if (!file) return toast.error(`Please upload file for question ${q.id}`, { position: "bottom-center",});
              break;
          }
        }

        const payloadItem = {
          examId: this.exam.id,
          answerContent: q.type === "short_answer" ? userAnswer : null,
          answerTrueFalse: q.type === "true_false" ? userAnswer === "true" : null,
          answerIndex: q.type === "multiple_choice" ? userAnswer : null,
          answerFilePath: null,
          userId: this.userStore.user.id,
          studentId: this.userStore.user.id,
          questionDTO: { id: q.id },
        };

        answersPayload.push(payloadItem);

        if (file) formData.append("files", file, `${q.id}_${file.name}`);
      }

      formData.append("answers", JSON.stringify(answersPayload));

      try {
        await axios.post(`${API_BASE_URL}/api/answers`, formData, { withCredentials: true });

        const payload = { userId: this.userStore.user.id, examId: this.exam.id };
        await axios.post(`${API_BASE_URL}/api/complete-exams/insert`, payload, { withCredentials: true });

        this.examFinished = true;
        toast.success("Answers submitted successfully!", { position: "bottom-center",});

        this.$router.push({ name: 'st-available-exam' });

      } catch (err) {
        toast.error(`Submit error: ${err.response?.data || err.message}`, { position: "bottom-center",});
      }
    },
  },
  beforeUnmount() {
    clearInterval(this.timerInterval);
  },
};
</script>
