<template>
  <!-- Navbar -->
  <NavbarView :cartItemCount="cartItemCount" />

  <div class="container my-4">
    <!-- Loading Spinner -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden"></span>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="alert alert-danger text-center">
      <strong>Error:</strong> {{ error }}
    </div>

    <!-- Order Details -->
    <div v-if="orderData" class="card shadow-sm border-0">
      <div class="card-header bg-info text-white">
        <h5 class="mb-0">Order Details</h5>
      </div>

      <div class="card-body text-left">
        <!-- Order Summary -->
        <div class="mb-4">
          <h5 class="font-weight-bold">Order Information</h5>
          <div> 
            <small class="text-muted"><span class="text-dark font-weight-bold">Order ID :</span> {{ orderData.order_id }}</small> <br>
            <small class="text-white"><span class="text-dark font-weight-bold">Status :</span> <span :class="{
              'badge bg-success text-uppercase': orderData.status_order === 'selesai',
              'badge bg-warning text-uppercase': orderData.status_order === 'pending',
              'badge bg-info text-uppercase': orderData.status_order === 'diproses',
              'badge bg-danger text-uppercase': orderData.status_order === 'batal',
            }">
              {{ orderData.status_order }}
            </span></small> <br>
          </div>
        </div>

        <!-- User Details -->
        <div class="mb-4">
          <h5 class="font-weight-bold">User Details</h5>
          <div> 
            <small class="text-muted"><span class="text-dark font-weight-bold">Nama :</span> {{ orderData.user.nama }}</small> <br>
            <small class="text-muted"><span class="text-dark font-weight-bold">Email :</span> {{ orderData.user.email }}</small> <br>
            <small class="text-muted"><span class="text-dark font-weight-bold">No. Telp :</span> {{ orderData.user.no_tlp }}</small> <br>
          </div>
        </div>

        <!-- Product Details -->
        <h5 class="font-weight-bold mb-3">Products</h5>
        <div v-for="item in orderData.produk_items" :key="item.produk_item_id"
          class="row mb-3 align-items-center border-bottom border-top pb-3">
          <div class="col-md-3">
            <img :src="`http://127.0.0.1:8000/${item.produk.gambar}`" class="img-fluid rounded shadow-sm"
              :alt="item.produk.nama_produk" />
          </div>
          <div class="mt-3"> 
            <small class="text-muted"><span class="text-dark font-weight-bold">Nama Produk :</span> {{ item.produk.nama_produk }}</small> <br>
            <p class="mb-1 text-dark">
              <small><strong>Description : </strong> {{ item.produk.deskripsi_produk }}</small>
            </p>
            <small class="text-muted"><span class="text-dark font-weight-bold">Quantity :</span> {{ item.kuantitas }}</small> <br>
            <small class="text-muted"><span class="text-dark font-weight-bold">Harga Satuan :</span> Rp. {{ item.harga_satuan }}</small> <br>
            <small class="text-muted"><span class="text-dark font-weight-bold">Subtotal :</span> Rp. {{ item.subtotal }}</small> <br>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="mt-4">
          <h5 class="font-weight-bold">Order Summary</h5>
          <div class="align-items-center">
            <small class="text-muted"><span class="text-dark font-weight-bold">Total Harga :</span> Rp. {{ getTotalPrice() }}</small> <br>
            <small class="text-muted"><span class="text-dark font-weight-bold">Tanggal Order :</span> Rp. {{ orderData.tgl_order }}</small> <br>
          </div>
        </div>

        <div class="mt-4">
          <router-link to="/order-menu">
            <button class="btn btn-danger btn-sm">Back</button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import NavbarView from "@/components/NavbarView.vue";

export default {
  data() {
    return {
      orderData: null, // Data pesanan
      error: null, // Pesan error
      loading: true, // Status loading
    };
  },
  components: {
    NavbarView
  },
  methods: {
    // Ambil detail order berdasarkan order_id
    async fetchOrderDetails() {
      try {
        const token = localStorage.getItem("token"); // Ambil token dari localStorage
        if (!token) {
          this.error = "Anda harus login terlebih dahulu.";
          this.loading = false;
          return;
        }

        const orderId = this.$route.params.id; // Mendapatkan order_id dari URL parameter
        const response = await axios.get(`http://127.0.0.1:8000/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Menangani respons dan memastikan data ada
        if (response.data.status === "success" && response.data.data) {
          this.orderData = response.data.data;
        } else {
          this.error = "Gagal memuat detail pesanan.";
        }
      } catch (err) {
        console.error(err);
        this.error = err.response?.data?.message || "Gagal memuat detail pesanan.";
      } finally {
        this.loading = false;
      }
    },

    // Menghitung total harga dari semua produk dalam pesanan
    getTotalPrice() {
      return this.orderData.produk_items.reduce((total, item) => {
        return total + parseFloat(item.subtotal);
      }, 0).toFixed(2);
    },
  },
  mounted() {
    this.fetchOrderDetails(); // Ambil data pesanan saat komponen dimuat
  },
};
</script>

<style scoped>
/* Styling untuk gambar produk */
.container{
  font-family: "Nunito";
}

img {
  max-height: 150px;
  object-fit: cover;
}

.card{
  width: 100%; /* Lebar penuh untuk fleksibilitas */
  max-width: 600px; /* Maksimum lebar yang diinginkan */
  margin: 0 auto; /* Memindahkan ke tengah halaman */
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.card-header {
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.img-fluid {
  max-height: 150px;
  object-fit: cover;
}

.border-bottom {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.border-top{
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

h6 {
  font-size: 1rem;
  color: #495057;
}
</style>