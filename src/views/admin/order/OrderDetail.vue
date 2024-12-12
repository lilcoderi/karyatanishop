<template>
  <div class="container mt-5">
    <h3 class="text-center">Detail Order</h3>

    <!-- Loading Spinner -->
    <div v-if="loading" class="text-center mt-4">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Order Details -->
    <div v-if="!loading && order" class="card mt-4">
      <div class="card-header bg-primary text-white">
        <h5>Order ID: {{ order.order_id }}</h5>
      </div>
      <div class="card-body">
        <p><strong>User ID:</strong> {{ order.user_id || "N/A" }}</p>
        <p><strong>Email:</strong> {{ order.user?.email || "N/A" }}</p>
        <p><strong>Nama:</strong> {{ order.user?.nama || "N/A" }}</p>
        <p><strong>Tanggal Order:</strong> {{ order.tgl_order || "N/A" }}</p>
        <p><strong>Status:</strong> {{ order.status_order || "N/A" }}</p>
      </div>
    </div>

    <!-- Produk Details -->
    <div v-if="!loading && order && order.produk_items && order.produk_items.length > 0" class="card mt-4">
      <div class="card-header bg-success text-white">
        <h5>Produk Details</h5>
      </div>
      <div class="card-body">
        <!-- Loop produk items -->
        <div v-for="item in order.produk_items" :key="item.produk_item_id" class="mb-3">
          <p><strong>Nama Produk:</strong> {{ item.produk?.nama_produk || "Tidak Ditemukan" }}</p>
          <p><strong>Produk ID:</strong> {{ item.produk?.produk_id || "Tidak Ditemukan" }}</p>
          <p><strong>Merk:</strong> {{ item.produk?.merk || "Tidak Ditemukan" }}</p>
          <p><strong>Deskripsi Produk:</strong> {{ item.produk?.deskripsi_produk || "Tidak Ditemukan" }}</p>
          <p><strong>Harga Satuan:</strong> {{ item.produk?.harga_satuan || "Tidak Ditemukan" }}</p>
          <p><strong>Kuantitas:</strong> {{ item.kuantitas }}</p>
          <p><strong>Subtotal:</strong> {{ item.subtotal }}</p>
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-if="!loading && !order" class="alert alert-danger mt-4">
      Order tidak ditemukan.
    </div>

    <!-- Tombol Back -->
    <div class="text-center mt-4">
      <button 
        class="btn btn-secondary" 
        @click="$router.push('/order-view')">
        Back
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      order: null, 
      loading: true, 
    };
  },
  mounted() {
    this.fetchOrderDetails();
  },
  methods: {
    async fetchOrderDetails() {
      const token = localStorage.getItem("token"); 
      const orderId = this.$route.params.id; 

      if (!orderId) {
        console.error("Order ID tidak ditemukan.");
        this.loading = false;
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );

        if (response.data && response.data.data) {
          this.order = response.data.data;
        } else {
          this.order = null; 
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        this.order = null; 
      } finally {
        this.loading = false; 
      }
    },
  },
};
</script>
