<template>
  <div class="container">
    <!-- Alert untuk pesan error -->
    <div
      v-if="errorMessage"
      class="alert alert-danger alert-dismissible fade show"
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

    <h2>Role Details</h2>

    <!-- Menampilkan detail role -->
    <div v-if="role.id" class="card">
      <div class="card-header">
        <h3>{{ role.name }} (ID: {{ role.id }})</h3>
      </div>
      <div class="card-body">
        <p><strong>Guard Name:</strong> {{ role.guard_name }}</p>
        <p><strong>Created At:</strong> {{ role.created_at }}</p>
        <p><strong>Updated At:</strong> {{ role.updated_at }}</p>

        <h5>Permissions:</h5>
        <ul>
          <li v-for="permission in role.permissions" :key="permission.id">
            {{ permission.name }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Tombol Kembali -->
    <div class="mt-3">
      <button class="btn btn-secondary" @click="goBack">Go Back</button>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  data() {
    return {
      role: {
        id: null,
        name: "",
        guard_name: "",
        created_at: "",
        updated_at: "",
        permissions: [],
      },
      errorMessage: "", // Menyimpan pesan error
    };
  },
  methods: {
    async fetchRoleDetails() {
      try {
        const roleId = this.$route.params.id; // ID role dari parameter URL
        const token = localStorage.getItem("token");

        if (!token) {
          this.errorMessage = "You are not authenticated. Please log in.";
          this.$router.push("/login");
          return;
        }

        // Panggil API untuk mendapatkan detail role
        const response = await axios.get(
          `http://127.0.0.1:8000/api/roles/${roleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Simpan data role ke dalam state
        this.role = response.data.data;
      } catch (error) {
        // Tangani error dari API
        console.error("Error fetching role details:", error);
        this.errorMessage =
          error.response?.data?.message ||
          "Failed to fetch role details. Please try again.";
      }
    },
    dismissError() {
      this.errorMessage = ""; // Hapus pesan error
    },
    goBack() {
      this.$router.push("/role-view"); // Navigasi kembali ke halaman daftar role
    },
  },
  mounted() {
    this.fetchRoleDetails(); // Panggil data ketika komponen di-mount
  },
};
</script>


<style scoped>
.container {
  max-width: 800px;
}

.card {
  margin-top: 20px;
}

.card-header {
  background-color: #f8f9fa;
}

.card-body {
  padding: 20px;
}

.btn-secondary {
  margin-top: 20px;
}
</style>

