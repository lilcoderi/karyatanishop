<template>
  <div class="container">
    <div class="row">
      <!-- Left Section -->
      <div class="col-md-6 d-none d-lg-flex align-items-center justify-content-center">
        <div class="text-center">
          <img src="/img/code_otp.png" alt="Illustration" class="illustration mb-4">
        </div>
      </div>

      <!-- Right Section -->
      <div class="col-md-5 d-flex align-items-center justify-content-center">
        <div class="login-card">
          <h4 class="text-center">Reset Password</h4>
          <form @submit.prevent="handlePasswordReset">
            <div class="mb-3">
              <label for="email" class="form-label">Your Email</label>
              <input 
              type="email"
              id="email"
              class="form-control"
              v-model="email"
              readonly
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">New Password</label>
              <input type="password"
              id="password"
              class="form-control"
              v-model="password"
              placeholder="Enter your new password"
              minlength="8"
              required
              />
            </div>
            <div class="mb-3">
              <label for="password_confirmation" class="form-label">Confirm Password</label>
              <input type="password"
              id="password_confirmation"
              class="form-control"
              v-model="passwordConfirmation"
              placeholder="Confirm your new password"
              required
              />
            </div>
            
            <div class="d-flex align-items-center justify-content-center">
              <button 
            type="submit" 
            class="btn btn-success w-50 mt-4" 
            :disabled="isLoading"
            >
            {{ isLoading ? "Resetting Password..." : "Reset Password" }}
          </button>
            </div>
            
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "", // Email diambil dari localStorage
      password: "",
      passwordConfirmation: "",
      isLoading: false,
      errorMessage: null,
      successMessage: null,
    };
  },
  created() {
    // Ambil email dari localStorage yang sudah disimpan sebelumnya
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      this.email = storedEmail;
    } else {
      this.$router.push("/forgot-password"); // Jika tidak ada email, redirect ke halaman forgot password
    }
  },
  methods: {
    async handlePasswordReset() {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/reset-password",
          {
            email: this.email,
            password: this.password,
            password_confirmation: this.passwordConfirmation, // Pastikan konfirmasi password sama
          }
        );

        // Tampilkan pesan sukses
        this.successMessage = response.data.message;

        // Reset field password setelah sukses
        this.password = "";
        this.passwordConfirmation = "";

        // Redirect atau tampilkan pesan berhasil
        this.$router.push("/login"); // Misalnya, arahkan kembali ke halaman login setelah reset password
      } catch (error) {
        // Tampilkan pesan error
        this.errorMessage =
          error.response?.data?.error || "Failed to reset password. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Kontainer utama */
.container {
      font-family: "Nunito";
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ffffff;
    }

    /* Ilustrasi pada kolom kiri */
    .illustration {
      max-width: 100%;
      height: auto;
    }

    /* Kartu login */
    .login-card {
      max-width: 400px;
      width: 100%;
      padding: 2rem;
      border-radius: 8px;
      background-color: #ffffff;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    }

    /* Teks brand */
    .brand-title {
      color: #4CAF50;
    }

    /* Untuk layar kecil (mobile) */
    @media (max-width: 551px) {
      .login-container {
        padding: 1rem; /* Tambahkan padding agar ada ruang */
      }

      .login-card {
        padding: 1.5rem; /* Sesuaikan padding di layar kecil */
      }
    }

    .textp{
      font-size: 13px;
    }
    form{
      text-align: start;
    }
</style>
