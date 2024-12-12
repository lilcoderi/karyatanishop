<template>
  <NavbarView :cartItemCount="cartItemCount" />
  <div class="container">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb" class="d-none d-lg-block">
      <ol class="breadcrumb bg-white">
        <li class="breadcrumb-item">
          <router-link to="/shop-view" class="text-decoration-none text-second">Shop</router-link>
        </li>
        <li class="breadcrumb-item">
          Detail Produk
        </li>
        <li class="breadcrumb-item active text-capitalize" aria-current="page">
          {{ product?.nama_produk || "Loading..." }}
        </li>
      </ol>
    </nav>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden"></span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger my-5">
      {{ error }}
    </div>

    <div v-else-if="!product" class="alert alert-warning my-5">
      Produk tidak ditemukan.
    </div>

    <div v-else>
      <div class="row">
        <!-- Gambar Produk -->
        <div class="col-md-5">
          <div class="position-relative">
            <img :src="getImageUrl() || 'https://via.placeholder.com/150'" alt="Produk" class="img-fluid rounded shadow" />
          </div>
        </div>

        <!-- Informasi Produk -->
        <div class="col-md-7">
          <h3 class="text-capitalize">{{ product.nama_produk }}</h3>
          <p class="text-muted text-capitalize">
            <strong>Merk:</strong> {{ product.merk || "Unknown" }}
          </p>
          <div class="d-flex align-items-center mb-3">
            <div class="text-warning">
              <span v-for="n in Math.floor(averageRating || 0)" :key="n">★</span>
              <span v-for="n in 5 - Math.floor(averageRating || 0)" :key="'empty-' + n" class="text-secondary">
                ☆
              </span>
            </div>

            <span class="text-muted ms-2">({{ reviews.length }} reviews)</span>
          </div>

          <!-- Harga -->
          <h4 class="text-second">
            {{ formatCurrency(product.harga_satuan) }}
            <small v-if="product.harga_diskon" class="text-muted text-decoration-line-through ms-2">
              {{ formatCurrency(product.harga_diskon) }}
            </small>
          </h4>

          <!-- Deskripsi singkat -->
          <p class="mt-3 text-capitalize">{{ product.deskripsi_produk }}</p>

          <!-- Fitur Produk -->
          <ul class="list-unstyled d-flex">
            <li class="mr-3"><i class="fa fa-check-circle text-success me-2"></i> High Quality</li>
            <li class="mr-3"><i class="fa fa-clock text-success me-2"></i> Fast Delivery</li>
            <li class="mr-3">
              <i class="fa fa-credit-card text-success me-2"></i> Online Payment
            </li>
          </ul>

          <!-- Pilihan Berat -->
          <h6 class="mt-4">Berat</h6>
          <div>
            <p>{{ product.berat || "N/A" }} Kg</p>
          </div>

          <!-- Kontrol Kuantitas -->
          <div class="quantity-control my-3 d-flex align-items-center">
            <button class="btn btn-outline-secondary" @click="decreaseQuantity" :disabled="quantity <= 1">
              <i class="fa fa-minus"></i>
            </button>
            <span class="mx-3 fs-5">{{ quantity }}</span>
            <button class="btn btn-outline-secondary" @click="increaseQuantity">
              <i class="fa fa-plus"></i>
            </button>
          </div>

          <!-- Tombol Aksi -->
          <div class="btn-group">
            <button class="btn btn-cart text-white me-2" @click="addToCart">
              <i class="fa fa-cart-plus"></i> Add to cart
            </button>
            <button class="btn btn-warning text-white" @click="orderNow">
              Order now
            </button>
          </div>

          <!-- Ketersediaan Stok -->
          <p class="text-muted mt-2">
            Availability: {{ product.stok || "Not Available" }} items
          </p>
        </div>
      </div>

      <!-- Deskripsi & Ulasan -->
      <div class="mt-5">
        <ul class="nav nav-tabs" id="productTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <a class="nav-link active" id="description-tab" data-toggle="tab" href="#description" role="tab"
              aria-controls="description" aria-selected="true">
              Deskripsi
            </a>
          </li>
          <li class="nav-item" role="presentation">
            <a class="nav-link" id="reviews-tab" data-toggle="tab" href="#reviews" role="tab" aria-controls="reviews"
              aria-selected="false">
              Reviews
            </a>
          </li>
        </ul>
        <div class="tab-content mt-3" id="productTabContent">
          <!-- Tab Deskripsi -->
          <div class="tab-pane fade show active" id="description" role="tabpanel" aria-labelledby="description-tab">
            <p>{{ product.deskripsi_produk }}</p>
            <ul>
              <li class="text-capitalize"><strong>Merk:</strong> {{ product.merk || "N/A" }}</li>
              <li><strong>Weight:</strong> {{ product.berat || "N/A" }}</li>
            </ul>
          </div>

          <!-- Tab Ulasan -->
          <div class="tab-pane fade" id="reviews" role="tabpanel" aria-labelledby="reviews-tab">
            <div v-if="loadingReviews" class="text-center">
              <div class="spinner-border text-success" role="status">
                <span class="visually-hidden"></span>
              </div>
            </div>
            <div v-else-if="reviewsError" class="alert alert-danger">
              {{ reviewsError }}
            </div>
            <div v-else-if="reviews.length === 0" class="alert alert-info">
              No reviews yet.
            </div>
            <div v-else class="review-list">
              <div v-for="review in reviews" :key="review.id_review" class="review-item d-flex align-items-start mb-4">
                <img :src="getUserProfileImage(review.user ? review.user.foto : '')" alt="Foto Profil"
                  class="profile-img rounded-circle me-3" />
                <div class="review-content">
                  <p class="mb-1">
                    <strong>{{ getUserName(review.user) }}</strong>
                  </p>
                  <p>
                    <strong>Rating:</strong>
                    <span v-for="n in review.rating" :key="n" class="text-warning">
                      ★
                    </span>
                    <span v-for="n in 5 - review.rating" :key="'empty-' + n" class="text-secondary">
                      ★
                    </span>
                  </p>
                  <p>{{ review.content }}</p>
                  <p class="text-muted small">
                    <em>Ditulis pada: {{ formatDate(review.created_at) }}</em>
                  </p>
                </div>
              </div>
              <hr />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";
