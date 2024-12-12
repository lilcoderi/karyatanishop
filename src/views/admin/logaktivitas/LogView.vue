<template>
  <div class="log-view">
    <h1 class="mb-4">Log Activity</h1>

    <!-- <input
      type="text"
      v-model="search.nama"
      class="form-control mb-2"
      placeholder="Search by Name"
    /> -->
    <!-- Form Pencarian -->

    <div class="card shadow mb-4">
      <div class="card-header py-3 d-flex justify-content-between align-items-center">
        <h6 class="table-order m-0 font-weight-bold text-success">Table Log Aktivitas</h6>
  <!-- Bagian Search Form -->
  <div class="search-form">
    <div class="btn-group">
      <!-- Tombol Search dengan ikon yang menyatu dengan input -->
      <input
        type="text"
        v-model="search.aktivitas"
        class="form-control"
        placeholder="Search by Activity"
        aria-label="Search"
      />
      <button @click="searchLogs" class="btn btn-success">
        <i class="bi bi-search"></i>
      </button>
    </div>
  </div>

  <!-- Judul Section -->
  
</div>
      <div class="card-body">
        <div class="table-responsive">
          <!-- Tabel Log Activity -->
          <table class="table table-striped table-bordered" v-if="logs.length > 0">
            <thead class="bg-success text-white">
              <tr>
                <th scope="col">Log ID</th>
                <th scope="col">Name</th>
                <th scope="col">Activity</th>
                <th scope="col">Time</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in logs" :key="log.log_aktivitas_id">
                <td class="text-truncate" style="max-width: 150px;">{{ log.log_aktivitas_id }}</td>
                <td class="text-truncate" style="max-width: 150px;">{{ log.user.nama }}</td>
                <td class="text-truncate" style="max-width: 150px;">{{ log.aktivitas }}</td>
                <td class="text-truncate" style="max-width: 150px;">{{ formatTime(log.tgl_aktivitas) }}</td>
                <td class="text-truncate" style="max-width: 150px;">
                  <button class="btn btn-sm btn-info" @click="viewLog(log.log_aktivitas_id)"><i
                      class="bi bi-eye-fill"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-else>
            <p>No log activity found.</p>
          </div>
          
          <div v-if="error" class="alert alert-danger mt-4">
            Error: {{ error }}
          </div>
        </div>
        <div v-if="pagination" class="pagination-controls btn-group mt-4 mb-5">
          <button class="btn btn-outline-success btn-sm" @click="changePage(pagination.first_page_url)"
            :disabled="!pagination.first_page_url">
            First
          </button>

          <button class="btn btn-outline-success btn-sm" @click="changePage(pagination.prev_page_url)"
            :disabled="!pagination.prev_page_url">
            Previous
          </button>

          <span class="mx-2">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>

          <button class="btn btn-outline-success btn-sm" @click="changePage(pagination.next_page_url)"
            :disabled="!pagination.next_page_url">
            Next
          </button>

          <button class="btn btn-outline-success btn-sm" @click="changePage(pagination.last_page_url)"
            :disabled="!pagination.last_page_url">
            Last
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
  </div>
</template>

<script>
export default {
  name: "LogView",
  data() {
    return {
      logs: [],
      search: {
        nama: '',
        aktivitas: '',
      },
      error: null,
      pagination: null,
    };
  },
  mounted() {
    this.fetchLogs(1);
  },
  methods: {
    getToken() {
      return localStorage.getItem("token");
    },

    async fetchLogs(page = 1) {
      const token = this.getToken();

      if (!token) {
        this.error = "No token found. Please log in.";
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/log-activity?page=${page}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched logs:", data);

        if (data && data.data) {
          this.logs = data.data.map(log => ({
            ...log,
            user: log.user || { nama: "Unknown User" },
          }));

          this.pagination = {
            current_page: data.current_page,
            last_page: data.last_page,
            first_page_url: data.first_page_url,
            prev_page_url: data.prev_page_url,
            next_page_url: data.next_page_url,
            last_page_url: data.last_page_url,
          };
        } else {
          this.error = "Invalid log data format";
        }
      } catch (error) {
        this.error = error.message;
        console.error("Error fetching logs:", error);
      }
    },

    async searchLogs() {
      const token = this.getToken();

      if (!token) {
        this.error = "No token found. Please log in.";
        return;
      }

      const { nama, aktivitas } = this.search;

      try {
        const response = await fetch('http://127.0.0.1:8000/api/log-activity/search', {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nama,
            aktivitas,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Search results:", data);

        if (data && data.data) {
          this.logs = data.data;
          this.pagination = {
            current_page: data.current_page,
            last_page: data.last_page,
            first_page_url: data.first_page_url,
            prev_page_url: data.prev_page_url,
            next_page_url: data.next_page_url,
            last_page_url: data.last_page_url,
          };
        } else {
          this.error = "No results found for your search";
        }
      } catch (error) {
        this.error = error.message;
        console.error("Error searching logs:", error);
      }
    },

    formatTime(timeString) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(timeString).toLocaleDateString(undefined, options);
    },

    viewLog(logId) {
      this.$router.push(`/log-detail/${logId}`);
    },

    changePage(pageUrl) {
      if (pageUrl) {
        const pageNumber = new URL(pageUrl).searchParams.get("page");
        if (pageNumber) {
          this.fetchLogs(pageNumber);
        }
      }
    }
  },
};
</script>


<style scoped>
.log-view {
  padding: 20px;
}
input{
  border-radius: 10px 0 0 10px;
}

button{
  border-radius: 0 10px 10px 0;
}

/* .search-form{
  margin-top: 5px;
} */

h1 {
  text-align: center;
}
</style>
