<template>
    <div class="card h-100">
      <!-- Gambar produk -->
      <img :src="productImage" class="card-img-top" :alt="product.nama_produk" />
      
      <!-- Nama produk dan harga -->
      <div class="card-body">
        <h5 class="card-title">{{ product.nama_produk }}</h5>
        <p class="card-text text-primary">
          Rp {{ formatPrice(product.after_diskon || product.harga) }}
        </p>
        <!-- Tombol Keranjang -->
        <button @click="addToCart" class="btn btn-primary">
          <i class="fa fa-shopping-cart"></i> Add to Cart
        </button>
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
              kuantitas: 1, 
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 201) {
            alert(response.data.message);
            this.$emit("addedToCart", response.data.item); 
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
  /* .card {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  } */
  .card-img-top {
    height: 200px;
    object-fit: cover;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  </style>
  