import NavbarView from "@/components/NavbarView.vue";

export default {
  components: {
    NavbarView,
  },
  props: {
    produk_id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      product: null,
      reviews: [],
      loading: true,
      loadingReviews: true,
      error: null,
      reviewsError: null,
      quantity: 1,
      addToCartLoading: false, // Tambahan untuk tombol "Add to Cart"
    };
  },
  methods: {
    async fetchProductDetail() {
      try {
        const token = this.getToken();

        if (!token) {
          throw new Error("Token tidak ditemukan. Silakan login kembali.");
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/products/${this.produk_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data) {
          this.product = response.data;
        } else {
          throw new Error("Data produk tidak ditemukan.");
        }
      } catch (err) {
        this.error =
          err.response?.data?.message || err.message || "Gagal memuat detail produk.";
      } finally {
        this.loading = false;
      }
    },
    async fetchProductReviews() {
      try {
        const token = this.getToken();

        if (!token) {
          throw new Error("Token tidak ditemukan. Silakan login kembali.");
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/reviews/${this.produk_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data) {
          this.reviews = response.data;
        } else {
          throw new Error("Data ulasan tidak ditemukan.");
        }
      } catch (err) {
        this.reviewsError =
          err.response?.data?.message || err.message || "Gagal memuat ulasan produk.";
      } finally {
        this.loadingReviews = false;
      }
    },
    increaseQuantity() {
      this.quantity += 1;
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity -= 1;
      }
    },
    async addToCart() {
      try {
        this.addToCartLoading = true; // Mulai loading state
        const token = this.getToken();
        if (!token) {
          alert("Anda harus login terlebih dahulu.");
          return;
        }

        const response = await axios.post(
          "http://127.0.0.1:8000/api/cart/add",
          {
            produk_id: this.produk_id,
            kuantitas: this.quantity,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          alert("Produk berhasil ditambahkan ke keranjang!");
        } else {
          alert("Gagal menambahkan produk ke keranjang.");
        }
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
        alert("Terjadi kesalahan saat menambahkan produk ke keranjang.");
      } finally {
        this.addToCartLoading = false; // Akhiri loading state
      }
    },
    getImageUrl() {
      return this.product ? `http://127.0.0.1:8000/${this.product.gambar}` : "";
    },
    getUserProfileImage(foto) {
      return foto
        ? `http://127.0.0.1:8000/${foto}`
        : "http://127.0.0.1:8000/storage/foto_profil/default-image.jpg";
    },
    getUserName(user) {
      return user ? user.nama : "Pengguna Tidak Diketahui";
    },
    formatCurrency(value) {
      return parseFloat(value).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
    getToken() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token tidak ditemukan. Anda akan dialihkan ke halaman login.");
        this.$router.push("/login");
      }
      return token;
    },
  },
  computed: {
    averageRating() {
      if (!this.reviews || this.reviews.length === 0) {
        return 0;
      }
      const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
      return totalRating / this.reviews.length;
    },
  },

  mounted() {
    this.fetchProductDetail();
    this.fetchProductReviews();
  },
};
</script>


<style scoped>
.container {
  text-align: left !important;
  font-family: "Nunito";
}
.btn-cart{
  background-color: #87cf1b;
}
.btn-cart:hover {
  background-color: #7ABC18;
}
.text-second {
    color: #7ABC18;
}
</style>
