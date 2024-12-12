<template>
  <div class="category-edit">
    <h1 class="mb-4">Edit Category</h1>
    <form @submit.prevent="updateCategory">
      <div class="mb-3">
        <label for="categoryName" class="form-label">Name</label>
        <input
          type="text"
          id="categoryName"
          v-model="category.nama_kategori"
          class="form-control"
          placeholder="Enter category name"
          required
        />
      </div>
      <div class="mb-3">
        <label for="categoryDescription" class="form-label">Description</label>
        <textarea
          id="categoryDescription"
          v-model="category.deskripsi_kategori"
          class="form-control"
          placeholder="Enter category description"
          rows="4"
        ></textarea>
      </div>
      <div class="d-flex justify-content-end">
        <button type="button" class="btn btn-secondary me-3" @click="cancel">Cancel</button>
        <button type="submit" class="btn btn-primary">Save</button>
      </div>
    </form>
    <div v-if="message" :class="messageClass">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "KategoriEdit",
  data() {
    return {
      category: {
        nama_kategori: "",
        deskripsi_kategori: "",
      },
      message: null,
      messageClass: "",
    };
  },
  created() {
    const categoryId = this.$route.params.id;
    this.fetchCategory(categoryId);
  },
  methods: {
    async fetchCategory(id) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.message = "You are not authenticated. Please log in.";
          this.messageClass = "error";
          this.$router.push("/login");
          return;
        }

        const response = await axios.get(`http://127.0.0.1:8000/api/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          this.category = response.data;
        }
      } catch (error) {
        console.error("Error fetching category:", error);
        this.message =
          error.response?.data?.message ||
          "An error occurred while fetching the category.";
        this.messageClass = "error";
      }
    },
    async updateCategory() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.message = "You are not authenticated. Please log in.";
          this.messageClass = "error";
          this.$router.push("/login");
          return;
        }

        const response = await axios.put(
          `http://127.0.0.1:8000/api/categories/${this.$route.params.id}`,
          this.category,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          alert(`Category "${this.category.nama_kategori}" has been updated!`);
          this.$router.push("/kategori-view");
        }
      } catch (error) {
        console.error("Error updating category:", error);
        this.message =
          error.response?.data?.message ||
          "An error occurred while updating the category.";
        this.messageClass = "error";
      }
    },
    cancel() {
      this.$router.push("/kategori-view");
    },
  },
};
</script>

<style scoped>
.category-edit {
  padding: 20px;
  max-width: 600px;
  margin: auto;
}

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
