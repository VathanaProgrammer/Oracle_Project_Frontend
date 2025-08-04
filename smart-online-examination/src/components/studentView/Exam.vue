<template>
    <div
        class="p-6 rounded-md min-h-[500px] w-full bg-white mx-auto shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
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
                                <input type="radio" :name="'q' + q.id" :value="opt" v-model="answers[q.id]"
                                    class="form-radio text-blue-600" />
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
                            <p class="font-semibold text-blue-700 mb-2">
                                {{ file.title }}
                            </p>
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

                <button v-if="userStore.user.role !== 'ADMIN'" :disabled="userStore.user.role == 'ADMIN'"
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
import { API_BASE_URL, API_BASE_FILE_URL, API_BASE_PROFILE_URL } from "../../config/useWebSocket";
import { parseISO, format } from "date-fns";
import { useUserStore } from "@/store/store";
import CustomAlert from "../Custom/CustomAlert.vue";
import { useToast } from "vue-toastification";
import { showConfirmDialog } from "../utils/confirmDialog";
import { useRouter } from "vue-router";
import RippleButton from "../Custom/RippleButton.vue";
import DeleteIcon from "../icons/DeleteIcon.vue";
import EditIcon from "../icons/EditIcon.vue";
const toast = useToast();
export default {
    components: { CustomAlert, RippleButton, DeleteIcon, EditIcon },
    data() {
        return {
            API_BASE_FILE_URL,
            API_BASE_URL,
            API_BASE_PROFILE_URL,
            exam: null,
            answers: {},
            uploadedFiles: {},
            API_BASE_FILE_URL,
        };
    },
    setup() {
        const router = useRouter();
        const userStore = useUserStore();
        return { userStore };
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
    },
    mounted() {
        this.fetchExamDetails();
    },
    methods: {
        editExam(id) {
            this.$router.push({ name: "editExam", params: { id: id } });
        },
        endExam(exam) {
            showConfirmDialog(
                () => {
                    this.confirmEnd(exam);
                },
                {
                    title: "End this exam?",
                    text: "Once ended, students can no longer access it.",
                    icon: "warning",
                    confirmButtonText: "Yes, end it",
                    cancelButtonText: "No",
                }
            );
        },

        async confirmEnd(exam) {
            // Just your logic here (update status, API call, etc.)
            const response = await axios.put(
                API_BASE_URL + `/api/exams/${exam.id}/end`,
                null,
                { withCredentials: true }
            );
            if (response.data.success == true) {
                toast.success(response.data.message, {
                    position: "top-center",
                    closeOnClick: true,
                    pauseOnHover: true,
                });

                this.$router.push("/admin-dashboard");
            } else {
                toast.error("Failed to end exam.", {
                    position: "top-center",
                    closeOnClick: true,
                    pauseOnHover: true,
                });
            }

            console.log("Exam ended successfully:", response.data);
        },
        async fetchExamDetails() {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/api/exams/forAdmin/${this.id}`,
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
                this.uploadedFiles[questionId] = file;
                console.log(`File uploaded for question ${questionId}:`, file.name);
            }
        },
        submitAnswers() {
            console.log("Submitted answers:", this.answers);
            console.log("Uploaded files:", this.uploadedFiles);
            alert("Answers submitted!");
        },
        formatDuration(durationStr) {
            // durationStr = "1562 mins" — extract the number only
            if (!durationStr) return "";
            const minutes = parseInt(durationStr); // parseInt will grab number at start of string
            if (isNaN(minutes)) return "";
            const hrs = Math.floor(minutes / 60);
            const mins = minutes % 60;
            if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
            if (hrs > 0) return `${hrs}h`;
            return `${mins}m`;
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
    },
};
</script>
