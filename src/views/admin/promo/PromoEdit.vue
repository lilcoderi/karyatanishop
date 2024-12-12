<template>
  <div class="promo-edit">
    <h1>Edit Promo</h1>
    
    <!-- Back Button -->
    <button class="btn btn-secondary mb-3" @click="goBack">Back</button>
    
    <!-- Promo Edit Form -->
    <form @submit.prevent="submitEditPromo">
      <div class="mb-3">
        <label for="nama_promo" class="form-label">Promo Name</label>
        <input
          v-model="promoData.nama_promo"
          type="text"
          class="form-control"
          id="nama_promo"
          required
        />
      </div>
      <div class="mb-3">
        <label for="jenis_promo" class="form-label">Promo Type</label>
        <select
          v-model="promoData.jenis_promo"
          class="form-select"
          id="jenis_promo"
          required
        >
          <option value="diskon">Diskon</option>
          <option value="voucher">Voucher</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="nilai_promo" class="form-label">Promo Value</label>
        <input
          v-model="promoData.nilai_promo"
          type="number"
          class="form-control"
          id="nilai_promo"
          required
        />
      </div>
      <div class="mb-3">
        <label for="tgl_mulai" class="form-label">Start Date</label>
        <input
          v-model="promoData.tgl_mulai"
          type="date"
          class="form-control"
          id="tgl_mulai"
          required
        />
      </div>
      <div class="mb-3">
        <label for="tgl_berakhir" class="form-label">End Date</label>
        <input
          v-model="promoData.tgl_berakhir"
          type="date"
          class="form-control"
          id="tgl_berakhir"
          required
        />
      </div>
      <div v-if="promoData.jenis_promo === 'voucher'" class="mb-3">
        <label for="kode_voucher" class="form-label">Voucher Code</label>
        <input
          v-model="promoData.kode_voucher"
          type="text"
          class="form-control"
          id="kode_voucher"
        />
      </div>
      <button type="submit" class="btn btn-primary">Save Changes</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      promoData: {
        nama_promo: "",
        jenis_promo: "diskon",
        nilai_promo: "",
        tgl_mulai: "",
        tgl_berakhir: "",
        kode_voucher: "", 
      },
      promoId: this.$route.params.id,
    };
  },
  mounted() {
    this.fetchPromo();
  },
  methods: {
    async fetchPromo() {
      const token = localStorage.getItem("token"); 
      if (!token) {
        console.error("Authentication token not found.");
        alert("You are not logged in. Please log in again.");
        this.$router.push("/login"); 
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/promo/${this.promoId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );

        if (response.data) {
          this.promoData = response.data; 
        } else {
          throw new Error("Promo data not found.");
        }
      } catch (error) {
        console.error("Error fetching promo:", error.response || error);
        alert(
          `Error loading promo data. ${
            error.response?.data?.message || "Please try again."
          }`
        );
      }
    },

    async submitEditPromo() {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      if (!token) {
        console.error("Authentication token not found.");
        alert("You are not logged in. Please log in again.");
        this.$router.push("/login"); 
        return;
      }

      const promoToSubmit = { ...this.promoData };

      if (promoToSubmit.jenis_promo === "diskon") {
        delete promoToSubmit.kode_voucher;
      }

      try {
        const response = await axios.put(
          `http://127.0.0.1:8000/api/promo/${this.promoId}`,
          promoToSubmit,
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );

        if (response.status === 200) {
          alert("Promo updated successfully!");
          this.$router.push("/promo-view");
        } else {
          throw new Error(
            `Failed to update promo. Status: ${response.status}`
          );
        }
      } catch (error) {
        console.error("Error updating promo:", error.response || error);
        const message =
          error.response?.data?.message || "Failed to update promo. Please try again.";
        alert(message);
      }
    },

    goBack() {
      this.$router.push("/promo-view");
    },
  },
};
</script>

<style scoped>
.promo-edit {
  padding: 20px;
}

form {
  max-width: 600px;
  margin: 0 auto;
}

form .form-label {
  font-weight: bold;
}

form .form-control {
  margin-bottom: 10px;
}

form .btn-primary {
  width: 100%;
}
</style>
