<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Edit Product</h2>
      <button class="btn btn-primary" @click="goBack">Back to Product List</button>
    </div>

    <form @submit.prevent="updateProduct">
      <!-- Form fields for editing product -->
      <div class="mb-3">
        <label for="kategori_id" class="form-label">Category</label>
        <select v-model="product.kategori_id" class="form-select" id="kategori_id" :disabled="!categories.length">
          <option v-for="kategori in categories" :key="kategori.kategori_id" :value="kategori.kategori_id">
            {{ kategori.nama_kategori }}
          </option>
        </select>
      </div>

      <div class="mb-3">
        <label for="nama_produk" class="form-label">Product Name</label>
        <input v-model="product.nama_produk" type="text" class="form-control" id="nama_produk" required />
      </div>

      <div class="mb-3">
        <label for="merk" class="form-label">Brand</label>
        <input v-model="product.merk" type="text" class="form-control" id="merk" />
      </div>

      <div class="mb-3">
        <label for="deskripsi_produk" class="form-label">Description</label>
        <textarea v-model="product.deskripsi_produk" class="form-control" id="deskripsi_produk"></textarea>
      </div>

      <div class="mb-3">
        <label for="berat" class="form-label">Weight (kg)</label>
        <input v-model="product.berat" type="number" class="form-control" id="berat" step="0.01" />
      </div>

      <div class="mb-3">
        <label for="harga_satuan" class="form-label">Price</label>
        <input v-model="product.harga_satuan" type="number" class="form-control" id="harga_satuan" required />
      </div>

      <div class="mb-3">
        <label for="stok" class="form-label">Stock</label>
        <input v-model="product.stok" type="number" class="form-control" id="stok" min="0" />
      </div>

      <div class="mb-3">
        <label for="status_produk" class="form-label">Status</label>
        <select v-model="product.status_produk" class="form-select" id="status_produk">
          <option value="aktif">Active</option>
          <option value="nonaktif">Inactive</option>
        </select>
      </div>

      <div class="mb-3">
        <label for="gambar" class="form-label">Product Image</label>
        <input @change="handleImageChange" type="file" class="form-control" id="gambar" ref="gambar" />
        <img v-if="imagePreview" :src="imagePreview" alt="Image Preview" class="img-thumbnail mt-3" width="150" />
      </div>

      <div class="mb-3">
        <label for="promo_id" class="form-label">Promo</label>
        <select v-model="product.promo_id" class="form-select" id="promo_id" :disabled="!promos.length">
          <option v-for="promo in promos" :key="promo.promo_id" :value="promo.promo_id">
            {{ promo.nama_promo }}
          </option>
        </select>
      </div>

      <button type="submit" class="btn btn-success">Update Product</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      product: {
        kategori_id: null,
        nama_produk: "",
        merk: "",
        deskripsi_produk: "",
        berat: 0,
        harga_satuan: 0,
        stok: 0,
        status_produk: "aktif",
        gambar: "",
        promo_id: null,
      },
      categories: [],
      promos: [],
      imagePreview: null,
      currentPageCategory: 1,
      currentPagePromo: 1,
    };
  },
  methods: {
    fetchProduct() {
      const productId = this.$route.params.id;
      const token = localStorage.getItem("jwt_token");

      axios
        .get(`http://127.0.0.1:8000/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.product = response.data;
          this.imagePreview = this.getImageUrl(this.product.gambar);
        })
        .catch((error) => {
          console.error("Error fetching product:", error);
        });

      this.fetchCategories();
      this.fetchPromos();
    },
    fetchCategories() {
      const token = localStorage.getItem("jwt_token");

      axios
        .get(`http://127.0.0.1:8000/api/categories?page=${this.currentPageCategory}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.categories = response.data.data;
        })
        .catch((error) => {
          console.error("Error fetching categories:", error);
        });
    },
    fetchPromos() {
      const token = localStorage.getItem("jwt_token");

      axios
        .get(`http://127.0.0.1:8000/api/promo?page=${this.currentPagePromo}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          this.promos = response.data.data;
        })
        .catch((error) => {
          console.error("Error fetching promos:", error);
        });
    },
    updateProduct() {
      const productId = this.$route.params.id;
      const formData = new FormData();

      formData.append("_method", "PUT");
      Object.keys(this.product).forEach((key) => {
        if (this.product[key] !== null && this.product[key] !== "") {
          formData.append(key, this.product[key]);
        }
      });

      if (this.$refs.gambar.files && this.$refs.gambar.files.length > 0) {
        formData.append("gambar", this.$refs.gambar.files[0]);
      }

      const token = localStorage.getItem("jwt_token");

      axios
        .post(`http://127.0.0.1:8000/api/products/${productId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          alert("Product updated successfully!");
          this.$router.push("/product-view");
        })
        .catch((error) => {
          console.error("Error updating product:", error);
          if (error.response) {
            console.error("Error response data:", error.response.data);
          }
        });
    },

    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    getImageUrl(imagePath) {
      return `http://127.0.0.1:8000/${imagePath}`;
    },
    goBack() {
      this.$router.push("/product-view");
    },
  },
  mounted() {
    this.fetchProduct();
  },
};
</script>
