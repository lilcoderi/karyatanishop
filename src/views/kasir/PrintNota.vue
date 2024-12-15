<template>
  <div class="container mt-5" v-if="nota && nota.length > 0">
    <div class="text-center">
      <img src="/img/logo_kat.png" alt="Logo Karya Tani"/>
      <h3>Karya Tani Bojonegoro</h3>
    </div>
    <div class="mt-3">
      <p><strong>Nota ID:</strong> {{ nota[0].nota_belanja_id }}</p>
      <p><strong>Date:</strong> {{ formatDate(nota[0].created_at) }}</p>
    </div>
    <table class="table table-bordered mt-4">
      <thead>
        <tr>
          <th>Nama Produk</th>
          <th>Merek</th>
          <th>Harga Satuan</th>
          <th>Kuantitas</th>
          <th>Subtotal</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in nota" :key="item.item_nota_belanja_id">
          <td>{{ item.produk?.nama_produk || 'Nama produk tidak tersedia' }}</td>
          <td>{{ item.produk?.merk || 'Merek tidak tersedia' }}</td>
          <td>{{ formatPrice(item.harga_satuan || 0) }}</td>
          <td>{{ item.kuantitas }}</td>
          <td>{{ formatPrice(item.subtotal || 0) }}</td>
        </tr>
        <tr>
          <td colspan="4" class="text-right"><strong>Total Subtotal</strong></td>
          <td>{{ formatPrice(calculateTotalSubtotal()) }}</td>
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
      nota: [], // Array untuk menyimpan data nota
    };
  },
  methods: {
    async fetchNota(notaId) {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://127.0.0.1:8000/api/nota-belanja/${notaId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && Array.isArray(response.data.data)) {
          this.nota = response.data.data; // Simpan data nota
          this.$nextTick(() => {
            this.printPage(); // Cetak halaman setelah data dimuat
          });
        } else {
          console.error("Data nota tidak valid.");
        }
      } catch (err) {
        console.error(err.response?.data?.message || "Gagal mengambil data nota.");
      }
    },
    calculateTotalSubtotal() {
      // Menghitung total dari semua subtotal item
      return this.nota.reduce((total, item) => {
        return total + parseFloat(item.subtotal || 0);
      }, 0);
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
    printPage() {
      window.print();
    },
  },
  mounted() {
    const notaId = this.$route.params.id; // Ambil nota_id dari parameter route
    this.fetchNota(notaId); // Ambil data nota
  },
};
</script>

<style scoped>
@media print {
  body {
    margin: 0;
    padding: 0;
    font-size: 12px;
    width: 80mm; /* Lebar nota untuk printer thermal */
  }
  .container {
    width: 100%;
    margin: 0 auto;
    padding: 10px;
    font-family: Arial, sans-serif;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    text-align: left;
    padding: 5px;
    border: 1px solid #ddd;
  }
  th {
    font-weight: bold;
  }
  img {
    max-width: 100%;
    height: auto;
  }
}
</style>
