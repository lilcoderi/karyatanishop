<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>Category List</h4>
      <button class="btn btn-sm btn-success shadow-sm" @click="addCategory">
        <i class="fas fa-plus fa-sm text-white-50"></i> Add Category
      </button>
    </div>
    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="table-order m-0 font-weight-bold text-success">Table Kategori</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-bordered" v-if="categories.data.length > 0">
      <thead class="bg-success text-white">
        <tr>
          <th scope="col">Category ID</th>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories.data" :key="category.kategori_id">
          <td>{{ category.kategori_id }}</td>
          <td>{{ category.nama_kategori }}</td>
          <td>{{ category.deskripsi_kategori }}</td>
          <td>
            <button class="btn btn-info btn-sm mr-1" @click="viewCategory(category.kategori_id)"><i class="bi bi-eye-fill"></i></button>
            <button class="btn btn-warning btn-sm mr-1" @click="editCategory(category.kategori_id)"><i class="bi bi-pencil-fill"></i></button>
            <button class="btn btn-danger btn-sm mr-1" @click="deleteCategory(category.kategori_id)"><i class="bi bi-trash-fill"></i></button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div v-if="categories.last_page > 1" class="pagination-container">
    <button 
      :disabled="categories.current_page === 1"
      @click="fetchCategories(categories.prev_page_url)"
      class="btn btn-outline-success btn-sm mx-2"
    >Previous</button>
    <span class="text-muted">
            Page {{ categories.current_page }} of {{ categories.last_page }}
    </span>
    <button 
      :disabled="categories.current_page === categories.last_page"
      @click="fetchCategories(categories.next_page_url)"
      class="btn btn-outline-success btn-sm mx-2"
    >Next</button>
  </div>
      </div>
    </div>
  </div>
</template>

<script>
import "datatables.net-bs4";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";

export default {
  name: "KategoriView",
  data() {
    return {
      categories: {
        data: [],
        current_page: 1,
        last_page: 1,
        next_page_url: null,
        prev_page_url: null,
      },
      error: null,
    };
  },
  methods: {
    async fetchCategories(url = "http://127.0.0.1:8000/api/categories") {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.error = "No token found. Please log in.";
          return;
        }

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        this.categories = data;

        this.$nextTick(() => {
          if ($.fn.DataTable.isDataTable("#dataTable")) {
            $("#dataTable").DataTable().destroy();
          }
          $("#dataTable").DataTable();
        });
      } catch (error) {
        this.error = error.message;
        console.error("Error fetching categories:", error);
      }
    },
    addCategory() {
      this.$router.push("/kategori-add");
    },
    viewCategory(categoryId) {
      this.$router.push(`/kategori-detail/${categoryId}`);
    },
    editCategory(categoryId) {
      this.$router.push(`/kategori-edit/${categoryId}`);
    },
    deleteCategory(categoryId) {
      if (!confirm(`Are you sure you want to delete category ID: ${categoryId}?`)) return;

      const token = localStorage.getItem("token");
      if (!token) {
        this.error = "No token found. Please log in.";
        return;
      }

      fetch(`http://127.0.0.1:8000/api/categories/${categoryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Kategori berhasil dihapus") {
            this.categories.data = this.categories.data.filter(
              (category) => category.kategori_id !== categoryId
            );
            alert(`Category ID: ${categoryId} has been deleted.`);
          } else {
            this.error = data.message || "Failed to delete category.";
          }
        })
        .catch((error) => {
          this.error = `Error deleting category: ${error.message}`;
          console.error("Error deleting category:", error);
        });
    },
  },
  mounted() {
    this.fetchCategories();
  },
  beforeUnmount() {
    if ($.fn.DataTable.isDataTable("#dataTable")) {
      $("#dataTable").DataTable().destroy();
    }
  },
};
</script>

<style scoped>
@import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
</style>
