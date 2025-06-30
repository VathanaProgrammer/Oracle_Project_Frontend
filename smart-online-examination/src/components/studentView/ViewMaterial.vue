<template>
  <div class="mt-12 px-4 xl:px-0 max-w-5xl mx-auto">
    <h2 class="text-3xl font-bold text-gray-800 mb-6">Study Materials</h2>

    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search by subject or teacher..."
        class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>

    <div v-if="filteredMaterials.length === 0" class="text-center text-gray-500 py-10">
      No materials found.
    </div>

    <ul class="space-y-6">
      <li
        v-for="(material, index) in filteredMaterials"
        :key="index"
        class="bg-white shadow rounded-lg p-6 flex items-center justify-between"
      >
        <div>
          <p class="text-lg font-semibold text-gray-800">{{ material.title }}</p>
          <p class="text-sm text-gray-500">
            Subject: <span class="font-medium">{{ material.subject }}</span> |
            Teacher: <span class="font-medium">{{ material.teacher }}</span> |
            Uploaded: <span class="font-medium">{{ formatDate(material.uploadedDate) }}</span>
          </p>
        </div>

        <a
          :href="material.fileUrl"
          target="_blank"
          download
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
          >Download</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
      materials: [
        {
          title: "Data Structures - Lecture Notes",
          subject: "Data Structures",
          teacher: "Dr. Smith",
          uploadedDate: "2025-05-10",
          fileUrl: "https://example.com/data-structures-notes.pdf",
        },
        {
          title: "Operating Systems - Video Tutorial",
          subject: "Operating Systems",
          teacher: "Prof. Johnson",
          uploadedDate: "2025-05-12",
          fileUrl: "https://example.com/os-tutorial.mp4",
        },
        {
          title: "Algorithms - Practice Problems",
          subject: "Algorithms",
          teacher: "Dr. Lee",
          uploadedDate: "2025-05-15",
          fileUrl: "https://example.com/algorithms-practice.pdf",
        },
        // Add more materials as needed
      ],
    };
  },
  computed: {
    filteredMaterials() {
      if (!this.searchQuery) return this.materials;

      const query = this.searchQuery.toLowerCase();
      return this.materials.filter(
        (mat) =>
          mat.subject.toLowerCase().includes(query) ||
          mat.teacher.toLowerCase().includes(query) ||
          mat.title.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    formatDate(dateStr) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    },
  },
};
</script>

<style scoped>
/* Add any additional styles if you want */
</style>
