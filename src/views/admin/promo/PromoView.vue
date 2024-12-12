<template>
  <div class="container">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h4>Promo List</h4>
      <router-link to="/promo-add" class="btn btn-sm btn-success shadow-sm">
        <i class="fas fa-plus fa-sm text-white-50"></i> Add Promo
      </router-link>
    </div>

    <div class="card shadow mb-4">
      <div class="card-header py-3">
        <h6 class="table-order m-0 font-weight-bold text-success">Table Kategori</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped">
            <thead class="bg-success text-white">
              <tr>
                <th>Promo ID</th>
                <th>Nama Promo</th>
                <th>Jenis Promo</th>
                <th>Nilai Promo</th>
                <th>Kode Voucher</th>
                <th>Tanggal Mulai</th>
                <th>Tanggal Berakhir</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="promo in promos.data" :key="promo.promo_id">
                <td>{{ formatShortId(promo.promo_id) }}</td>
                <td>{{ promo.nama_promo }}</td>
                <td>{{ promo.jenis_promo }}</td>
                <td>{{ formatNilaiPromo(promo) }}</td>
                <td>{{ promo.kode_voucher || "N/A" }}</td>
                <td>{{ formatDate(promo.tgl_mulai) }}</td>
                <td>{{ formatDate(promo.tgl_berakhir) }}</td>
                <td class="d-flex">
                  <button class="btn btn-info btn-sm mr-1" @click="viewPromo(promo.promo_id)"><i class="bi bi-eye-fill"></i></button>
                  <button class="btn btn-primary btn-sm mr-1" @click="editPromo(promo.promo_id)"><i class="bi bi-pencil-fill"></i></button>
                  <button class="btn btn-danger btn-sm mr-1" @click="deletePromo(promo.promo_id)">
                    <i class="bi bi-trash-fill"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="promos.data.length === 0">
                <td colspan="8" class="text-center">No promo available. Please add some promos.</td>
              </tr>
            </tbody>
          </table>
          <!-- Pagination Controls -->
    <div class="pagination-controls">
      <button 
        class="btn btn-outline-success btn-sm mx-2" 
        @click="fetchPromos(promos.prev_page_url)" 
        :disabled="!promos.prev_page_url">
        Previous
      </button>
      <span class="text-muted mx-2">Page {{ promos.current_page }} of {{ promos.last_page }}</span>
      <button 
        class="btn btn-outline-success btn-sm mx-2" 
        @click="fetchPromos(promos.next_page_url)" 
        :disabled="!promos.next_page_url">
        Next
      </button>
    </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      promos: {
        data: [], // Data promo akan diisi dari API
      },
      dataTable: null, // Referensi DataTables
    };
  },
  methods: {
    async fetchPromos(pageUrl = "http://127.0.0.1:8000/api/promo?page=1") {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authentication token not found.");
        return;
      }

      try {
        const response = await axios.get(pageUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.promos = response.data;

        // Inisialisasi DataTables setelah data tersedia
        this.initDataTable();
      } catch (error) {
        console.error("Error fetching promos:", error);
      }
    },
    initDataTable() {
      this.$nextTick(() => {
        if (this.dataTable) {
          this.dataTable.destroy(); // Hancurkan DataTables sebelumnya
        }
        this.dataTable = $("#dataTable").DataTable({
          destroy: true, // Pastikan DataTables dapat di-reinit
        });
      });
    },
    async deletePromo(promoId) {
      const confirmation = confirm(
        "Are you sure you want to delete this promo?"
      );
      if (!confirmation) return;

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not authenticated. Please log in.");
        return;
      }

      try {
        const response = await axios.delete(
          `http://127.0.0.1:8000/api/promo/${promoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200 || response.status === 204) {
          alert("Promo deleted successfully!");

          this.promos.data = this.promos.data.filter(
            (promo) => promo.promo_id !== promoId
          );

          this.initDataTable(); // Perbarui DataTables setelah penghapusan
        } else {
          throw new Error("Failed to delete promo.");
        }
      } catch (error) {
        console.error("Error deleting promo:", error);
        alert(error.response?.data?.message || "Failed to delete promo.");
      }
    },
    formatShortId(id) {
      return id ? `${id.substring(0, 8)}...` : "N/A";
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
    viewPromo(promoId) {
      this.$router.push(`/promo-detail/${promoId}`);
    },
    editPromo(promoId) {
      this.$router.push(`/promo-edit/${promoId}`);
    },
  },
  mounted() {
    this.fetchPromos();
  },
  beforeUnmount() {
    // Hancurkan DataTables sebelum komponen dilepas
    if (this.dataTable) {
      this.dataTable.destroy(true);
    }
  },
};
</script>

<style scoped>

</style>
