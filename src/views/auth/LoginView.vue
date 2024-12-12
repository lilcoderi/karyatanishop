<template>
  <div class="container">
    <div class="row">
      <!-- Left Section -->
      <div class="col-md-6 d-none d-lg-flex align-items-center justify-content-center">
        <div class="text-center">
          <img src="/img/logo_login_.png" alt="Illustration" class="illustration mb-4">
          <h5 class="fw-bold">Quality You Can Trust</h5>
          <p>Enhance your shopping experience with our best products</p>
        </div>
      </div>

      <!-- Right Section -->
      <div class="col-md-5 d-flex align-items-center justify-content-center">
        <div class="login-card">
          <h4 class="text-center">Welcome to <span class="brand-title">Karya Tani Shop</span></h4>
          <p class="textp text-center mb-4 font-weight-bold">Sign in to manage your orders and explore our store</p>
          <form @submit.prevent="handleLogin">
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
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password"
              id="password"
              class="form-control"
              v-model="password"
              placeholder="Enter your password"
              required
              />
            </div>
            <div class="d-flex align-items-center justify-content-end mb-4">
              <router-link to="/forgot-password" class="text-success text-decoration-none">
              <small>Forgot Password?</small>
              </router-link>
            </div>
            <div class="d-flex align-items-center justify-content-center">
              <button 
            type="submit" 
            class="btn btn-success w-50" 
            :disabled="isLoading"
            >
            {{ isLoading ? "Logging in..." : "Login" }}
          </button>
            </div>
            <div class="text-center mt-4">
              <small class="mb-0">Don't have an account?
                <router-link to="/register" class="text-success text-decoration-none">
                Register
                </router-link>
              </small>
            </div>
            <div
              v-if="errorMessage"
              class="alert alert-danger mt-3"
              role="alert"
              >
              {{ errorMessage }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async handleLogin() {
      try {

        const response = await axios.post('http://127.0.0.1:8000/api/auth/login', {
          email: this.email,
          password: this.password,
        });

        localStorage.setItem('token', response.data.token);

        console.log('User Info:', response.data.user);

        this.$router.push('/home');
      } catch (error) {
        if (error.response) {
          alert(error.response.data.error);
        } else {
          alert('An error occurred. Please try again later.');
        }
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
