<template>
  <div class="log-detail">
    <h1 class="mb-4">Log Details</h1>
    
    <div v-if="log">
      <div class="detail-item">
        <strong>Log ID:</strong>
        <span>{{ log.log_aktivitas_id }}</span>
      </div>
      <div class="detail-item">
        <strong>User ID:</strong>
        <span>{{ log.user.user_id }}</span>
      </div>
      <div class="detail-item">
        <strong>Name:</strong>
        <span>{{ log.user.nama }}</span>
      </div>
      <div class="detail-item">
        <strong>Email:</strong>
        <span>{{ log.user.email }}</span>
      </div>
      <div class="detail-item">
        <strong>Role:</strong>
        <span>{{ log.user.role }}</span>
      </div>
      <div class="detail-item">
        <strong>Activity:</strong>
        <span>{{ log.aktivitas }}</span>
      </div>
      <div class="detail-item">
        <strong>Activity Time:</strong>
        <span>{{ formatTime(log.tgl_aktivitas) }}</span>
      </div>
    </div>
    
    <button class="btn btn-secondary mt-4" @click="goBack">Back</button>
  </div>
</template>

<script>
export default {
  name: "LogDetail",
  data() {
    return {
      log: null, 
    };
  },
  created() {
    this.fetchLogDetail();
  },
  methods: {

    getToken() {
      return localStorage.getItem("token");
    },

    async fetchLogDetail() {
      try {
        const logId = this.$route.params.id;
        const token = this.getToken(); 

        if (!token) {
          alert("No token found. Please log in.");
          return;
        }

        const response = await fetch(`http://127.0.0.1:8000/api/log-detail/${logId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          this.log = data; 
        } else {
          throw new Error("Expected JSON response, but got something else.");
        }
        
      } catch (error) {
        console.error("Error fetching log details:", error);
        alert("Error fetching log details.");
      }
    },

    formatTime(timeString) {
      const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
      return new Date(timeString).toLocaleDateString(undefined, options);
    },

    goBack() {
      this.$router.go(-1); 
    }
  }
};
</script>


<style scoped>
.log-detail {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.detail-item strong {
  color: #333;
}

.detail-item span {
  color: #555;
}

.btn {
  display: block;
  margin: 0 auto;
}
</style>
