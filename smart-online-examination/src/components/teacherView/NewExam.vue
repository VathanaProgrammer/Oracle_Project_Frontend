<template>
  <div class="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-10">
    <h2 class="text-3xl font-bold text-gray-800">Create / Edit Exam</h2>

    <!-- Assigned Info -->
    <section class="space-y-6">
      <h3 class="text-xl font-semibold text-gray-700">Assigned To Student</h3>

      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Assignment</label>
        <select
          v-model="assignedId"
          class="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option disabled value="">-- Please select --</option>
          <option v-for="assign in assignments" :key="assign.id" :value="assign.id">
            {{ formatAssignment(assign) }}
          </option>
        </select>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Start Time</label>
          <input type="datetime-local" v-model="startTime" class="w-full p-3 border rounded-md" />
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">End Time</label>
          <input type="datetime-local" v-model="endTime" class="w-full p-3 border rounded-md" />
        </div>
      </div>

      <p v-if="calculatedDuration" class="text-sm text-gray-500">Duration: {{ calculatedDuration }}</p>
    </section>

    <!-- Title / Type / Description -->
    <section class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Exam Title</label>
          <input v-model="examTitle" placeholder="Enter exam title" class="w-full p-3 border rounded-md" />
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Exam Type</label>
          <select
            v-model="type"
            class="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option disabled value="">Select exam type</option>
            <option v-for="examType in examTypeAssign" :key="examType" :value="examType">
              {{ examType.charAt(0).toUpperCase() + examType.slice(1) }}
            </option>
          </select>
        </div>
      </div>

      <div>
        <label class="block mb-1 text-sm font-medium text-gray-700">Description</label>
        <textarea
          v-model="examDescription"
          rows="3"
          placeholder="Describe the exam"
          class="w-full p-3 border rounded-md"
        ></textarea>
      </div>
    </section>

    <!-- Question Form -->
    <section class="space-y-6 bg-gray-50 p-6 rounded-md">
      <h3 class="text-xl font-semibold text-gray-800">
        {{ isEditing ? "Edit Question" : "Add Question" }}
      </h3>

      <select v-model="questionType" class="w-full p-3 border rounded-md">
        <option disabled value="">-- Select Question Type --</option>
        <option value="true_false">True / False</option>
        <option value="multiple_choice">Multiple Choice</option>
        <option value="short_answer">Short Answer</option>
        <option value="file_exam">File Exam</option>
      </select>

      <input
        v-if="questionType !== 'file_exam'"
        v-model="questionText"
        placeholder="Enter question"
        class="w-full p-3 border rounded-md"
      />

      <div class="grid grid-cols-2 gap-6">
        <input
          v-model.number="score"
          type="number"
          min="1"
          placeholder="Score"
          class="w-full p-3 border rounded-md"
        />
        <select v-model="autoScore" class="w-full p-3 border rounded-md">
          <option :value="true">Automatic</option>
          <option :value="false">Manual</option>
        </select>
      </div>

      <!-- True / False -->
      <div v-if="questionType === 'true_false'">
        <select v-model="trueFalseAnswer" class="w-full p-3 border rounded-md">
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>

      <!-- Multiple Choice -->
      <div v-if="questionType === 'multiple_choice'" class="space-y-2">
        <div
          v-for="(option, index) in multipleChoiceOptions"
          :key="index"
          class="flex items-center gap-3"
        >
          <input
            v-model="multipleChoiceOptions[index]"
            class="flex-1 p-2 border rounded-md"
            placeholder="Option"
          />
          <input type="radio" v-model="correctMCIndex" :value="index" />
          <button v-if="multipleChoiceOptions.length > 2" @click="removeMCOption(index)" class="text-red-500 text-sm">
            Remove
          </button>
        </div>
        <button @click="addMCOption" class="text-blue-600 text-sm">Add Option</button>
      </div>

      <!-- Short Answer -->
      <div v-if="questionType === 'short_answer'">
        <input
          v-model="shortAnswer"
          placeholder="Expected Answer"
          class="w-full p-3 border rounded-md"
        />
      </div>

      <!-- File Exam -->
      <div v-if="questionType === 'file_exam'" class="space-y-4">
        <input
          type="file"
          @change="handleFileChange($event)"
          multiple
          accept=".pdf,.doc,.docx"
          class="w-full p-2 border rounded-md"
        />
        <div
          v-for="(fileItem, index) in fileExams"
          :key="fileItem.id"
          class="bg-gray-100 p-4 rounded"
        >
          <div class="flex justify-between items-center">
            <div>{{ fileItem.fileUrl.name || fileItem.fileUrl }}</div>
            <button @click="removeFile(index)" class="text-red-500 text-sm">Remove</button>
          </div>
          <input
            v-model="fileItem.title"
            placeholder="Title"
            class="w-full p-2 border rounded mt-2"
          />
          <textarea
            v-model="fileItem.description"
            placeholder="Description"
            rows="2"
            class="w-full p-2 border rounded mt-2"
          ></textarea>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex gap-4 pt-4">
        <button
          @click="isEditing ? updateQuestion() : addQuestion()"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          {{ isEditing ? "Update" : "Add" }}
        </button>
        <button
          @click="clearQuestionForm"
          class="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
        >
          Clear
        </button>
      </div>
    </section>

    <!-- Question Preview -->
    <section v-if="questions.length" class="space-y-6">
      <h3 class="text-lg font-semibold text-gray-800">Questions Preview</h3>
      <div
        v-for="(q, i) in questions"
        :key="q.id"
        class="bg-gray-100 border-l-4 border-blue-500 p-4 rounded space-y-1"
      >
        <p class="font-semibold text-gray-800">Q{{ i + 1 }}: {{ q.question }} ({{ q.score }} pt)</p>
        <p class="text-sm text-gray-600">Scoring: {{ q.autoScore ? "Automatic" : "Manual" }}</p>
        <p v-if="q.type === 'true_false'">Answer: {{ q.correctAnswer }}</p>

        <div v-if="q.type === 'multiple_choice'">
          <p>Options:</p>
          <ul class="list-disc list-inside">
            <li
              v-for="(opt, idx) in q.options"
              :key="idx"
              :class="idx === q.correctAnswerIndex ? 'text-green-600 font-medium' : ''"
            >
              {{ opt }}
            </li>
          </ul>
        </div>

        <p v-if="q.type === 'short_answer'">Answer: {{ q.correctAnswer }}</p>

        <div class="flex gap-4 mt-2">
          <button @click="editQuestion(i)" class="text-blue-600 hover:underline text-sm">Edit</button>
          <button @click="deleteQuestion(i)" class="text-red-600 hover:underline text-sm">Delete</button>
        </div>
      </div>
    </section>

    <!-- Submit -->
    <div class="flex justify-end pt-10">
      <button
        @click="submitAll"
        class="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3 rounded-md"
      >
        Submit Exam
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { API_BASE_URL } from "../../config/useWebSocket";
let nextId = 1;
export default {
  data() {
    return {
      examTypeAssign: ["midterm", "final", "quiz"],

      assignedId: "", // changed from selectedAssigned
      assignments: [],
      startTime: "", // New field: ISO datetime string
      endTime: "", // New field: ISO datetime string

      // Example exam types
      type: "",
      examTitle: "",
      examDescription: "",

      // Replace single durationValue with separate fields for UI
      durationDays: 0,
      durationHours: 0,
      durationMinutes: 0,

      durationUnit: "minutes", // always send "minutes" to backend

      questionType: "",
      questionText: "",
      score: 1,
      autoScore: true,
      trueFalseAnswer: "true",
      multipleChoiceOptions: ["", ""],
      correctMCIndex: 0,
      shortAnswer: "",
      fileExams: [],

      questions: [],
      isEditing: false,
      editingIndex: -1,
    };
  },
  computed: {
    calculatedDuration() {
      if (!this.startTime || !this.endTime) return null;

      function parseLocalDateTime(datetimeLocalStr) {
        const [datePart, timePart] = datetimeLocalStr.split("T");
        const [year, month, day] = datePart.split("-").map(Number);
        const [hour, minute] = timePart.split(":").map(Number);
        return new Date(year, month - 1, day, hour, minute);
      }

      const start = parseLocalDateTime(this.startTime);
      const end = parseLocalDateTime(this.endTime);

      const ms = end - start;

      console.log("Start:", start);
      console.log("End:", end);
      console.log("Milliseconds diff:", ms);

      if (ms <= 0) return "Invalid time range";

      const totalMinutes = Math.floor(ms / 60000);

      if (totalMinutes < 60) {
        // less than 1 hour, just show minutes
        return `${totalMinutes} minute(s)`;
      } else if (totalMinutes < 1440) {
        // less than 1 day
        const hrs = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        return `${hrs} hour(s)` + (mins > 0 ? ` ${mins} min(s)` : "");
      } else {
        // 1 day or more
        const days = Math.floor(totalMinutes / 1440);
        const remainingMinutes = totalMinutes % 1440;
        const hrs = Math.floor(remainingMinutes / 60);
        const mins = remainingMinutes % 60;

        let result = `${days} day(s)`;
        if (hrs > 0) result += ` ${hrs} hour(s)`;
        if (mins > 0) result += ` ${mins} min(s)`;
        return result;
      }
    },

    // Compute total duration in minutes from days, hours, minutes fields
    totalDurationInMinutes() {
      return (
        this.durationDays * 24 * 60 +
        this.durationHours * 60 +
        this.durationMinutes
      );
    },
  },
  mounted() {
    const teacherId = 1; // Replace with real teacher id
    axios
      .get(`${API_BASE_URL}/api/assignments/teacher/${teacherId}`)
      .then((response) => {
        this.assignments = response.data;
        console.log("Assignments loaded:", this.assignments);
      })
      .catch((error) => {
        console.error("Error fetching assignments:", error);
        alert("❌ Failed to load assignments.");
      });
  },
  methods: {
    formatAssignment(assign) {
      return `Batch ${assign.batch} - Year ${assign.year} - ${assign.major} - ${assign.location} - Shift: ${assign.shiftName} - (${assign.shiftTime})`;
    },
    handleFileChange(event) {
      const files = Array.from(event.target.files);
      files.forEach((file) => {
        this.fileExams.push({
          fileUrl: file,
          title: "",
          description: "",
        });
      });

      console.log("Uploaded files:", this.fileExams);
    },
    validateExamForm() {
      const errors = [];

      const start = new Date(this.startTime);
      const end = new Date(this.endTime);
      const now = new Date();
      if (start <= now) {
        errors.push("Start time must be in the future (after now).");
      }

      if (end <= start) {
        errors.push("End time must be after the start time.");
      }
      // Assignment check
      if (!this.assignedId) {
        errors.push("Assignment must be selected.");
      }

      // Title & description
      if (!this.examTitle.trim()) {
        errors.push("Exam title is required.");
      }

      if (!this.examDescription.trim()) {
        errors.push("Exam description is required.");
      }

      // Type check
      if (!this.type) {
        errors.push("Exam type must be selected.");
      }

      // Time checks
      if (!this.startTime || !this.endTime) {
        errors.push("Start and end time must be selected.");
      } else if (this.getDurationInMinutes() <= 0) {
        errors.push("End time must be after start time.");
      }

      // Questions check
      if (this.questions.length === 0) {
        errors.push("At least one question must be added.");
      }

      // Per question validation (optional)
      this.questions.forEach((q, i) => {
        if (q.type !== "file_exam" && !q.question) {
          errors.push(`Question ${i + 1} text is required.`);
        }
        if (!q.type) {
          errors.push(`Question ${i + 1} type is required.`);
        }
        if (q.type === "multiple_choice") {
          if (
            q.options.length < 2 ||
            q.options.some((opt) => opt.trim() === "")
          ) {
            errors.push(
              `Question ${
                i + 1
              } must have at least two valid multiple choice options.`
            );
          }
        }
        if (
          q.type === "file_exam" &&
          (!q.fileExams || q.fileExams.length === 0)
        ) {
          errors.push(
            `Question ${i + 1} must have at least one uploaded file.`
          );
        }
      });

      if (errors.length) {
        alert("❌ Validation Error:\n\n" + errors.join("\n"));
        return false;
      }

      return true;
    },
    removeFile(index) {
      this.fileExams.splice(index, 1);
    },
    addMCOption() {
      this.multipleChoiceOptions.push("");
    },
    removeMCOption(index) {
      this.multipleChoiceOptions.splice(index, 1);
      if (this.correctMCIndex >= this.multipleChoiceOptions.length) {
        this.correctMCIndex = 0;
      }
    },
    addQuestion() {

      const question = {
        id: nextId++,
        type: this.questionType,
        score: this.score,
        autoScore: this.autoScore,
      };

      if (this.questionType !== "file_exam") {
        question.question = this.questionText;
      }

      if (this.questionType === "true_false") {
        question.correctAnswer = this.trueFalseAnswer;
      } else if (this.questionType === "multiple_choice") {
        question.options = [...this.multipleChoiceOptions];
        question.correctAnswerIndex = this.correctMCIndex;
      } else if (this.questionType === "short_answer") {
        question.correctAnswer = this.shortAnswer;
      } else if (this.questionType === "file_exam") {
        question.fileExams = this.fileExams.map((file) => ({
          id: file.id,
          fileUrl: file.fileUrl, // Keep the real File object
          title: file.title,
          description: file.description,
        }));
      }

      this.questions.push(question);
      this.clearQuestionForm();
    },
    editQuestion(index) {
      const q = this.questions[index];
      this.questionType = q.type;
      this.questionText = q.question;
      this.score = q.score;
      this.autoScore = q.autoScore;
      this.isEditing = true;
      this.editingIndex = index;

      if (q.type === "true_false") {
        this.trueFalseAnswer = q.correctAnswer;
      } else if (q.type === "multiple_choice") {
        this.multipleChoiceOptions = [...q.options];
        this.correctMCIndex = q.correctAnswerIndex;
      } else if (q.type === "short_answer") {
        this.shortAnswer = q.correctAnswer;
      } else if (this.questionType === "file_exam") {
        this.fileExams = q.fileExams.map((file) => ({
          id: file.id,
          fileUrl: file.fileUrl || "",
          title: file.title,
          description: file.description,
        }));
      }
    },
    updateQuestion() {
      const q = this.questions[this.editingIndex];
      q.type = this.questionType;
      q.question = this.questionText;
      q.score = this.score;
      q.autoScore = this.autoScore;

      if (q.type === "true_false") {
        q.correctAnswer = this.trueFalseAnswer;
      } else if (q.type === "multiple_choice") {
        q.options = [...this.multipleChoiceOptions];
        q.correctAnswerIndex = this.correctMCIndex;
      } else if (q.type === "short_answer") {
        q.correctAnswer = this.shortAnswer;
      } else if (q.type === "file_exam") {
        q.fileExams = this.fileExams.map((file) => ({
          id: file.id,
          title: file.title,
          description: file.description,
          fileUrl: file.fileUrl.name || file.fileUrl,
        }));
      }

      this.clearQuestionForm();
    },
    deleteQuestion(index) {
      this.questions.splice(index, 1);
    },
    clearQuestionForm() {
      this.questionType = "";
      this.questionText = "";
      this.score = 1;
      this.autoScore = true;
      this.trueFalseAnswer = "true";
      this.multipleChoiceOptions = ["", ""];
      this.correctMCIndex = 0;
      this.shortAnswer = "";
      this.fileExams = [];
      this.isEditing = false;
      this.editingIndex = -1;
    },
    getDurationInMinutes() {
      if (!this.startTime || !this.endTime) return 0;

      const parseLocalDateTime = (datetimeLocalStr) => {
        const [datePart, timePart] = datetimeLocalStr.split("T");
        const [year, month, day] = datePart.split("-").map(Number);
        const [hour, minute] = timePart.split(":").map(Number);
        return new Date(year, month - 1, day, hour, minute);
      };

      const start = parseLocalDateTime(this.startTime);
      const end = parseLocalDateTime(this.endTime);

      const diffMs = end - start;
      if (diffMs <= 0) return 0;

      return Math.floor(diffMs / 60000);
    },

    async submitAll() {
      if (!this.validateExamForm()) {
        return; // Stop if validation fails
      }
      try {
        const formData = new FormData();

        const examMeta = {
          assignTo: this.assignedId,
          startTime: this.startTime,
          status: "PUBLISHED", // or "PUBLISHED" based on your logic
          endTime: this.endTime,
          type: this.type, // exam type like midterm, final, etc.
          duration: this.getDurationInMinutes(), // total minutes sent to backend
          durationUnit: "minutes", // always "minutes"
          questions: this.questions.map((q) => ({
            ...q,
            fileExams: (q.fileExams || []).map((f) => ({
              title: f.title,
              description: f.description,
              fileUrl: f.fileUrl.name || f.fileUrl, // supports both real File and string URL
            })),
          })),

          title: this.examTitle,
          description: this.examDescription,
          createdBy: 1,
        };

        formData.append("examMeta", JSON.stringify(examMeta));

        // 🔥 Append files separately
        this.questions.forEach((q) => {
          if (q.type === "file_exam") {
            q.fileExams.forEach((fileObj) => {
              if (fileObj.fileUrl instanceof File) {
                console.log("Appending file:", fileObj.fileUrl.name);
                formData.append("files", fileObj.fileUrl);
              }
            });
          }
        });

        const response = await axios.post(`${API_BASE_URL}/api/exams`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
          console.log(examMeta);
        alert("✅ Exam saved successfully!");
      } catch (error) {
        console.error("❌ Error saving exam:", error);
        alert("❌ Failed to save exam.");
      }
    },
  },
};
</script>
