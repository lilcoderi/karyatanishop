<template>
  <div class="user-detail">
    <h1>User Detail</h1>

    <button @click="goBack" class="btn btn-secondary mb-3">Back</button>

    <div v-if="isLoading" class="text-center">
      <p>Loading user details...</p>
    </div>

    <div v-if="message" :class="messageClass">
      <p>{{ message }}</p>
    </div>

    <div v-if="user">
      <div class="card">
        <div class="card-header">
          <h2>{{ user.nama }}</h2>
        </div>
        <div class="card-body">
          <ul class="list-group">
            <li class="list-group-item">
              <strong>User ID:</strong> {{ user.user_id }}
            </li>
            <li class="list-group-item">
              <strong>Email:</strong> {{ user.email }}
            </li>
            <li class="list-group-item">
              <strong>Phone:</strong> {{ user.no_tlp || "Not provided" }}
            </li>
            <li class="list-group-item">
              <strong>Status:</strong> {{ user.status ? "Active" : "Inactive" }}
            </li>
            <li class="list-group-item">
              <strong>Verified:</strong> {{ user.is_verified ? "Yes" : "No" }}
            </li>
            <li class="list-group-item">
              <strong>Role:</strong> {{ user.role || "Not assigned" }}
            </li>
            <li class="list-group-item">
              <strong>Roles:</strong>
              <ul>
                <li v-for="role in user.roles" :key="role.id">
                  {{ role.name }}
                </li>
              </ul>
            </li>
            <li class="list-group-item">
              <strong>Created At:</strong> {{ formatDate(user.created_at) }}
            </li>
            <li class="list-group-item">
              <strong>Updated At:</strong> {{ formatDate(user.updated_at) }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-else class="text-center">
      <p>User not found.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserDetail",
  data() {
    return {
      user: null, 
      isLoading: true, 
      message: null, 
      messageClass: "", 
    };
  },
  methods: {
    async fetchUser() {
      const userId = this.$route.params.id; 
      const token = localStorage.getItem("token"); 

      if (!token) {
        this.message = "You are not authenticated. Please log in.";
        this.messageClass = "error";
        this.$router.push("/login"); 
        return;
      }

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.data && response.data.data) {
          const data = response.data.data; 
          this.user = {
            user_id: data.user_id || "",
            nama: data.nama || "",
            email: data.email || "",
            no_tlp: data.no_tlp || "Not provided",
            is_verified: data.is_verified,
            status: data.status,
            role: data.role || "Not assigned",
            roles: data.roles || [],
            created_at: data.created_at || "",
            updated_at: data.updated_at || "",
          };
        } else {
          throw new Error("User not found.");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        this.message = error.response?.data?.message || "An error occurred.";
        this.messageClass = "error";
      } finally {
        this.isLoading = false; 
      }
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    },

    goBack() {
      this.$router.push("/user-view");
    },
  },
  mounted() {
    this.fetchUser(); 
  },
};
</script>
