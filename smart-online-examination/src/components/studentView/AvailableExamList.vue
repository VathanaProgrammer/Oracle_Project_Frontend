<template>
  <div class="mt-12 px-4 xl:px-0 max-w-6xl mx-auto">
    <!-- Title -->
    <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">Available Exams</h2>

    <!-- Custom Search Bar -->
    <div class="flex items-center justify-between bg-gray-100 p-4 rounded-xl shadow mb-10">
      <!-- Left Icon + Label -->
      <div class="flex items-center space-x-2 text-gray-600">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 14l9-5-9-5-9 5 9 5zm0 0v7"/>
        </svg>
        <span class="font-medium">My Subjects</span>
      </div>

      <!-- Center Search -->
      <div class="flex items-center w-full max-w-lg bg-white rounded-full px-4 py-2 border border-gray-300 shadow-inner mx-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search exams, teachers, or topics..."
          class="w-full focus:outline-none text-gray-700"
        />
      </div>

      <!-- Right Icon + Label -->
      <div class="flex items-center space-x-2 text-gray-600">
        <span class="font-medium">Filters</span>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707l-6.414 6.414A1 1 0 0113 13v5a1 1 0 01-2 0v-5a1 1 0 01-.293-.707L4.293 6.707A1 1 0 014 6V4z"/>
        </svg>
      </div>
    </div>

    <!-- Exam Cards -->
    <div class="grid gap-6 xl:grid-cols-2">
      <div
        v-for="(exam, index) in filteredExams"
        :key="index"
        class="bg-white rounded-md shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition duration-300 p-6 flex flex-col xl:flex-row items-center xl:items-start"
      >
        <img
          :src="exam.teacherImage"
          alt="Teacher photo"
          class="h-16 w-16 rounded-full object-cover mr-6 mb-4 xl:mb-0"
        />

        <div class="flex-1">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-lg font-semibold text-gray-800">{{ exam.subject }}</p>
              <p class="text-sm text-gray-500">By {{ exam.teacher }}</p>
            </div>

            <span
              class="text-xs font-medium px-3 py-1 rounded-full"
              :class="{
                'bg-blue-100 text-blue-700': exam.type === 'quiz',
                'bg-green-100 text-green-700': exam.type === 'file',
                'bg-purple-100 text-purple-700': exam.type === 'startable'
              }"
            >
              {{ exam.type === 'quiz' ? 'Quiz' : exam.type === 'file' ? 'File Exam' : 'Exam' }}
            </span>
          </div>

          <div class="mt-4 text-gray-600 space-y-1">
            <p><strong>Date/Time:</strong> {{ exam.datetime }}</p>
            <p><strong>Duration:</strong> {{ exam.duration }}</p>
            <p><strong>Deadline:</strong> {{ exam.deadline }}</p>
          </div>

          <div class="mt-6">
            <button
              v-if="exam.type === 'quiz'"
              @click="startExam(exam)"
              class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Start Quiz
            </button>

            <button
              v-else-if="exam.type === 'startable'"
              @click="startExam(exam)"
              class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Start Exam
            </button>

            <div v-else-if="exam.type === 'file'" class="space-x-2">
              <a
                :href="exam.fileUrl"
                download
                class="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Download File
              </a>
              <button
                @click="uploadAnswer(exam)"
                class="inline-block bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
              >
                Upload Answer
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="filteredExams.length === 0"
        class="col-span-full text-center py-10 text-gray-500"
      >
        No available exams match your search.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      availableExams: [
        {
          subject: "Data Structures",
          teacher: "Dr. Smith",
          teacherImage: "https://randomuser.me/api/portraits/men/32.jpg",
          datetime: "2025-05-20 09:00 AM",
          duration: "90 mins",
          deadline: "2025-05-20 10:30 AM",
          type: "quiz",
        },
        {
          subject: "Research Assignment",
          teacher: "Prof. Jane",
          teacherImage: "https://randomuser.me/api/portraits/women/44.jpg",
          datetime: "2025-05-22 01:30 PM",
          duration: "Open Deadline",
          deadline: "2025-05-30 11:59 PM",
          type: "file",
          fileUrl: "https://example.com/assignment1.pdf",
        },
        {
          subject: "Algorithms Quiz",
          teacher: "Dr. Lee",
          teacherImage: "https://randomuser.me/api/portraits/men/65.jpg",
          datetime: "2025-05-23 10:15 AM",
          duration: "60 mins",
          deadline: "2025-05-23 11:15 AM",
          type: "quiz",
        },
        {
          subject: "Final Term Exam",
          teacher: "Prof. Alice",
          teacherImage: "https://randomuser.me/api/portraits/women/48.jpg",
          datetime: "2025-05-25 02:00 PM",
          duration: "120 mins",
          deadline: "2025-05-25 04:30 PM",
          type: "startable",
        },
      ],
    };
  },
  computed: {
    filteredExams() {
      const query = this.searchQuery.toLowerCase();
      return this.availableExams.filter((exam) =>
        exam.subject.toLowerCase().includes(query) ||
        exam.teacher.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    startExam(exam) {
      alert(`Starting ${exam.type === 'quiz' ? 'Quiz' : 'Exam'}: ${exam.subject}`);
    },
    uploadAnswer(exam) {
      alert(`Uploading answer for: ${exam.subject}`);
    },
  },
};
</script>

<style scoped>
/* Custom styling if needed */
</style>
