<template>
  <NavbarKasir :cartItemCount="cartItemCount" />
  <div
      v-if="errorMessage"
      class="alert alert-danger alert-dismissible fade show mt-5"
      role="alert"
    >
      {{ errorMessage }}
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
        @click="dismissError"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

  <div class="profile-edit">
    <h1 class="mb-4">Edit Profile</h1>
    <form @submit.prevent="updateProfile">
      <div class="mb-3">
        <label for="nama" class="form-label">Name</label>
        <input
          type="text"
          id="nama"
          v-model="user.nama"
          class="form-control"
          placeholder="Enter your name"
          required
        />
      </div>

      <div class="mb-3">
        <label for="no_tlp" class="form-label">Phone Number</label>
        <input
          type="text"
          id="no_tlp"
          v-model="user.no_tlp"
          class="form-control"
          placeholder="Enter your phone number"
          required
        />
      </div>

      <div class="mb-3">
        <label for="foto" class="form-label">Profile Picture</label>
        <input
          type="file"
          class="form-control"
          id="foto"
          @change="handleFileUpload"
        />
        <small class="form-text text-muted">Max file size 2MB</small>
        <img v-if="imagePreview" :src="imagePreview" alt="Image Preview" class="mt-3 img-thumbnail" width="150" />
      </div>

      <div class="d-flex justify-content-end">
        <button type="button" class="btn btn-secondary me-3" @click="cancel">Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>

    <div v-if="message" :class="messageClass">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarKasir from "@/components/NavbarKasir.vue";

export default {
  components: {
    NavbarKasir,
  },
  name: "KasirProfileEdit",
  data() {
    return {
      user: {
        nama: '',
        no_tlp: '',
        foto: null,
      },
      message: null,
      messageClass: "",
      errorMessage: "",
      selectedFile: null,
      imagePreview: null, 
    };
  },
  created() {
    this.fetchUserProfile();
  },
  methods: {
    async fetchUserProfile() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.message = 'You are not authenticated. Please log in.';
          this.messageClass = 'error';
          this.$router.push('/login');
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          this.user = response.data; 
          if (this.user.foto) {
            this.imagePreview = `http://127.0.0.1:8000/${this.user.foto}`; 
          }
        }
      } catch (error) {
        // Tangani error dari API
        console.error("Error fetching user profile:", error);
        this.errorMessage =
          error.response?.data?.message ||
          "An error occurred while fetching user data.";
      }
    },

    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.imagePreview = URL.createObjectURL(this.selectedFile);
      }
    },

    async updateProfile() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      this.message = "You are not authenticated. Please log in.";
      this.messageClass = "error";
      this.$router.push("/login");
      return;
    }

    const formData = new FormData();
    formData.append('_method', 'PUT'); // Menambahkan _method dengan nilai PUT
    formData.append('nama', this.user.nama || '');
    formData.append('no_tlp', this.user.no_tlp || '');
    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }

    const response = await axios.post( // Menggunakan POST untuk override method PUT
      'http://127.0.0.1:8000/api/profile',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      this.message = 'Profile updated successfully!';
      this.messageClass = 'success';
      this.user = response.data.user;

      if (this.user.foto) {
        this.user.fotoUrl = `http://127.0.0.1:8000/${this.user.foto}`;
      }

      this.$router.push("/profile-kasir");
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    this.message = error.response?.data?.message || "Failed to update profile.";
    this.messageClass = 'error';
  }
},

    cancel() {
      this.$router.push("/profile-kasir");
    },
  },
};
</script>

<style scoped>
.profile-edit {
  padding: 20px;
  max-width: 600px;
  margin: auto;
}

h1 {
  text-align: center;
}

.form-label {
  font-weight: bold;
}

button {
  min-width: 100px;
}

.error {
  color: red;
}

.success {
  color: green;
}
</style>
