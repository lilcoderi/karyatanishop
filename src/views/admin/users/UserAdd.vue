<template>
  <div class="container">
    <!-- Alert untuk pesan error -->
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

    <div class="card o-hidden border-0 shadow-lg">
      <div class="card-body p-0">
        <!-- Nested Row within Card Body -->
        <div>
          <div>
            <div class="p-5">
              <div class="text-center">
                <h1 class="h4 text-gray-900 mb-4">Add New User</h1>
              </div>
              <form class="user" @submit.prevent="submitForm">
                <div class="form-group row mb-5">
                  <div class="col-sm-4 mb-3 mb-sm-0">
                    <label for="name" class="form-label">Name</label>
                    <input
                      type="text"
                      class="form-control"
                      id="name"
                      v-model="user.name"
                      required
                    />
                  </div>

                  <div class="col-sm-4 mb-3 mb-sm-0">
                    <label for="email" class="form-label">Email</label>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      v-model="user.email"
                      required
                    />
                  </div>
                  <div class="col-sm-4 mb-3 mb-sm-0">
                    <label for="password" class="form-label">Password</label>
                    <input
                      type="password"
                      class="form-control"
                      id="password"
                      v-model="user.password"
                      required
                    />
                  </div>
                </div>
                <div class="form-group mb-5">
                  <!-- Label di tengah -->
                  <label class="form-label col-12 text-center"
                    >Roles</label
                  >

                  <!-- Loop untuk checkbox -->
                  <div
                    class="form-check form-check-inline"
                    v-for="role in roles"
                    :key="role.id"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :id="'role-' + role.id"
                      :value="role.name"
                      v-model="user.roles"
                    />
                    <label :for="'role-' + role.id" class="form-check-label text-capitalize">
                      {{ role.name }}
                    </label>
                  </div>
                </div>

                <div class="btn-group">
                  <button type="submit" class="btn btn-success btn">
                    Save
                  </button>
                  <button
                    type="submit"
                    class="btn btn-danger btn"
                    @click="cancel"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserAdd",
  data() {
    return {
      user: {
        name: "",
        email: "",
        password: "",
        roles: [],
      },
      roles: [],
      errorMessage: "",
    };
  },
  created() {
    this.fetchRoles();
  },
  methods: {
    fetchRoles() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      fetch("http://127.0.0.1:8000/api/roles", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            this.roles = data;
          } else {
            alert("Failed to fetch roles: Invalid data format.");
          }
        })
        .catch((error) => {
          console.error("Error fetching roles:", error);
          alert("Error fetching roles.");
        });
    },

    submitForm() {
      const userData = {
        nama: this.user.name,
        email: this.user.email,
        password: this.user.password.trim(),
        roles: this.user.roles,
      };

      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please log in.");
        return;
      }

      fetch("http://127.0.0.1:8000/api/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            alert("User created successfully!");
            this.$router.push({ name: "user-view" });
          } else {
            const errorMessage =
              typeof data.error === "object"
                ? JSON.stringify(data.error)
                : data.error;
            alert("Failed to create user: " + errorMessage);
          }
        })
        .catch((error) => {
          console.error("Error creating user:", error);
          alert("Error creating user.");
        });
    },

    cancel() {
      this.$router.push({ name: "user-view" });
    },
  },
};
</script>

<style scoped>
.form-label {
  font-weight: bold;
}
</style>
