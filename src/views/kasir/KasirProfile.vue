<template>
  <NavbarKasir :cartItemCount="cartItemCount" />

  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-lg-5 mb-4">
          <div class="card">
            <div class="card-header bg-info text-white">
              <h5 class="mb-0">My Profile</h5>
            </div>
            <div class="card-body">
              <div class="mb-4">
              <img 
                :src="user.foto || 'https://via.placeholder.com/150'" 
                alt="Profile Picture" 
                class="rounded-circle" 
                width="150"
                height="150"
              />
            </div>
            <h4 class="card-title">{{ user.nama }}</h4>
            <p class="card-text">
              <strong>Email : </strong>{{ user.email }}</p>
            <p class="card-text">
              <strong>Phone : </strong> {{ user.no_tlp || 'Not provided' }}
            </p>
            <p class="card-text">
              <strong>Status : </strong> 
              <span :class="user.is_verified ? 'text-white badge badge-success' : 'text-danger'">
                {{ user.is_verified ? 'Verified' : 'Not Verified' }}
              </span>
            </p>
            
            <p class="card-text">
              <small class="text-muted">Member since: {{ formattedCreatedAt }}</small>
            </p>
            <div class="btn-group d-flex mt-4">
              <button class="btn btn-info" @click="editProfile">Edit Profile</button>
              <button class="btn btn-danger" @click="goBack">Back</button>
            </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import NavbarKasir from "@/components/NavbarKasir.vue";
import axios from "axios";

export default {
  components: {
    NavbarKasir,
  },
  name: "KasirProfile",
  data() {
    return {
      user: {
        user_id: "",
        nama: "",
        email: "",
        no_tlp: null,
        is_verified: 0,
        status: 0,
        foto: null,
        created_at: "",
        updated_at: "",
        deleted_at: null,
      },
    };
  },
  computed: {
    formattedCreatedAt() {
      if (!this.user.created_at) return "N/A";
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
        const response = await axios.get("http://127.0.0.1:8000/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("User profile data fetched:", response.data);
        this.user = response.data;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        alert("Failed to load profile data.");
      }
    },
    getProfileImageUrl(foto) {
      return `http://127.0.0.1:8000/${foto}`;
    },
    editProfile() {
      this.$router.push("/profile-kasir-edit");
    },
    goBack() {
      this.$router.push("/kasir-view");
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
