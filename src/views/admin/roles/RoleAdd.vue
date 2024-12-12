<template>
    <div class="container mt-5">
      <h2>Add New Role</h2>
  
      <!-- Form untuk menambahkan role -->
      <form @submit.prevent="addRole">
        <div class="mb-3">
          <label for="roleName" class="form-label">Role Name</label>
          <input
            type="text"
            id="roleName"
            v-model="roleName"
            class="form-control"
            placeholder="Enter role name"
            required
          />
        </div>
  
        <div class="mb-3">
          <label class="form-label">Permissions</label>
          <div class="row">
            <div class="col-md-4" v-for="(permission, index) in permissions" :key="index">

              <div class="form-check">
                <input
                  type="checkbox"
                  :id="'permission-' + permission.id"
                  :value="permission.id"
                  v-model="selectedPermissions"
                  class="form-check-input"
                />
                <label :for="'permission-' + permission.id" class="form-check-label text-start">
                  {{ permission.name }}
                </label>
              </div>
            </div>
          </div>
        </div>
  
        <button type="submit" class="btn btn-primary">
          <i class="bi bi-save"></i> Save Role
        </button>
        <button type="button" class="btn btn-secondary" @click="goBack">
          <i class="bi bi-arrow-left"></i> Back
        </button>
      </form>
  
      <!-- Pesan status -->
      <div v-if="message" :class="messageClass" class="mt-3">
        {{ message }}
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        roleName: "", 
        permissions: [], 
        selectedPermissions: [], 
        message: null, 
        messageClass: null, 
      };
    },
    methods: {
      async fetchPermissions() {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            alert("You are not authenticated. Please log in.");
            this.$router.push("/login");
            return;
          }
  
          const response = await axios.get("http://127.0.0.1:8000/api/roles", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          const allPermissions = [];
          response.data.forEach((role) => {
            if (role.permissions && Array.isArray(role.permissions)) {
              role.permissions.forEach((permission) => {
                if (!allPermissions.some((perm) => perm.id === permission.id)) {
                  allPermissions.push(permission);
                }
              });
            }
          });
  
          this.permissions = allPermissions; 
        } catch (error) {
          console.error("Error fetching permissions:", error);
          this.message = error.response?.data?.message || "Failed to fetch permissions.";
          this.messageClass = "text-danger";
        }
      },

      async addRole() {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            alert("You are not authenticated. Please log in.");
            this.$router.push("/login");
            return;
          }
  
          const payload = {
            name: this.roleName,
            permissions: this.selectedPermissions,
          };
  
          const response = await axios.post("http://127.0.0.1:8000/api/roles", payload, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
  
          this.message = response.data.message || "Role created successfully!";
          this.messageClass = "text-success";
  
          this.roleName = "";
          this.selectedPermissions = [];
        } catch (error) {
          console.error("Error creating role:", error);
          this.message = error.response?.data?.message || "Failed to create role.";
          this.messageClass = "text-danger";
        }
      },
  
      goBack() {
        this.$router.push("/role-view"); 
      },
    },
    mounted() {
      this.fetchPermissions(); 
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
  }
  
  .form-check-label {
    text-align: left !important; 
  }
  
  .row {
    margin-bottom: 10px; 
  }
  
  .message {
    font-weight: bold;
  }
  </style>
  