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

      <h2>Add Permissions to Role</h2>
    
      <!-- Form untuk menambah permissions -->
      <form @submit.prevent="addPermissions">
        <div class="mb-3">
          <label for="roleName" class="form-label">Role Name</label>
          <input
            type="text"
            id="roleName"
            v-model="role.name"
            class="form-control"
            disabled
          />
        </div>
  
        <div class="mb-3">
          <label for="permissions" class="form-label">Available Permissions</label>
          <div class="row">
            <div
              class="col-md-4"
              v-for="permission in availablePermissions"
              :key="permission.id"
            >
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :id="`permission-${permission.id}`"
                  :value="permission.name"
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
          <button type="submit" class="btn btn-primary">Add Permissions</button>
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
      availablePermissions: [], 
      selectedPermissions: [], 
      message: null,
      messageClass: null,
      errorMessage: "",
    };
  },
  methods: {
    async fetchRoleAndPermissions() {
      try {
        const roleId = this.$route.params.id; 
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not authenticated. Please log in.");
          this.$router.push("/login");
          return;
        }

        const roleResponse = await axios.get(
          `http://127.0.0.1:8000/api/roles/${roleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.role = {
          name: roleResponse.data.name, 
          permissions: roleResponse.data.permissions, 
        };

        const permissionsResponse = await axios.get(
          "http://127.0.0.1:8000/api/permissions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.availablePermissions = permissionsResponse.data.data; 
      } catch (error) {
        // Tangani error dari API
        console.error("Error fetching role details:", error);
        this.errorMessage =
          error.response?.data?.message ||
          "Failed to fetch role details. Please try again.";
      }
    },

    async addPermissions() {
      try {
        const roleId = this.$route.params.id; 
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not authenticated. Please log in.");
          this.$router.push("/login");
          return;
        }

        const payload = {
          permissions: this.selectedPermissions,
        };

        const response = await axios.post(
          `http://127.0.0.1:8000/api/roles/${roleId}/add-permissions`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        this.message =
          response.data.message || "Permissions added successfully.";
        this.messageClass = "success";

        this.$router.push(`/roles/${roleId}`);
      } catch (error) {
        console.error("Error adding permissions:", error);
        this.message =
          error.response?.data?.message || "Failed to add permissions.";
        this.messageClass = "error";
      }
    },

    goBack() {
      this.$router.push("/role-view");
    },
  },
  mounted() {
    this.fetchRoleAndPermissions(); 
  },
};
</script>
