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

      <h2>Edit Role</h2>
      <form @submit.prevent="updateRole">
        <div class="mb-3">
          <label for="name" class="form-label">Role Name</label>
          <input
            type="text"
            id="name"
            v-model="role.name"
            class="form-control"
            required
          />
        </div>
  
        <div class="mb-3">
          <label for="permissions" class="form-label">Permissions</label>
          <div class="row">
            <div
              class="col-md-4"
              v-for="permission in permissions"
              :key="permission.id"
            >
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="`permission-${permission.id}`"
                  :value="permission.id"
                  v-model="selectedPermissions"
                />
                <label
                  class="form-check-label"
                  :for="`permission-${permission.id}`"
                >
                  {{ permission.name }}
                </label>
              </div>
            </div>
          </div>
        </div>
  
        <div class="mb-3">
          <button type="submit" class="btn btn-primary">Save Changes</button>
          <button type="button" class="btn btn-secondary" @click="goBack">
            Cancel
          </button>
        </div>
      </form>
  
      <!-- Pesan status -->
      <div v-if="message" :class="messageClass">{{ message }}</div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        role: {
          name: "",
          permissions: [],
        },
        permissions: [], 
        selectedPermissions: [], 
        message: null,
        messageClass: null,
        errorMessage: "",
      };
    },
    methods: {
      async fetchRole() {
        try {
          const roleId = this.$route.params.id; 
          const token = localStorage.getItem("token");
          if (!token) {
            alert("You are not authenticated. Please log in.");
            this.$router.push("/login");
            return;
          }
  
          const response = await axios.get(
            `http://127.0.0.1:8000/api/roles/${roleId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
  
          const data = response.data.data; 
          console.log(data); 

          this.role = {
            name: data.name || "",
            permissions: data.permissions.map((perm) => perm.id),
          };
  
          this.permissions = data.permissions || [];
  
          this.selectedPermissions = this.role.permissions;
        } catch (error) {
          console.error("Error fetching role details:", error);
        this.errorMessage =
          error.response?.data?.message ||
          "Failed to fetch role details. Please try again.";
        }
      },
  
      async updateRole() {
        try {
          const roleId = this.$route.params.id; 
          const token = localStorage.getItem("token");
          if (!token) {
            alert("You are not authenticated. Please log in.");
            this.$router.push("/login");
            return;
          }
  
          const payload = {
            name: this.role.name,
            permissions: this.selectedPermissions,
          };
  
          const response = await axios.put(
            `http://127.0.0.1:8000/api/roles/${roleId}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
  
          this.message = response.data.message || "Role updated successfully.";
          this.messageClass = "success";
          this.$router.push("/role-view"); // Redirect ke halaman daftar role
        } catch (error) {
          console.error("Error updating role:", error);
          this.message =
            error.response?.data?.message || "Failed to update role.";
          this.messageClass = "error";
        }
      },
  
      goBack() {
        this.$router.push("/role-view");
      },
    },
    mounted() {
      this.fetchRole(); 
    },
  };
  </script>
  
  <style scoped>
  .message {
    margin-top: 20px;
  }
  
  .success {
    color: green;
  }
  
  .error {
    color: red;
  }
  </style>
  