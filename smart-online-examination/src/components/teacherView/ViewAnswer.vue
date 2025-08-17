<template>
    <div class="p-6 rounded-md min-h-[500px] w-full bg-white mx-auto shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <div v-if="exam">
            <header class="flex justify-between">
                <h2 class="text-3xl font-bold mb-6 text-center text-gray-800">
                    {{ exam.title }}
                </h2>
                <p class="text-gray-600 mb-6 text-center">
                    <span v-if="exam.type === 'QUIZ'" class="font-semibold text-yellow-500">{{ exam.type }}</span>
                    <span v-if="exam.type === 'MIDTERM'" class="font-semibold text-purple-600">{{ exam.type }}</span>
                    <span v-if="exam.type === 'FINAL'" class="font-semibold text-green-700">{{ exam.type }}</span>
                </p>
            </header>

            <div v-if="isMcqType">
                <div v-for="(q, index) in exam.questions" :key="q.id"
                    class="mb-6 p-4 rounded-md border border-gray-200 shadow-sm hover:shadow-md transition">
                    <p class="font-semibold text-lg mb-3">
                        {{ index + 1 }}.
                        <span v-if="q.type === 'file_exam'">File Exam (<span style="color: green">{{ q.score
                        }}pt</span>)</span>
                        <span v-else>{{ q.content }} (<span style="color: green">{{ q.score }}pt</span>)</span>
                    </p>

                    <!-- multiple_choice -->
                    <ul v-if="q.type === 'multiple_choice'" class="ml-4 mt-2 space-y-3">
                        <li v-for="(opt, i) in q.options" :key="i">
                            <label
                                class="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition">
                                <input type="radio" :name="'q' + q.id" :value="i" v-model="answers[q.id]"
                                    @change="logAnswerChange(q.id)" class="form-radio text-blue-600" />
                                <span>{{ opt }}</span>
                            </label>
                        </li>
                    </ul>

                    <!-- true_false -->
                    <ul v-else-if="q.type === 'true_false'" class="ml-4 mt-2 space-y-3">
                        <li v-for="opt in ['true', 'false']" :key="opt">
                            <label
                                class="flex items-center space-x-3 cursor-pointer text-gray-700 hover:text-blue-600 transition">
                                <input type="radio" :name="'q' + q.id" :value="opt" v-model="answers[q.id]"
                                    class="form-radio text-blue-600" />
                                <span class="capitalize">{{ opt }}</span>
                            </label>
                        </li>
                    </ul>

                    <!-- file_exam -->
                    <div v-else-if="q.type === 'file_exam'" class="bg-gray-50 p-4 border rounded">
                        <div v-for="(file, i) in q.fileExams" :key="i" class="mb-3">
                            <p class="font-semibold text-blue-700 mb-2">{{ file.title }}</p>
                            <p class="text-sm text-gray-600">{{ file.description }}</p>
                            <a :href="`${API_BASE_FILE_URL}/${file.fileUrl}`"
                                class="text-blue-600 underline hover:text-blue-800" target="_blank" download>
                                ⬇ Download File
                            </a>
                        </div>
                        <input type="file" class="mt-4" @change="handleFileUpload($event, q.id)" />
                    </div>

                    <!-- short_answer -->
                    <div v-else-if="q.type === 'short_answer'" class="mt-4">
                        <label class="block text-gray-700 mb-2">Your Answer:</label>
                        <textarea v-model="answers[q.id]" class="w-full p-2 border rounded" rows="4"
                            placeholder="Type your answer here..."></textarea>
                    </div>

                    <div v-else class="text-red-500 font-medium">
                        Unknown question type.
                    </div>
                </div>

                <button v-if="userStore.user.role !== 'ADMIN'" :disabled="userStore.user.role === 'ADMIN'"
                    class="w-full md:w-auto bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold transition"
                    @click="submitAnswers">
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
const router = useRouter();
const toast = useToast();
export default {

    data() {
        return {
            API_BASE_FILE_URL,
            API_BASE_URL,
            exam: null,
            files: [],
            answers: {},
            answersPayload: [],// store user's answers, e.g. answers[questionId] = answerValue
            uploadedFiles: {}, // questionId -> File object
        };
    },
    setup() {
        const router = useRouter();
        const userStore = useUserStore()
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
        logAnswerChange(questionId) {
            console.log(`Question ${questionId} selected value:`, this.answers[questionId]);
        },
        async fetchExamDetails() {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/exams/forAdmin/9`, {
                    headers: { Accept: "application/json" },
                    withCredentials: true,
                });
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
                    answerTrueFalse = userAnswer === "true" ? true : (userAnswer === "false" ? false : null);
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
                const response = await axios.post(`${API_BASE_URL}/api/answers`, formData, {
                    withCredentials: true,
                });
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
