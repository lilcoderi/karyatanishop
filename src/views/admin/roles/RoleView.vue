<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>Role Management</h4>
      <button class="btn btn-sm btn-success shadow-sm" @click="addRole">
        <i class="fas fa-plus fa-sm text-white-50"></i> Add Role
      </button>
    </div>
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="table-order m-0 font-weight-bold text-success">
          Table Role
        </h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-bordered">
            <thead class="bg-success text-white">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="role in roles" :key="role.id">
                <td>{{ role.id }}</td>
                <td>{{ role.name }}</td>
                <td>
                  <button class="btn btn-info btn-sm" @click="viewRole(role.id)">
                    <i class="fa fa-eye" aria-hidden="true"></i>
                  </button>

                  <button class="btn btn-warning btn-sm" @click="editRole(role.id)">
                    <i class="bi bi-pencil-square"></i>
                  </button>

                  <button class="btn btn-danger btn-sm" @click="deleteRole(role.id)">
                    <i class="bi bi-trash3-fill"></i>
                  </button>

                  <button class="btn btn-success btn-sm" @click="addPermissions(role.id)">
                    <i class="bi bi-filter-circle" title="Add Permissions"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- Pesan status -->
    <div v-if="message" :class="messageClass">{{ message }}</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      roles: [],
      message: null,
      messageClass: null,
    };
  },
  methods: {
    async fetchRoles() {
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
        this.roles = response.data;
      } catch (error) {
        console.error("Error fetching roles:", error);
        this.message = error.response?.data?.message || "Failed to fetch roles.";
        this.messageClass = "error";
      }
    },

    addRole() {
      this.$router.push("/role-add");
    },

    viewRole(roleId) {
      this.$router.push(`/role-detail/${roleId}`);
    },

    addPermissions(roleId) {
      this.$router.push(`/roles/${roleId}/add-permissions`);
    },

    editRole(roleId) {
      this.$router.push(`/role-edit/${roleId}`);
    },

    async deleteRole(roleId) {
      const confirmation = confirm("Are you sure you want to delete this role?");
      if (!confirmation) return;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You are not authenticated. Please log in.");
          this.$router.push("/login");
          return;
        }

        const response = await axios.delete(
          `http://127.0.0.1:8000/api/roles/${roleId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 || response.data?.status === "success") {
          this.message = "Role deleted successfully!";
          this.messageClass = "success";
          this.fetchRoles();
        } else {
          throw new Error(response.data.message || "Failed to delete role.");
        }
      } catch (error) {
        console.error("Error deleting role:", error);

        if (error.response?.status === 404) {
          this.message = "Role not found. It might have been already deleted.";
        } else {
          this.message = error.response?.data?.message || "Failed to delete role.";
        }
        this.messageClass = "error";
      }
    },
  },
  mounted() {
    this.fetchRoles();
  },
};
</script>

<style scoped>
button {
  margin-left: 10px;
  margin-bottom: 10px;
}
</style>