<template>
  <div>
    <!-- Navbar -->
    <NavbarKasir :cartItemCount="cartItemCount" @search="handleSearch" />

    <!-- Konten Daftar Produk -->
    <div class="container mt-4">
      <h4 class="mb-4">Daftar Produk</h4>

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
      
      <!-- Daftar produk -->
      <div v-else class="row row-cols-2 row-cols-md-5 g-4">
        <div v-for="product in products" :key="product.produk_id" class="col">
          <ProductCard :product="product" @addedToCart="updateCart" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarKasir from "@/components/NavbarKasir.vue";
import ProductCard from "@/components/ProductCard.vue";
import axios from "axios";

export default {
  components: {
    NavbarKasir,
    ProductCard,
  },
  data() {
    return {
      products: [], // Daftar produk
      searchQuery: "", // Query pencarian
      loading: false, // Indikator loading
      error: null, // Pesan error
      cart: [], // Daftar produk di keranjang
    };
  },
  computed: {
    cartItemCount() {
      return this.cart.reduce((total, item) => total + item.quantity, 0);
    },
  },
  methods: {
    async fetchProducts(query = "") {
      this.loading = true;
      this.error = null;

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          this.error = "Anda belum login. Silakan login untuk melihat produk.";
          return;
        }

        const url = query 
          ? "http://127.0.0.1:8000/api/search-products" 
          : "http://127.0.0.1:8000/api/products-all";

        const payload = query 
          ? { nama_produk: query } 
          : {};

        const response = await axios({
          method: query ? "post" : "get",
          url,
          data: payload,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.products = response.data.data || [];
      } catch (err) {
        this.error = err.response?.data?.message || "Gagal memuat daftar produk.";
      } finally {
        this.loading = false;
      }
    },
    handleSearch(query) {
      // Update query pencarian dan fetch produk
      this.searchQuery = query;
      this.fetchProducts(query);
    },
    async addToCart(product) {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Anda harus login terlebih dahulu.");
          return;
        }

        const response = await axios.post(
          "http://127.0.0.1:8000/api/keranjang-offline/add",
          {
            produk_id: product.produk_id,
            kuantitas: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          alert("Produk berhasil ditambahkan ke keranjang!");
          this.updateCart(product);
        } else {
          alert("Gagal menambahkan produk ke keranjang.");
        }
      } catch (err) {
        console.error("Terjadi kesalahan:", err);
        alert("Terjadi kesalahan saat menambahkan produk ke keranjang.");
      }
    },
    updateCart(product) {
      const existingProduct = this.cart.find(item => item.produk_id === product.produk_id);
      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        this.cart.push({ ...product, quantity: 1 });
      }
    },
    formatPrice(price) {
      return parseFloat(price).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.container {
  font-family: "Nunito";
}

.text-second {
  color: #7ABC18;
}
</style>