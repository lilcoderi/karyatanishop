<template>
  <NavbarView :cartItemCount="cartItemCount" />

  <div class="container mt-3">
      <div class="row">
        <!-- Cart Items -->
        <div class="col-lg-5 mb-4">
          <div class="card">
            <div class="card-header bg-info text-white">
              <h5 class="mb-0">My Profile</h5>
            </div>
            <div class="card-body">
              <div class="mb-4">
              <img 
                :src="user.foto || 'https://via.placeholder.com/150'" 
                alt="Profile Picture" 
                class="rounded-circle" 
                width="150"
                height="150"
              />
            </div>
            <h4 class="card-title">{{ user.nama }}</h4>
            <p class="card-text">
              <strong>Email : </strong>{{ user.email }}</p>
            <p class="card-text">
              <strong>Phone : </strong> {{ user.no_tlp || 'Not provided' }}
            </p>
            <p class="card-text">
              <strong>Status : </strong> 
              <span :class="user.is_verified ? 'text-white badge badge-success' : 'text-danger'">
                {{ user.is_verified ? 'Verified' : 'Not Verified' }}
              </span>
            </p>
            
            <p class="card-text">
              <small class="text-muted">Member since: {{ formattedCreatedAt }}</small>
            </p>
            <div class="btn-group mt-4">
              <button class="btn btn-info" @click="editProfile">Edit Profile</button>
              <button class="btn btn-danger" @click="goBack">Back</button>
            </div>
            </div>
          </div>
        </div>
        <div class="col-lg-7 mb-5">
          <div class="card">
            <div class="card-header bg-warning text-white">
              <h5 class="mb-0">Address</h5>
            </div>
            <div class="card-body">
              <div class="mt-4">
              <div class="d-flex justify-content-between align-items-center">
                <small class="font-weight-bold">Alamat</small>
                <small>{{ address.alamat || 'Not provided' }}</small>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <small class="font-weight-bold">Kota</small>
                <small>{{ address.kota || 'Not provided' }}</small>
              </div>
              <div class="d-flex justify-content-between align-items-center">
  <small class="font-weight-bold">Provinsi</small>
  <small>{{ address.provinsi || 'Not provided' }}</small>
</div>

              <div class="d-flex justify-content-between align-items-center">
                <small class="font-weight-bold">Kecamatan</small>
                <small>{{ address.kecamatan || 'Not provided' }}</small>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <small class="font-weight-bold">Kelurahan</small>
                <small>{{ address.kelurahan || 'Not provided' }}</small>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <small class="font-weight-bold">Kode Pos</small>
                <small>{{ address.kode_pos || 'Not provided' }}</small>
              </div>
              <button class="btn btn-info" @click="editAddress">Edit Address</button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="text-center my-5">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden"></span>
        </div>
      </div>
  
        <!-- Order Details -->
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
  name: "KasirProfile",
  data() {
    return {
      user: {
        user_id: "",
        nama: "",
        email: "",
        no_tlp: null,
        is_verified: 0,
        status: 0,
        foto: null,
        created_at: "",
        updated_at: "",
        deleted_at: null,
      },
      address: {
        alamat: "",
        kota: "",
        provinsi: "",
        kecamatan: "",
        kelurahan: "",
        kode_pos: "",
      },
    };
  },
  computed: {
    formattedCreatedAt() {
      const date = new Date(this.user.created_at);
      return date.toLocaleDateString();
    },
  },
  created() {
    this.getUserProfile();
    this.getUserAddress();
  },
  methods: {
    async getUserProfile() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const userData = response.data;

        // Perbarui path foto hanya jika belum berupa URL penuh
        if (userData.foto && !userData.foto.startsWith("http")) {
          userData.foto = `http://127.0.0.1:8000/${userData.foto}`;
        }

        this.user = userData;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        alert("Failed to load profile data.");
      }
    },
    async getUserAddress() {
  try {
    const [addressResponse, provincesResponse] = await Promise.all([
      axios.get("http://127.0.0.1:8000/api/address", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }),
      axios.get("http://127.0.0.1:8000/api/provinces"),
    ]);

    const addressData = addressResponse.data;
    const provincesData = provincesResponse.data;

    // Debugging: Log API responses
    console.log("Address Data:", addressData);
    console.log("Provinces Data:", provincesData);

    // Konversi tipe data ke integer untuk memastikan kesesuaian
    const province = provincesData.find(prov => parseInt(prov.id) === parseInt(addressData.provinsi));

    this.address = {
      ...addressData,
      provinsi: province ? province.text : `Province with ID ${addressData.provinsi} not found`,
    };
  } catch (error) {
    console.error("Error fetching address or provinces:", error);
    alert("Failed to load address or province data.");
  }
},


    editProfile() {
      this.$router.push("/profile-customer-edit");
    },
    goBack() {
      this.$router.push("/home");
    },
    editAddress() {
      this.$router.push("/address-edit");
    },
  },
};
</script>

<style scoped>
.container{
  font-family: "Nunito";
}

.card-header {
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.card-body {
  padding: 2rem;
}

</style>
