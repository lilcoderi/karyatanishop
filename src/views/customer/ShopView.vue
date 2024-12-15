<template>
  <div class="shop-view">
    <!-- Navbar dengan event pencarian -->
    <NavbarView @onSearch="handleSearch" :cartItemCount="cartItemCount" />

    <!-- Konten Daftar Produk -->
    <div class="container mt-4">
      <h4>Shop</h4>
      <h6 class="mb-5">Home / <span class="text-second">Shop</span></h6>


      <!-- Loader saat data sedang dimuat -->
      <div v-if="loading" class="text-center my-5">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden"></span>
        </div>
      </div>

      <!-- Pesan error -->
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <!-- Produk Kosong -->
      <div v-else-if="!products.length && !loading" class="text-center my-5">
        <p class="text-muted">Produk tidak ditemukan.</p>
      </div>

      <!-- Daftar produk -->
      <!-- Daftar produk -->
<div v-else class="row row-cols-2 row-cols-md-5 g-4 text-left">
  <div v-for="product in products" :key="product.produk_id" class="col">
    <ProductCardCustomer :product="product" @click="goToProductDetail(product.produk_id)" />
  </div>
</div>


    </div>
  </div>
</template>

<script>
import NavbarView from "@/components/NavbarView.vue";
import ProductCardCustomer from "@/components/ProductCardCustomer.vue";
import axios from "axios";

export default {
  components: {
    NavbarView,
    ProductCardCustomer,
  },
  data() {
    return {
      products: [],
      searchQuery: "",
      loading: false,
      error: null,
      cart: [],
    };
  },
  methods: {
    async fetchProducts() {
  try {
    this.loading = true;
    this.error = null;

    const token = localStorage.getItem("token");
    const response = await axios.get("http://127.0.0.1:8000/api/products-all", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Filter produk dengan stok > 0
    this.products = (response.data.data || []).filter(product => product.stok > 0);
  } catch (err) {
    this.error = err.response?.data?.message || "Gagal memuat daftar produk.";
  } finally {
    this.loading = false;
  }
},



    async searchProducts() {
  try {
    this.loading = true;
    this.error = null;

    if (!this.searchQuery.trim()) {
      await this.fetchProducts();
      return;
    }

    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://127.0.0.1:8000/api/search-products",
      { nama_produk: this.searchQuery },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Filter produk dengan stok > 0
    this.products = (response.data.data || []).filter(product => product.stok > 0);
  } catch (err) {
    this.error = err.response?.data?.message || "Produk tidak ditemukan.";
    this.products = [];
  } finally {
    this.loading = false;
  }
},

    goToProductDetail(produk_id) {
      this.$router.push(`/product-detail-customer/${produk_id}`);
    },

    handleSearch(query) {
      this.searchQuery = query; // Update query
      this.searchProducts(); // Panggil pencarian
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.shop-view {
  font-family: "Nunito";
}

.text-second {
  color: #7ABC18;
}




</style>