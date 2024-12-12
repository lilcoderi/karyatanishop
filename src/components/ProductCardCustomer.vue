<template>
  <div class="card product-card mb-5">
    <!-- Gambar produk -->
    <img :src="productImage" class="card-img-top img-fluid" :alt="product.nama_produk" />

    <!-- Konten Produk -->
    <div class="card-body text-left">
      <h6 class="card-title text-truncate text-capitalize font-weight-bold" title="{{ product.nama_produk }}">
        {{ product.nama_produk }}
      </h6>
      <p class="card-text">
        {{ formatPrice(product.after_diskon || product.harga) }}
      </p>

      <!-- Average Rating -->
      <div v-if="isValidRating(averageRating)" class="average-rating">
        <span v-for="n in Math.floor(averageRating)" :key="n" class="text-warning">
          ★
        </span>
        <span v-for="n in 5 - Math.floor(averageRating)" :key="'empty-' + n" class="text-muted">
          ★
        </span>
        <span class="text-muted small">({{ averageRating.toFixed(1) }})</span>
      </div>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      quantity: 1,
      averageRating: null, // Menyimpan nilai rata-rata rating produk
    };
  },
  computed: {
    productImage() {
      return `http://127.0.0.1:8000/${this.product.gambar}`;
    },
  },
  async mounted() {
    await this.fetchAverageRating();
  },
  methods: {
    async fetchAverageRating() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Anda harus login untuk melihat detail produk.");
          return;
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/products/${this.product.produk_id}/average-rating`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.average_rating !== undefined) {
          this.averageRating = response.data.average_rating;
        } else {
          console.warn(
            `Average rating tidak ditemukan untuk produk dengan ID: ${this.product.produk_id}`
          );
          this.averageRating = 0; // Default jika tidak ada data
        }
      } catch (error) {
        console.error(
          "Gagal mengambil average rating untuk produk:",
          error
        );
        this.averageRating = 0; // Default jika terjadi kesalahan
      }
    },
    formatPrice(price) {
      return parseFloat(price).toLocaleString("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      });
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
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Anda harus login terlebih dahulu.");
          return;
        }

        const response = await axios.post(
          "http://127.0.0.1:8000/api/cart/add",
          {
            produk_id: this.product.produk_id,
            kuantitas: this.quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          alert(response.data.message || "Produk berhasil ditambahkan ke keranjang!");
          this.$emit("addedToCart", this.product);
        } else {
          alert(response.data.message || "Gagal menambahkan produk ke keranjang.");
        }
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
        alert("Terjadi kesalahan saat menambahkan produk ke keranjang.");
      }
    },
    isValidRating(rating) {
      console.log("Rating produk:", rating); // Debug log rating
      return rating !== null && !isNaN(rating) && rating >= 0 && rating <= 5;
    },
  },
};
</script>

<style scoped>
.product-card {
  width: 100%;
  /* Default lebar penuh */
  max-width: 150px;
  /* Maksimal lebar card */
  margin: auto;
  border-radius: 8px;
  /* Berikan sudut yang lebih lembut */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.product-card img {
  height: 100px;
  /* Atur tinggi gambar */
  object-fit: cover;
  /* Pastikan gambar tidak terdistorsi */
}

.product-card .card-title {
  font-size: 14px;
  /* Ukuran font kecil untuk nama produk */
  line-height: 1.2;
}

.product-card .card-text {
  font-size: 13px;
  /* Ukuran font kecil untuk harga */
  color: #7ABC18;
}

@media (min-width: 768px) {
  .product-card {
    max-width: 200px;
    /* Card lebih besar pada layar sedang */
  }

  .product-card img {
    height: 120px;
  }
}

@media (min-width: 1200px) {
  .product-card {
    max-width: 240px;
    /* Card lebih besar pada layar besar */
  }

  .product-card img {
    height: 140px;
  }
}

.card-title {
  font-size: medium;
}

.average-rating {
  margin-top: 10px;
}

.text-warning {
  color: #ffc107;
  /* Warna bintang terisi */
}

.text-secondary {
  color: #ddd;
  /* Warna bintang kosong */
}
</style>
