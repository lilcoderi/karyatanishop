<template>
    <div class="container mt-5" v-if="nota">
      <!-- <div class="d-flex align-items-center font-weight-bold">
        <a href="" @click="goHome" class="text-dark text-decoration-none">
          <i class="bi bi-arrow-left-circle fa-lg fs-4 text-dark mr-1" role="button"></i> Back
        </a>
      </div> -->
      <div class="text-center">
        <img src="/img/logo_kat.png" alt="Logo Karya Tani"/>
        <h3>Karya Tani Bojonegoro</h3>
      </div>
      <div class="mt-3">
        <p><strong>Nota ID:</strong> {{ nota.item_nota_belanja_id }}</p>
        <p><strong>Date:</strong> {{ formatDate(nota.created_at) }}</p>
      </div>
      <table class="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Nama Produk</th>
            <th>Merek</th>
            <th>Harga Satuan</th>
            <th>After Diskon</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in notaItems" :key="item.item_nota_belanja_id">
            <td>{{ item.produk ? item.produk.nama_produk : 'Nama produk tidak tersedia' }}</td>
            <td>{{ item.produk ? item.produk.merk : 'Merek tidak tersedia' }}</td>
            <td>{{ formatPrice(item.harga_satuan) }}</td>
            <td>{{ item.produk ? formatPrice(item.produk.after_diskon) : 'Harga diskon tidak tersedia' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        nota: null,
        notaItems: [],
      };
    },
    methods: {
      async fetchNota(notaId) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(`http://127.0.0.1:8000/api/item-nota/${notaId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          console.log("Data respons nota:", response.data);
  
          if (response.data.success) {
            this.nota = response.data.data; 
            this.notaItems = [response.data.data]; 
          } else {
            console.error("Gagal mengambil data nota.");
          }
        } catch (err) {
          console.error(err.response?.data?.message || "Gagal mengambil data nota.");
        }
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
      formatPrice(price) {
        return parseFloat(price).toLocaleString("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        });
      },
    },
    goHome(){
      this.$router.push("/kasir-view");
    },
    mounted() {
      const notaId = this.$route.params.id; 
      this.fetchNota(notaId); 
    },
    watch: {

      nota(newNota) {
        if (newNota) {
          this.$nextTick(() => {
            window.print(); 
          });
        }
      },
    },
  };
  </script>
  
  <style scoped>
.container{
  font-family: "Nunito";
}
</style>