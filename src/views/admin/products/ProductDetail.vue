<template>
  <div class="container mt-5">
    <div v-if="product" class="card">
      <img
        :src="getImageUrl(product.gambar)"
        class="card-img-top"
        alt="Product Image"
      />
      <div class="card-body">
        <h5 class="card-title">{{ product.nama_produk }}</h5>
        <p class="card-text"><strong>Merk:</strong> {{ product.merk }}</p>
        <p class="card-text"><strong>Deskripsi:</strong> {{ product.deskripsi_produk }}</p>
        <p class="card-text"><strong>Berat:</strong> {{ product.berat }} kg</p>
        <p class="card-text"><strong>Harga:</strong> Rp {{ product.harga_satuan }}</p>
        <p class="card-text"><strong>Stok:</strong> {{ product.stok }} unit</p>
        <p class="card-text"><strong>Status:</strong> {{ product.status_produk }}</p>
        <p class="card-text" v-if="product.promo">
          <strong>Promo:</strong> {{ product.promo.nama_promo }}
        </p>
        <div v-if="product.kategori">
          <p class="card-text"><strong>Kategori:</strong> {{ product.kategori.nama_kategori }}</p>
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <p>Loading product details...</p>
    </div>

    <div class="button-group text-center mt-4">
      <button type="button" class="btn btn-secondary" @click="goBack">Back</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      product: null,
    };
  },
  methods: {
    getImageUrl(imagePath) {
      return `http://127.0.0.1:8000/${imagePath}`;
    },
    fetchProductDetails() {
      const productId = this.$route.params.id; 
      axios
        .get(`http://127.0.0.1:8000/api/products/${productId}`)
        .then((response) => {
          this.product = response.data;
        })
        .catch((error) => {
          console.error('Error fetching product details:', error);
        });
    },

    goBack() {
      this.$router.push("/product-view");
    },
  },
  mounted() {
    this.fetchProductDetails();
  },
};
</script>

<style scoped>
.card-img-top {
  width: 200px; 
  height: auto;  
  margin-bottom: 20px; 
  display: block;  
  margin-left: auto;  
  margin-right: auto; 
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 24px;
  font-weight: bold;
}

.card-text {
  font-size: 16px;
  margin-bottom: 10px;
}

.button-group {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
