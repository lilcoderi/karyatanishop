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
          <h4 class="text-center text-success mb-4">Verify OTP</h4>
          <form @submit.prevent="verifyOtp">
            <div class="mb-3">
              <input 
              type="text"
              id="otp"
              class="form-control"
              v-model="otp"
              placeholder="Enter 6-digit OTP"
              required
              />
            </div>
            <div class="d-flex align-items-center justify-content-center">
              <button 
            type="submit" 
            class="btn btn-success w-50" 
            :disabled="isLoading"
            >
            {{ isLoading ? "Verifying..." : "Verify OTP" }}
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
      otp: "",
      success: null,
      error: null,
    };
  },
  methods: {
    async verifyOtp() {
      const token = localStorage.getItem("token");

      if (!token) {
        this.error = "User not authenticated. Please login first.";
        return;
      }

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/verify-otp",
          { otp: this.otp },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.success = response.data.message;
        this.error = null;
        this.$router.push("/login");
      } catch (err) {
        this.error = err.response.data.error || "An error occurred.";
        this.success = null;
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