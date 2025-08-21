<template>
  <div class="mt-4 bg-white rounded-md shadow">
    <!-- Search & Actions -->
    <div
      class="flex flex-col md:flex-row justify-between items-center gap-3 p-4 bg-gray-50"
    >
      <!-- Search -->
      <div class="flex items-center w-full lg:max-w-[600px]">
        <input
          type="text"
          v-model="search"
          placeholder="Search exam, subject, teacher, major, batch, shift, location..."
          class="w-full min-w-[150px] md:min-w-[280px] px-4 py-[6px] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8c09f4]"
        />
        <SearchIcon
          class="w-[38px] h-[38px] text-white bg-[#8c09f4] shadow-[0_4px_20px_rgba(0,0,0,0.1)] p-1 rounded-md ms-2"
        />
      </div>

      <!-- Actions -->
      <div class="flex gap-2">
        <button
          @click="clearFilters"
          class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md shadow hover:bg-gray-300 transition"
        >
          Clear Filters
        </button>
        <button
          @click="exportExams"
          class="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition"
        >
          ⬇ Export
        </button>
      </div>
    </div>

    <!-- Filters Row -->
    <div
      class="flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 p-4 border-t border-gray-100 bg-white"
    >
      <select v-model="filters.batch" class="px-3 py-2 border rounded-md">
        <option value="">Batch (All)</option>
        <option v-for="opt in batches" :key="opt.id" :value="opt.id">
          {{ opt.startYear + " - " + opt.endYear }}
        </option>
      </select>

      <select v-model="filters.major" class="px-3 py-2 border rounded-md">
        <option value="">Major (All)</option>
        <option v-for="opt in majors" :key="opt.id" :value="opt.id">
          {{ opt.name }}
        </option>
      </select>

      <select v-model="filters.subject" class="px-3 py-2 border rounded-md">
        <option value="">Subject (All)</option>
        <option v-for="opt in subjects" :key="opt.id" :value="opt.id">
          {{ opt.name }}
        </option>
      </select>

      <select v-model="filters.shift" class="px-3 py-2 border rounded-md">
        <option value="">Shift (All)</option>
        <option v-for="opt in shifts" :key="opt.id" :value="opt.id">
          {{ opt.name }}
        </option>
      </select>

      <select v-model="filters.teacher" class="px-3 py-2 border rounded-md">
        <option value="">Teacher (All)</option>
        <option v-for="opt in teachers" :key="opt.id" :value="opt.id">
          {{ opt.name }}
        </option>
      </select>
    </div>

    <!-- Table -->
    <div class="overflow-y-auto table-limit-height">
      <table class="min-w-full divide-y divide-gray-200 bg-white">
        <thead class="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Exam
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Subject
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Major
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Batch
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Shift
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Teacher
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Date
            </th>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-600">
              Status
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr v-if="filteredExams.length === 0">
            <td colspan="9" class="px-4 py-3 text-center text-gray-500">
              No exams found.
            </td>
          </tr>

          <tr
            v-for="exam in filteredExams"
            :key="exam.id"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-3 text-sm font-medium text-gray-700">
              {{ exam.title }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ exam.subject }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ exam.major }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ exam.batchName }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">
              {{ exam.shiftTime }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ exam.teacher }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ exam.datetime }}</td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-1 text-xs font-semibold rounded-full"
                :class="{
                  'bg-yellow-100 text-yellow-700': exam.status === 'UPCOMING',
                  'bg-green-100 text-green-700': exam.status === 'ONGOING',
                  'bg-gray-200 text-gray-700': exam.status === 'COMPLETED',
                }"
              >
                {{ exam.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import SearchIcon from "../icons/SearchIcon.vue";
import { fetchMetaData } from "@/services/metaService";

export default {
  components: { SearchIcon },
  data() {
    return {
      search: "",
      filters: {
        academicYear: "",
        semester: "",
        batch: "",
        major: "",
        subject: "",
        shift: "",
        teacher: "",
      },
      exams: [],
      academicYears: [],
      semesters: [],
      batches: [],
      majors: [],
      subjects: [],
      shifts: [],
      teachers: [],
      loading: false,
    };
  },
  computed: {
    filteredExams() {
      const s = this.search?.trim().toLowerCase() || "";

      return (this.exams || [])
        .filter((e) => {
          const haystack = `
          ${e.title ?? ""}
          ${e.subject ?? ""}
          ${e.teacher ?? ""}
          ${e.major ?? ""}
          ${e.batchName ?? ""}
          ${e.shiftTime ?? ""}
          ${e.academicYear ?? ""}
          ${e.semester ?? ""}
        `.toLowerCase();

          const matchesSearch = !s || haystack.includes(s);

          const f = this.filters;
          const matchesFilters =
            (!f.academicYear || e.academicYearId === f.academicYear) &&
            (!f.batch || e.batchId === f.batch) &&
            (!f.major || e.majorId === f.major) &&
            (!f.subject || e.subjectId === f.subject) &&
            (!f.shift || e.shiftId === f.shift) &&
            (!f.teacher || e.teacherId === f.teacher);

          return matchesSearch && matchesFilters;
        })
        .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
    },
  },

  methods: {
    clearFilters() {
      this.search = "";
      this.filters = {
        academicYear: "",
        semester: "",
        batch: "",
        major: "",
        subject: "",
        shift: "",
        teacher: "",
      };
    },

    exportExams() {
      const rows = this.filteredExams;
      if (!rows.length) return alert("No data to export.");

      const headers = [
        "Exam",
        "Subject",
        "Major",
        "Batch",
        "Shift",
        "Academic Year",
        "Semester",
        "Teacher",
        "Date",
        "Status",
      ];

      const csv = [
        headers.join(","),
        ...rows.map((e) =>
          [
            e.title,
            e.subject,
            e.major,
            e.batchName,
            e.shiftTime,
            e.academicYear,
            e.semester,
            e.teacher,
            e.datetime,
            e.status,
          ]
            .map((v) => String(v ?? "").replace(/"/g, '""'))
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `exams_export_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    },

    async fetchMetaDatas() {
      try {
        this.loading = true;
        const meta = await fetchMetaData();

        this.academicYears = meta.years;
        this.semesters = meta.semesters;
        this.batches = meta.batches;
        this.majors = meta.majors;
        this.subjects = meta.subjects;
        this.shifts = meta.shifts;
        this.teachers = meta.teachers;
        this.exams = meta.exams;

        console.log("Exams loaded:", this.exams);
      } catch (err) {
        console.error("Failed to fetch metadata:", err);
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchMetaDatas();
  },
};
</script>
