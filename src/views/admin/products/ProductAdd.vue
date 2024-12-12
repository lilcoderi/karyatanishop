<template>
  <div class="container">
    <div class="card o-hidden border-0 shadow-lg">
      <div class="card-body p-0">
        <!-- Nested Row within Card Body -->
        <div>
          <div>
            <div class="p-5">
              <div class="text-center">
                <h1 class="h4 text-gray-900 mb-4">Add Product</h1>
              </div>
              <form class="user" @submit.prevent="submitProduct">
                <div class="form-group row">
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <input
                      type="text"
                      v-model="form.nama_produk"
                      id="nama_produk"
                      class="form-control"
                      placeholder="Nama Produk"
                      required
                    />
                  </div>
                  <div class="col-sm-6">
                    <input
                      type="text"
                      v-model="form.merk"
                      id="merk"
                      class="form-control"
                      placeholder="Merk"
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <label for="kategori_id">Kategori</label>
                    <select
                      v-model="form.kategori_id"
                      id="kategori_id"
                      class="form-control"
                      required
                    >
                      <option value="" disabled>Select Category</option>
                      <option
                        v-for="category in categories"
                        :key="category.kategori_id"
                        :value="category.kategori_id"
                      >
                        {{ category.nama_kategori }}
                      </option>
                    </select>
                  </div>
                  <div class="col-sm-6">
                    <label for="berat">Berat (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      v-model="form.berat"
                      id="berat"
                      class="form-control"
                      required
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <label for="harga_satuan">Harga Satuan</label>
                    <input
                      type="number"
                      v-model="form.harga_satuan"
                      id="harga_satuan"
                      class="form-control"
                      required
                    />
                  </div>
                  <div class="col-sm-6">
                    <label for="stok">Stok</label>
                    <input
                      type="number"
                      v-model="form.stok"
                      id="stok"
                      class="form-control"
                      required
                    />
                  </div>
                </div>
                <div class="form-group row">
                  <div class="col-sm-6 mb-3 mb-sm-0">
                    <label for="status_produk">Status Produk</label>
                    <select
                      v-model="form.status_produk"
                      id="status_produk"
                      class="form-control"
                      required
                    >
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Nonaktif</option>
                    </select>
                  </div>
                  <div class="col-sm-6">
                    <label for="promo_id">Promo</label>
                    <select
                      v-model="form.promo_id"
                      id="promo_id"
                      class="form-control"
                    >
                      <option value="">No Promo</option>
                      <option
                        v-for="promo in promos"
                        :key="promo.promo_id"
                        :value="promo.promo_id"
                      >
                        {{ promo.nama_promo }} - {{ promo.nilai_promo }}%
                      </option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label for="deskripsi_produk">Deskripsi</label>
                  <textarea
                    v-model="form.deskripsi_produk"
                    id="deskripsi_produk"
                    class="form-control"
                  ></textarea>
                </div>
                <div class="custom-file mb-3">
                  <input
                    type="file"
                    class="custom-file-input"
                    @change="onFileChange"
                    id="customFile"
                  />
                  <label class="custom-file-label" for="customFile"
                    >Pilih Gambar</label
                  >
                </div>
                <button type="submit" class="btn btn-success btn-user">
                  Add Product
                </button>
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
      form: {
        kategori_id: null,
        nama_produk: "",
        merk: "",
        deskripsi_produk: "",
        berat: "",
        harga_satuan: "",
        stok: "",
        status_produk: "aktif",
        promo_id: null,
        gambar: null,
      },
      categories: [],
      promos: [],
    };
  },
  methods: {
    async fetchAllCategories() {
      let currentPage = 1;
      let lastPage = 1;
      let hasError = false;
      this.categories = [];

      do {
        await axios
          .get(`http://127.0.0.1:8000/api/categories?page=${currentPage}`)
          .then((response) => {
            this.categories.push(...response.data.data);
            lastPage = response.data.last_page;
            currentPage++;
          })
          .catch((error) => {
            console.error("Error fetching categories:", error);
            hasError = true;
          });
      } while (currentPage <= lastPage && !hasError);
    },
    async fetchAllPromos() {
      let currentPage = 1;
      let lastPage = 1;
      let hasError = false;
      this.promos = [];

      do {
        await axios
          .get(`http://127.0.0.1:8000/api/promo?page=${currentPage}`)
          .then((response) => {
            this.promos.push(...response.data.data);
            lastPage = response.data.last_page;
            currentPage++;
          })
          .catch((error) => {
            console.error("Error fetching promos:", error);
            hasError = true;
          });
      } while (currentPage <= lastPage && !hasError);
    },
    onFileChange(event) {
      this.form.gambar = event.target.files[0];
    },
    submitProduct() {
      const formData = new FormData();
      Object.keys(this.form).forEach((key) => {
        formData.append(key, this.form[key]);
      });

      axios
        .post("http://127.0.0.1:8000/api/products", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          alert("Product added successfully!");
          this.$router.push("/products");
        })
        .catch((error) => {
          console.error("Error adding product:", error);
          if (error.response && error.response.data.errors) {
            alert(JSON.stringify(error.response.data.errors));
          } else {
            alert("Failed to add product.");
          }
        });
    },
  },
  mounted() {
    this.fetchAllCategories();
    this.fetchAllPromos();
  },
};
</script>

<style scoped>
.custom-file {
  text-align: left;
}
</style>
