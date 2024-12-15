<template>
  <NavbarView :cartItemCount="cartItemCount" />

  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h3 class="card-title text-center">Edit Address</h3>

            <!-- Form to Edit Address -->
            <form @submit.prevent="updateAddress">
              <div class="form-group">
                <label for="alamat">Alamat</label>
                <input
                  v-model="address.alamat"
                  type="text"
                  class="form-control"
                  id="alamat"
                  placeholder="Enter address"
                />
              </div>

              <div class="form-group">
                <label for="kota">Kota</label>
                <input
                  v-model="address.kota"
                  type="text"
                  class="form-control"
                  id="kota"
                  placeholder="Enter city"
                />
              </div>

              <div class="form-group">
                <label for="provinsi">Provinsi</label>
                <select
                  v-model="selectedProvince"
                  class="form-control"
                  id="provinsi"
                >
                  <option disabled value="">Select a province</option>
                  <option v-for="province in provinces" :key="province.id" :value="province.id">
                    {{ province.text }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="kecamatan">Kecamatan</label>
                <input
                  v-model="address.kecamatan"
                  type="text"
                  class="form-control"
                  id="kecamatan"
                  placeholder="Enter subdistrict"
                />
              </div>

              <div class="form-group">
                <label for="kelurahan">Kelurahan</label>
                <input
                  v-model="address.kelurahan"
                  type="text"
                  class="form-control"
                  id="kelurahan"
                  placeholder="Enter village"
                />
              </div>

              <div class="form-group">
                <label for="kode_pos">Kode Pos</label>
                <input
                  v-model="address.kode_pos"
                  type="text"
                  class="form-control"
                  id="kode_pos"
                  placeholder="Enter postal code"
                />
              </div>

              <div class="text-center mt-4">
                <button type="submit" class="btn btn-primary">Save Changes</button>
                <button class="btn btn-secondary ml-2" @click="goBack">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavbarView from "@/components/NavbarView.vue";
import axios from "axios";

export default {
  components: {
    NavbarView,
  },
  name: "AddressEdit",
  data() {
    return {
      address: {
        alamat: "",
        kota: "",
        provinsi: "",
        kecamatan: "",
        kelurahan: "",
        kode_pos: "",
      },
      provinces: [], // Daftar provinsi dari API
      selectedProvince: "", // ID provinsi yang dipilih
    };
  },
  created() {
    this.getProvinces();
    this.getAddress();
  },
  methods: {
    // Fetch current address
    async getAddress() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/address", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        this.address = response.data;
        this.selectedProvince = this.address.provinsi; // Set provinsi terpilih
      } catch (error) {
        console.error("Error fetching address:", error);
        alert("Failed to load address data.");
      }
    },

    // Fetch provinces from API
    async getProvinces() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/provinces");
        this.provinces = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Error fetching provinces:", error);
        alert("Failed to load provinces.");
        this.provinces = [];
      }
    },

    // Update address
    async updateAddress() {
  try {
    // Pastikan ID provinsi terpilih diintegrasikan ke data address
    this.address.provinsi = this.selectedProvince;

    const response = await axios.put(
      "http://127.0.0.1:8000/api/address",
      this.address,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    alert(response.data.message);
    this.$router.push("/profile-customer"); // Kembali ke halaman profil
  } catch (error) {
    console.error("Error updating address:", error.response ? error.response.data : error);
    alert("Failed to update address.");
  }
},


    // Go back to profile page
    goBack() {
      this.$router.push("/profile-customer");
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 10px;
}

.card-body {
  padding: 2rem;
}

button {
  width: 45%;
}

.form-group {
  margin-bottom: 15px;
}
</style>
