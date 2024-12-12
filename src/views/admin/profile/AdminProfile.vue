<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <!-- Profile Card -->
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <!-- User Photo -->
            <div class="mb-4">
              <img 
                :src="user.foto ? fullImagePath(user.foto) : 'https://via.placeholder.com/150'" 
                alt="Profile Picture" 
                class="rounded-circle" 
                width="150"
                height="150"
              />
            </div>
            <!-- User Data -->
            <h3 class="card-title">{{ user.nama }}</h3>
            <p class="card-text">{{ user.email }}</p>
            <p class="card-text">
              <strong>Status:</strong> 
              <span :class="user.is_verified ? 'text-success' : 'text-danger'">
                {{ user.is_verified ? 'Verified' : 'Not Verified' }}
              </span>
            </p>
            <!-- <p class="card-text">
              <strong>Role:</strong> {{ user.role }}
            </p> -->
            <p class="card-text">
              <strong>Phone:</strong> {{ user.no_tlp || 'Not provided' }}
            </p>
            <p class="card-text">
              <small class="text-muted">Member since: {{ formattedCreatedAt }}</small>
            </p>
            <!-- Action Buttons -->
            <div class="d-flex justify-content-between mt-4">
              <button class="btn btn-success" @click="editProfile">Edit Profile</button>
              <button class="btn btn-secondary" @click="goBack">Back</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminProfile',
  data() {
    return {
      user: {
        user_id: '',
        nama: '',
        email: '',
        no_tlp: null,
        is_verified: 0,
        status: 0,
        foto: null,
        created_at: '',
        updated_at: '',
        deleted_at: null,
      },
    };
  },
  computed: {
    formattedCreatedAt() {
      const date = new Date(this.user.created_at);
      return date.toLocaleDateString();
    },
  },
  created() {
    this.getUserProfile();
  },
  methods: {
    async getUserProfile() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.user = response.data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        alert('Failed to load profile data.');
      }
    },
    fullImagePath(foto) {
      // Tambahkan base URL backend untuk memastikan path foto benar
      return `http://127.0.0.1:8000/${foto}`;
    },
    editProfile() {
      this.$router.push('/profile-admin-edit');
    },
    goBack() {
      this.$router.push('/admin/dashboard-admin');
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 10px;
}

.card-body {
  padding: 2rem;
}

button {
  width: 45%;
}
</style>
