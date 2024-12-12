<template>
  <div class="category-detail container mt-5">
    <h1 class="text-center mb-4">Category Details</h1>

    <!-- Loading Spinner -->
    <div v-if="loading" class="text-center mt-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Category Details -->
    <div v-if="!loading && category" class="card mt-4">
      <div class="card-header bg-primary text-white">
        <h5>Category ID: {{ category.kategori_id }}</h5>
      </div>
      <div class="card-body">
        <p><strong>Name:</strong> {{ category.nama_kategori || "N/A" }}</p>
        <p><strong>Description:</strong> {{ category.deskripsi_kategori || "N/A" }}</p>
        <p><strong>Created At:</strong> {{ formatDate(category.created_at) || "N/A" }}</p>
        <p><strong>Updated At:</strong> {{ formatDate(category.updated_at) || "N/A" }}</p>
      </div>
    </div>

    <!-- Not Found -->
    <div v-if="!loading && !category" class="alert alert-danger mt-4">
      Category not found.
    </div>

    <!-- Back Button -->
    <div v-if="!loading && category" class="d-flex justify-content-end mt-4">
      <button class="btn btn-secondary" @click="goBack">Back</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      category: null, 
      loading: true, 
    };
  },
  created() {
    const categoryId = this.$route.params.id; 
    this.fetchCategoryDetails(categoryId);
  },
  methods: {
    async fetchCategoryDetails(id) {
  const token = localStorage.getItem("token"); 

  if (!token) {
    console.error("Token tidak ditemukan!");
    this.loading = false;
    return;
  }

  try {
    const response = await axios.get(
      `http://127.0.0.1:8000/api/categories/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    this.category = response.data; 
  } catch (error) {
    console.error("Error fetching category details:", error);
    this.category = null; 
  } finally {
    this.loading = false; 
  }
},
    formatDate(dateString) {
      if (!dateString) return "-"; 
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    goBack() {
      this.$router.push("/kategori-view"); 
    },
  },
};
</script>

<style scoped>
.category-detail {
  max-width: 800px;
  margin: auto;
}

.card-header {
  background-color: #007bff;
}

.card-body {
  background-color: #f9f9f9;
}

button {
  min-width: 100px;
}
</style>
