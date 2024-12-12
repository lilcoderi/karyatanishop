<template>
  <div class="card product-card mb-4">
    <!-- Gambar produk -->
    <img :src="productImage" class="card-img-top img-fluid" :alt="product.nama_produk" />
    <!-- Nama produk dan harga -->
    <div class="card-body text-left">
      <h5 class="card-title text-truncate text-capitalize font-weight-bold">{{ product.nama_produk }}</h5>
      <p class="card-text">
        {{ formatPrice(product.after_diskon || product.harga) }}
      </p>

      <!-- Quantity Adjustment -->
      <div class="d-flex justify-content-center align-items-center centered-container">
        <button class="btn btn-outline-secondary btn-sm" @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
        <span class="mx-2">{{ quantity }}</span>
        <button class="btn btn-outline-secondary btn-sm" @click="increaseQuantity">+</button>
      </div>

      <div class="d-flex justify-content-center align-items-center centered-container">
        <button @click="addToCart" class="btn text-second shadow-sm btn-sm mt-3">
          <i class="fa fa-plus-circle fa-sm"></i> Add This Product
        </button>
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
    };
  },
  computed: {
    productImage() {
      return `http://127.0.0.1:8000/${this.product.gambar}`;
    },
  },
  methods: {
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
          "http://127.0.0.1:8000/api/keranjang-offline/add",
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

        if (response.data.message === "Produk berhasil ditambahkan ke keranjang") {
          alert("Produk berhasil ditambahkan ke keranjang!");
          this.$emit("addedToCart", this.product);
        } else {
          alert("Gagal menambahkan produk ke keranjang.");
        }
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
        alert("Terjadi kesalahan saat menambahkan produk ke keranjang.");
      }
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
.text-second {
  color: #7ABC18;
  background-color: aliceblue;
}
.text-second:hover{
  background-color: rgb(232, 240, 247);
}
</style>
