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
          <h4 class="text-center">Forgot Password</h4>
          <form @submit.prevent="handleOtpRequest">
            <div class="mb-3">
              <label for="email" class="form-label">Email address</label>
              <input 
              type="email"
              id="email"
              class="form-control"
              v-model="email"
              placeholder="Enter your email"
              required
              />
            </div>
            <div class="btn-group" role="group">
              <button 
            type="submit" 
            class="btn btn-success" 
            :disabled="isLoading"
            >
            {{ isLoading ? "Requesting OTP.." : "Request OTP" }}
          </button>
              <button type="button" class="btn btn-danger">
                <router-link to="/login" class="text-decoration-none text-white">Cancel</router-link>
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
      email: '',
      isLoading: false,
      errorMessage: null,
      successMessage: null,
    };
  },
  methods: {
    async handleOtpRequest() {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      try {
        const response = await axios.post("http://127.0.0.1:8000/api/auth/otp-request/forgot-password", {
          email: this.email
        });

        localStorage.setItem("email", this.email);

        this.successMessage = response.data.message;
        this.email = ''; 

        this.$router.push("/otp-forgot-password");
      } catch (error) {
        this.errorMessage = error.response?.data?.error || 'Failed to send OTP. Please try again.';
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
