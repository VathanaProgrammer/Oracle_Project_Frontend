<template>
  <div class="min-h-screen  flex items-center justify-center bg-[#f5f3f4]">
    <form
      @submit.prevent="handleSubmit"
      class="w-full max-w-md h-[650px] bg-white p-12 rounded-xl shadow-lg mx-2 space-y-6"
    >
      <header class="text-center">
        <h2
          class="flex items-center justify-center text-3xl font-bold text-gray-800 mb-2 space-x-2"
        >
          <EduIcon class="h-9 w-9 me-1 text-gray-700" />
          <span class="text-gray-600">Smart Examination</span>
        </h2>

        <p class="text-gray-600 text-start font-[500] pt-3 text-2xl">
          Welcome to Smart Examination !
        </p>
        <p class="text-gray-500 text-md text-start pt-1 font-normal">
          Please sign in to your account and start learning.
        </p>
      </header>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1"
          >Email</label
        >
        <input
          type="email"
          v-model="email"
          id="email"
          placeholder="you@example.com"
          class="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-gray-800 focus:outline-none"
        />
        <p v-if="error.email" class="text-red-500 text-xs mt-1">
          {{ error.email }}
        </p>
      </div>

      <div>
        <label
          for="password"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Password</label
        >
        <input
          type="password"
          v-model="password"
          id="password"
          placeholder="••••••••"
          class="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-gray-800 focus:outline-none"
        />
        <p v-if="error.password" class="text-red-500 text-xs mt-1">
          {{ error.password }}
        </p>
      </div>
      <div class="flex items-center justify-between text-sm">
        <label class="flex items-center space-x-2 text-gray-600">
          <input
            type="checkbox"
            v-model="rememberMe"
            class="accent-gray-800 w-4 h-4 rounded border-gray-300 focus:shadow-md"
          />
          <span>Remember me</span>
        </label>

        <router-link
          to="/forgot-password"
          class="text-gray-600 hover:text-gray-800 hover:underline"
        >
          Forgot password?
        </router-link>
      </div>

      <button
        type="submit"
        class="w-full bg-gray-900 text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
      >
        Sign In
      </button>

      <p class="text-center text-xs text-gray-400 mt-4">
        &copy; 2025 Smart Online Examination
      </p>
    </form>
  </div>
</template>

<script>
import { API_BASE_URL } from "@/config/useWebSocket";
import axios from "axios";
import { useUserStore } from "@/store/store";
import EduIcon from "../icons/EduIcon.vue";

export default {
  components: { EduIcon },
  data() {
    return {
      rememberMe: false,
      email: "",
      password: "",
      error: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    validateEmail() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.email) {
        this.error.email = "Email is required";
      } else if (!emailPattern.test(this.email)) {
        this.error.email = "Invalid email format";
      } else {
        this.error.email = "";
      }
    },
    validatePassword() {
      if (!this.password) {
        this.error.password = "Password is required";
      } else if (this.password.length < 3) {
        this.error.password = "Password must be at least 6 characters";
      } else {
        this.error.password = "";
      }
    },
    async handleSubmit() {
      this.validateEmail();
      this.validatePassword();

      if (!this.error.email && !this.error.password) {
        try {
          const loginRes = await axios.post(
            API_BASE_URL + "/api/user/login",
            {
              email: this.email.trim(),
              password: this.password.trim(),
              rememberMe: this.rememberMe
            },
            {
              withCredentials: true,
            }
          );

          if (loginRes.data) {
            const userStore = useUserStore();
            const userRes = await axios.get(API_BASE_URL + "/api/user/me", {
              withCredentials: true,
            });

            userStore.setUser(userRes.data);
            console.log(userRes.data)

            const role = userRes.data.role;
            if (role === "ADMIN") {
              this.$router.push("/admin-dashboard");
            } else if (role === "TEACHER") {
              this.$router.push("/teacher-dashboard");
            } else if (role === "STUDENT") {
              this.$router.push("/student-dashboard");
            } else {
              console.error("Unknown role:", role);
            }
          }
        } catch (err) {
          console.error("Login error:", err.response?.data || err.message);
        }
      }
    },
  },
};
</script>
