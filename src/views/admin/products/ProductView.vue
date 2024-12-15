<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>Product List</h4>
      <button class="btn btn-sm btn-success shadow-sm" @click="addProduct">
        <i class="fas fa-plus fa-sm text-white-50"></i> Add Product
      </button>
    </div>

    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="table-order m-0 font-weight-bold text-success">Tabel Produk</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-bordered">
            <thead class="bg-success text-white">
              <tr>
                <th>Produk ID</th>
                <th>Nama Produk</th>
                <th>Merek</th>
                <th>Kategori</th>
                <th class="text-truncate" style="max-width: 200px;">Deskripsi</th>
                <th>Berat</th>
                <th>Harga Satuan</th>
                <th>Gambar</th>
                <th>Promo</th>
                <th>After Diskon</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products.data" :key="product.produk_id">
                <td class="text-truncate" style="max-width: 150px;">{{ product.produk_id }}</td>
                <td class="text-truncate" style="max-width: 150px;" :title="product.nama_produk">{{ product.nama_produk }}
                </td>
                <td class="text-truncate" style="max-width: 150px;">{{ product.merk }}</td>
                <td class="text-truncate" style="max-width: 150px;">{{ product.kategori?.nama_kategori || 'No Category' }}
                </td>
                <td class="text-truncate" style="max-width: 200px;">{{ product.deskripsi_produk }}</td>
                <td>{{ product.berat }} kg</td>
                <td>{{ formatCurrency(product.harga_satuan) }}</td>
                <td>
                  <img :src="getImageUrl(product.gambar)" :alt="`Image of ${product.nama_produk}`" class="img-thumbnail"
                    width="100" />
                </td>
                <td>{{ product.promo ? product.promo.nilai_promo + '%' : 'No Promo' }}</td>
                <td>{{ formatCurrency(product.after_diskon) }}</td>
                <td>
                  <button class="btn btn-info btn-sm mb-2" @click="viewProduct(product)"><i
                      class="bi bi-eye-fill"></i></button>
                  <button class="btn btn-warning btn-sm mb-2" @click="editProduct(product)"><i
                      class="bi bi-pencil-fill"></i></button>
                  <button class="btn btn-danger btn-sm mb-2" @click="deleteProduct(product.produk_id)"><i
                      class="bi bi-trash-fill"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination Buttons -->
        <nav class="d-flex justify-content-center align-items-center">
          <button class="btn btn-outline-success btn-sm mx-2" :disabled="!products.prev_page_url"
            @click="fetchProducts(products.prev_page_url)">
            <i class="fas fa-chevron-left"></i> Previous
          </button>
          <span class="text-muted">
            Page {{ products.current_page }} of {{ products.last_page }}
          </span>
          <button class="btn btn-outline-success btn-sm mx-2" :disabled="!products.next_page_url"
            @click="fetchProducts(products.next_page_url)">
            Next <i class="fas fa-chevron-right"></i>
          </button>
        </nav>

      </div>
    </div>


  </div>
</template>

<script>
import axios from "axios";
import "datatables.net-bs4";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default {
  data() {
    return {
      products: {
        data: [],
        prev_page_url: null,
        next_page_url: null,
      },
    };
  },
  methods: {
    fetchProducts(url = "http://127.0.0.1:8000/api/products") {
      axios
        .get(url)
        .then((response) => {
          if ($.fn.DataTable.isDataTable("#dataTable")) {
            $("#dataTable").DataTable().destroy();
          }
          this.products = response.data.data;
          this.$nextTick(() => {
            $("#dataTable").DataTable();
          });
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          if (error.response && error.response.status === 401) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("token");
            this.$router.push("/login");
          }
        });
    },
    getImageUrl(imageName) {
  const url = `http://127.0.0.1:8000/${imageName}`;
  console.log("Generated Image URL:", url);
  return url;
},

    addProduct() {
      this.$router.push("/product-add");
    },
    viewProduct(product) {
      this.$router.push(`/product-detail/${product.produk_id}`);
    },
    editProduct(product) {
      this.$router.push(`/product-edit/${product.produk_id}`);
    },
    deleteProduct(produkId) {
      if (confirm("Are you sure you want to delete this product?")) {
        axios
          .delete(`http://127.0.0.1:8000/api/products/${produkId}`)
          .then(() => {
            alert("Product deleted successfully.");
            this.fetchProducts();
          })
          .catch((error) => {
            console.error("Error deleting product:", error);
            alert("Failed to delete product.");
          });
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(value);
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
@import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>
