<template>
    <div class="promo-detail">
      <div class="header mb-4">
        <h1>Promo Details</h1>
        <router-link to="/promo-view" class="btn btn-secondary">
          Back to Promo List
        </router-link>
      </div>
  
      <div v-if="promo" class="card">
        <div class="card-body">
          <h5 class="card-title">{{ promo.nama_promo }}</h5>
          <p class="card-text"><strong>Jenis Promo:</strong> {{ promo.jenis_promo }}</p>
          <p class="card-text">
            <strong>Nilai Promo:</strong> {{ formatNilaiPromo(promo) }}
          </p>
          <p class="card-text">
            <strong>Kode Voucher:</strong> {{ promo.kode_voucher || "N/A" }}
          </p>
          <p class="card-text">
            <strong>Tanggal Mulai:</strong> {{ formatDate(promo.tgl_mulai) }}
          </p>
          <p class="card-text">
            <strong>Tanggal Berakhir:</strong> {{ formatDate(promo.tgl_berakhir) }}
          </p>
        </div>
      </div>
  
      <div v-else class="alert alert-danger">
        Promo tidak ditemukan.
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    name: "PromoDetail",
    data() {
      return {
        promo: null, 
      };
    },
    methods: {
      async fetchPromo() {
        const promoId = this.$route.params.id; 
        const token = localStorage.getItem("token"); 
  
        if (!token) {
          console.error("Authentication token not found.");
          return;
        }
  
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/promo/${promoId}`, {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          });
          this.promo = response.data; 
        } catch (error) {
          console.error("Error fetching promo details:", error);
          this.promo = null; 
        }
      },
      formatNilaiPromo(promo) {
        if (promo.jenis_promo === "diskon") {
          return `${promo.nilai_promo}%`; 
        } else if (promo.jenis_promo === "voucher") {
          return `Rp ${promo.nilai_promo.toLocaleString()}`; 
        }
        return promo.nilai_promo; 
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString();
      },
    },
    mounted() {
      this.fetchPromo(); 
    },
  };
  </script>
  
  <style scoped>
  .promo-detail {
    max-width: 600px;
    margin: 0 auto;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .card {
    margin-top: 20px;
  }
  </style>
  