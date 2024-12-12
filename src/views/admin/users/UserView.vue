<template>
  <div class="container">
    <!-- Tombol Tambah User -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>User List</h4>
      <button
        class="btn btn-sm btn-success shadow-sm"
        @click="addNewUser"
      >
        <i class="fas fa-plus fa-sm text-white-50"></i> Add New User
      </button>
    </div>

    <!-- Tabel -->
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-success">Table Users</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-bordered table-striped">
        <thead class="bg-success text-white">
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Telephone</th>
            <th>Photo</th>
            <th>Verified</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.user_id">
            <td class="text-truncate" style="max-width: 150px;">{{ user.user_id }}</td>
            <td class="text-truncate" style="max-width: 150px;">{{ user.nama }}</td>
            <td class="text-truncate" style="max-width: 150px;">{{ user.email }}</td>
            <td class="text-truncate" style="max-width: 150px;">{{ user.no_tlp || 'N/A' }}</td>
            <td class="text-truncate" style="max-width: 150px;">
              <img :src="user.foto || 'https://via.placeholder.com/50'" alt="User Photo" class="user-photo" />
            </td>
            <td class="text-truncate" style="max-width: 150px;">
              <span :class="user.is_verified ? 'badge bg-success text-white' : 'badge bg-danger text-white'">
                {{ user.is_verified ? 'Verified' : 'Not Verified' }}
              </span>
            </td>
            <td class="text-truncate" style="max-width: 150px;">
              <span v-for="(role, index) in user.roles" :key="index">
                {{ role.name }}
                <br v-if="index !== user.roles.length - 1">
              </span>
            </td>
            <td>
              <button @click="viewUser(user.user_id)" class="btn btn-info btn-sm mr-1"><i class="bi bi-eye-fill"></i></button>
              <button @click="editUser(user.user_id)" class="btn btn-warning btn-sm mr-1"><i class="bi bi-pencil-fill"></i></button>
              <button @click="deleteUser(user.user_id)" class="btn btn-danger btn-sm mr-1"><i class="bi bi-trash-fill"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination-controls btn-group">
    <button 
      @click="changePage(currentPage - 1)" 
      :disabled="currentPage === 1" 
      class="btn btn-success btn-sm">
      Previous
    </button>
    
    <button
      v-for="page in totalPages"
      :key="page"
      @click="changePage(page)"
      :class="{'btn btn-success btn-sm': page === currentPage, 'btn-outline-success btn-sm': page !== currentPage}"
      class="btn">
      {{ page }}
    </button>
    
    <button 
      @click="changePage(currentPage + 1)" 
      :disabled="currentPage === totalPages" 
      class="btn btn-success btn-sm">
      Next
    </button>
  </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "UserView",
  data() {
    return {
      users: [],
      currentPage: 1,
      totalPages: 1,
      searchQuery: "", // Tambahkan ini untuk input pencarian
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("No token found. Please log in.");
          return;
        }

        const response = await fetch(`http://127.0.0.1:8000/api/users?page=${this.currentPage}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        if (data && data.data && Array.isArray(data.data.data)) {
          this.users = data.data.data;
          this.currentPage = data.data.current_page;
          this.totalPages = data.data.last_page;
        } else {
          console.error("Unexpected data format received from the API.");
          alert("Unexpected data format received from the API.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Error fetching users.");
      }
    },

    async searchUsers() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("No token found. Please log in.");
          return;
        }

        const response = await fetch(`http://127.0.0.1:8000/api/users-search`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ name: this.searchQuery })
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        if (data && data.data) {
          this.users = data.data.data;
          this.currentPage = data.data.current_page;
          this.totalPages = data.data.last_page;
        } else {
          console.error("Unexpected data format received from the API.");
          alert("Unexpected data format received from the API.");
        }
      } catch (error) {
        console.error("Error searching users:", error);
        alert("Error searching users.");
      }
    },

    changePage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      this.fetchUsers();
    },

    viewUser(userId) {
      this.$router.push({ name: "user-detail", params: { id: userId } });
    },

    editUser(userId) {
      this.$router.push({ name: "user-edit", params: { id: userId } });
    },

    deleteUser(userId) {
      const confirmDelete = confirm("Are you sure you want to delete this user?");
      
      if (confirmDelete) {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("No token found. Please log in.");
          return;
        }

        fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              alert("User deleted successfully!");
              this.fetchUsers();
            } else {
              alert("Failed to delete user: " + data.message);
            }
          })
          .catch(error => {
            console.error("Error deleting user:", error);
            alert("Error deleting user.");
          });
      }
    },

    addNewUser() {
      this.$router.push({ name: "user-add" });
    }
  }
};
</script>


<style scoped>
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
