<template>
  <div class="h-screen w-screen flex items-center justify-center bg-gray-200">
    <form
      @submit.prevent="handleSubmit"
      class="w-[85%] h-[60%] xl:w-[75%] xl:h-[50%] lg:w-[90%] lg:h-[50%] shadow-lg flex bg-white"
    >
      <!-- left side: Image -->
      <div class="w-1/2 p-0 m-0 h-full hidden lg:block lg:w-1/2">
        <img
          src="../../assets/images/happy-asian-girl-college-student-graduation-cap-smiling-holding-books_928131-15 (1).avif"
          alt="Happy Student"
          class="object-cover w-full h-full"
        />
      </div>

      <!-- right side: Form inputs -->
      <div class="lg:w-1/2 p-6 flex flex-col justify-between w-full">
        <header class="mb-6">
          <h2 class="text-2xl font-bold">
            Welcome to smart online examination
          </h2>
          <p class="text-gray-600">Please enter your details to sign in</p>
        </header>

        <div class="mb-4">
          <label for="email" class="block text-lg font-semibold">Email</label>
          <input
            type="email"
            v-model="email"
            id="email"
            placeholder="you@example.com"
            class="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-gray-800 text-lg font-semibold placeholder:text-gray-500"
          />
          <span v-if="error.email" class="text-red-500 text-sm">{{
            error.email
          }}</span>
        </div>

        <div class="mb-4">
          <label for="password" class="block text-lg font-semibold"
            >Password</label
          >
          <input
            type="password"
            v-model="password"
            id="password"
            placeholder="••••••••"
            class="w-full p-2 border-b-2 border-gray-300 focus:outline-none focus:border-gray-800 text-lg font-semibold placeholder:text-gray-500"
          />
          <span v-if="error.password" class="text-red-500 text-sm">{{
            error.password
          }}</span>
        </div>

        <div class="mt-6">
          <button
            type="submit"
            class="w-full px-4 py-2 bg-gray-900 text-white font-semibold text-lg"
          >
            Sign In
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { API_BASE_URL } from "@/config/useWebSocket";
import axios from "axios";
import { useUserStore } from "@/store/store";
export default {
  data() {
    return {
      email: "",
      password: "",
      error: {
        email: "",
        password: "",
      },
      users: [
        {
          id: "FA921FFF",
          name: "John Doe",
          email: "JonhDoe@gmail.com",
          password: "123",
          role: "admin",
        },
        {
          id: "FDGD33F",
          name: "Hak Vuttey",
          email: "tey@gmail.com",
          password: "123",
          role: "student",
        },
        {
          id: "FDFD33F",
          name: "vathana",
          email: "vathana@gmail.com",
          password: "123",
          role: "admin",
        },
        {
          id: "FDFD33G",
          name: "bunthan",
          email: "bunthan@gmail.com",
          password: "123",
          role: "teacher",
        },
        {
          id: "FDGD33F",
          name: "Hak Vuttey",
          email: "tey@gmail.com",
          password: "123",
          role: "student",
        },
        {
          id: "FDGD33G",
          name: "Yann sreyvin",
          email: "vin@gmail.com",
          password: "123",
          role: "student",
        },
      ],
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
        this.error.password = "Password must be at least 6 characters long";
      } else {
        this.error.password = "";
      }
    },
     async handleSubmit() {
      this.validateEmail();
      this.validatePassword();

      if (!this.error.email.trim() && !this.error.password.trim()) {
        try {
          const loginRes = await axios.post(API_BASE_URL + '/api/user/login', {
            email: this.email,
            password: this.password,
          }, {
            withCredentials: true
          });

          if (loginRes.data) {
            const userStore = useUserStore(); // access the store
            const userRes = await axios.get(API_BASE_URL + '/api/user/me', {
              withCredentials: true
            });
            userStore.setUser(userRes.data); // save user to store
            console.log("User logged in:", userStore.user);
          }
        } catch (err) {
          console.error("Login error:", err.response?.data || err.message);
        }
      } else {
        console.log("Form has errors:", this.error);
      }
    },
  },
};
</script>
