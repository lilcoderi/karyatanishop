<template>
  <div class="container">
    <!-- Alert untuk pesan error -->
    <div
      v-if="errorMessage"
      class="alert alert-danger alert-dismissible fade show mt-5"
      role="alert"
    >
      {{ errorMessage }}
      <button
        type="button"
        class="close"
        data-dismiss="alert"
        aria-label="Close"
        @click="dismissError"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>

    <div class="card o-hidden border-0 shadow-lg">
      <div class="card-body p-0">
        <!-- Nested Row within Card Body -->
        <div>
          <div>
            <div class="p-5">
              <div class="text-center">
                <h1 class="h4 text-gray-900 mb-4">Add Promo</h1>
              </div>
              <form class="user" @submit.prevent="submitPromo">
                <div class="form-group row">
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <label for="nama_promo" class="form-label"
                      >Nama Promo</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="nama_promo"
                      v-model="promoData.nama_promo"
                      required
                    />
                  </div>
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <label for="jenis_promo" class="form-label"
                      >Jenis Promo</label
                    >
                    <select
                      class="form-control"
                      id="jenis_promo"
                      v-model="promoData.jenis_promo"
                      required
                    >
                      <option value="diskon">Diskon</option>
                      <option value="voucher">Voucher</option>
                    </select>
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <label for="nilai_promo" class="form-label"
                      >Nilai Promo (%)</label
                    >
                    <input
                      type="number"
                      class="form-control"
                      id="nilai_promo"
                      v-model="promoData.nilai_promo"
                      required
                      min="0"
                    />
                  </div>
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <label for="tgl_mulai" class="form-label"
                      >Tanggal Mulai</label
                    >
                    <input
                      type="date"
                      class="form-control"
                      id="tgl_mulai"
                      v-model="promoData.tgl_mulai"
                      required
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <label for="tgl_berakhir" class="form-label"
                      >Tanggal Berakhir</label
                    >
                    <input
                      type="date"
                      class="form-control"
                      id="tgl_berakhir"
                      v-model="promoData.tgl_berakhir"
                      required
                    />
                  </div>
                  <div class="col-sm-6 mb-3 mb-sm-0" v-if="promoData.jenis_promo === 'voucher'">
                    <label for="kode_voucher" class="form-label"
                      >Kode Voucher</label
                    >
                    <input
                      type="text"
                      class="form-control"
                      id="kode_voucher"
                      v-model="promoData.kode_voucher"
                    />
                  </div>
                </div>
                <div class="form-group"></div>
                <div class="btn-group">
                  <button type="submit" class="btn btn-success btn">
                    Save
                  </button>
                  <router-link
                    to="/promo-view"
                    type="submit"
                    class="btn btn-danger btn"
                    @click="cancel"
                  >
                    Cancel
                  </router-link>
                </div>
              </form>
            </div>
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
      promoData: {
        nama_promo: "",
        jenis_promo: "diskon",
        nilai_promo: "",
        tgl_mulai: "",
        tgl_berakhir: "",
        kode_voucher: "",
      },
    };
  },
  methods: {
    async submitPromo() {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Authentication token not found.");
        return;
      }

      try {
        await axios.post("http://127.0.0.1:8000/api/promo", this.promoData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert("Promo created successfully!");
        this.$router.push("/promo");
      } catch (error) {
        console.error("Error creating promo:", error);
        alert("Failed to create promo. Please try again.");
      }
    },
  },
};
</script>

<style scoped>
.promo-add {
  max-width: 600px;
  margin: 0 auto;
}

header {
  margin-bottom: 30px;
}

form .form-label {
  font-weight: bold;
}

form .form-control {
  margin-bottom: 15px;
}

form .btn {
  width: 100%;
}
</style>
