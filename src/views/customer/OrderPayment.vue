<template>
    <div>
      <h2>Pembayaran untuk Order #{{ orderId }}</h2>
      <button id="pay-button" v-if="!loading && !error">Bayar Sekarang</button>
  
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden"></span>
        </div>
      </div>
  
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        orderId: null,
        snapToken: null,
        loading: true,
        error: null,
      };
    },
    async mounted() {
      // Mengambil orderId dari URL params
      const orderId = this.$route.params.orderId;
      if (orderId) {
        this.orderId = orderId;
        this.initiatePayment(orderId);
      } else {
        this.error = "Order ID tidak ditemukan.";
      }
    },
    methods: {
      async initiatePayment(orderId) {
        try {
          const response = await axios.post(
            `http://127.0.0.1:8000/api/payment/${orderId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
  
          if (response.data.status === "success") {
            this.snapToken = response.data.data.snap_token;
  
            // Menunggu user menekan tombol untuk memulai pembayaran
            this.loading = false;
            document.getElementById("pay-button").onclick = () => {
              this.startPayment();
            };
          } else {
            this.error = response.data.message || "Gagal memulai pembayaran.";
          }
        } catch (err) {
          this.error = err.response?.data?.message || "Terjadi kesalahan saat memulai pembayaran.";
        }
      },
      startPayment() {
        if (this.snapToken) {
          window.snap.pay(this.snapToken, {
            onSuccess: (result) => {
              alert("Pembayaran berhasil!");
              console.log(result);
              // Kirim data hasil transaksi ke backend atau lakukan proses lebih lanjut
            },
            onPending: (result) => {
              alert("Pembayaran tertunda, harap tunggu.");
              console.log(result);
            },
            onError: (result) => {
              alert("Pembayaran gagal!");
              console.log(result);
            },
          });
        } else {
          this.error = "Snap Token tidak tersedia.";
        }
      },
    },
  };
  </script>
  