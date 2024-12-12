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
                <h1 class="h4 text-gray-900 mb-4">Add Category</h1>
              </div>
              <form class="user" @submit.prevent="saveCategory">
                <div class="form-group">
                  <label for="categoryName" class="form-label">Name</label>
                  <input
                    type="text"
                    id="categoryName"
                    v-model="category.nama_kategori"
                    class="form-control"
                    placeholder="Enter Category Name"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="categoryDescription" class="form-label"
                    >Description</label
                  >
                  <textarea
                    id="categoryDescription"
                    v-model="category.deskripsi_kategori"
                    class="form-control"
                    placeholder="Enter category description"
                    rows="4"
                  ></textarea>
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
import axios from "axios";

export default {
  name: "KategoriAdd",
  data() {
    return {
      category: {
        nama_kategori: "",
        deskripsi_kategori: "",
      },
      message: null,
      messageClass: "",
      errorMessage: "",
    };
  },
  methods: {
    async saveCategory() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.message = "You are not authenticated. Please log in.";
          this.messageClass = "error";
          this.$router.push("/login");
          return;
        }

        const response = await axios.post(
          "http://127.0.0.1:8000/api/categories",
          this.category,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 201) {
          alert(`Category "${this.category.nama_kategori}" has been added!`);
          this.$router.push("/kategori-view");
        }
      } catch (error) {
        // Tangani error dari API
        console.error("Error fetching saving Category:", error);
        this.errorMessage =
          error.response?.data?.message ||
          "Failed to fetch Category. Please try again.";
      }
    },
    cancel() {
      this.$router.push("/kategori-view");
    },
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
}

.form-label {
  font-weight: bold;
}

button {
  min-width: 100px;
}

.error {
  color: red;
}

.success {
  color: green;
}
</style>
