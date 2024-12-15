<template>
  <div class="user-edit">
    <h3 class="mb-4">Edit User</h3>

    <!-- Display loading or error messages if needed -->
    <div v-if="message" :class="messageClass" class="alert">
      {{ message }}
    </div>

    <form @submit.prevent="submitForm">
      <!-- Name -->
      <div class="mb-3">
        <label for="name" class="form-label">Name</label>
        <input
          type="text"
          class="form-control"
          id="name"
          v-model="user.name"
          required
        />
      </div>

      <!-- Email -->
      <div class="mb-3">
        <label for="email" class="form-label">Email</label>
        <input
          type="email"
          class="form-control"
          id="email"
          v-model="user.email"
          required
        />
      </div>

      <!-- Password (optional) -->
      <!-- <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          type="password"
          class="form-control"
          id="password"
          v-model="user.password"
        />
      </div> -->

      <!-- Roles (checkbox) -->
      <div class="mb-3">
        <label class="form-label">Roles</label><br />
        <div v-for="role in roles" :key="role.id" class="form-check">
          <input
            type="checkbox"
            class="form-check-input"
            :id="'role-' + role.id"
            :value="role.id"
            v-model="user.roles"
          />
          <label :for="'role-' + role.id" class="form-check-label">{{ role.name }}</label>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="d-flex justify-content-between">
        <button type="submit" class="btn btn-primary">Update User</button>
        <button type="button" @click="cancel" class="btn btn-secondary">Cancel</button>
      </div>
    </form>
  </div>
</template>

  
  <script>
import axios from 'axios'; 

export default {
  name: "UserEdit",
  data() {
    return {
      user: {
        user_id: "", 
        name: "",
        email: "",
        password: "",
        roles: [], 
      },
      roles: [], 
    };
  },
  created() {
    this.fetchRoles(); 
    this.fetchUserDetails(); 
  },
  methods: {
    async fetchUserDetails() {
  const userId = this.$route.params.id; 
  const token = localStorage.getItem("token"); 

  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data && response.data.data) {
      const data = response.data.data; 

      const roles = Array.isArray(data.roles) ? data.roles.map(role => role.id) : [];

      this.user = {
        user_id: data.user_id || "", 
        name: data.nama || "", 
        email: data.email || "", 
        password: "", 
        roles: roles, 
      };

      console.log("User details fetched:", this.user); 
    } else {
      console.error("Error: Data not available in response.");
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
},

    async fetchRoles() {
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/roles", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (Array.isArray(response.data)) {
          this.roles = response.data; 
        } else {
          console.error("Error: Roles data not available.");
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    },

    async submitForm() {
  // Validasi frontend
  if (!this.user.name || !this.user.email || !Array.isArray(this.user.roles)) {
    alert("Harap isi semua data yang diperlukan.");
    return;
  }

  // Siapkan data
  const userData = {
    nama: this.user.name,
    email: this.user.email,
    password: this.user.password.trim() || undefined, // Hanya kirim password jika diisi
    roles: this.user.roles,
  };

  console.log("Data yang dikirim:", userData); // Debug

  const token = localStorage.getItem("token");

  if (!token) {
    alert("No token found. Please log in.");
    return;
  }

  try {
    const response = await axios.put(
      `http://127.0.0.1:8000/api/users/${this.user.user_id}`,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      alert("User updated successfully!");
      this.$router.push({ name: "user-view" });
    } else {
      alert("Failed to update user: " + response.data.error);
    }
  } catch (error) {
    if (error.response && error.response.status === 422) {
      console.error("Validation error:", error.response.data.errors);
      alert(
        `Validation Error: ${JSON.stringify(error.response.data.errors)}`
      );
    } else {
      console.error("Error updating user:", error);
      alert("Error updating user.");
    }
  }
},


    cancel() {
      this.$router.push({ name: "user-view" }); 
    },
  },
};
</script>
