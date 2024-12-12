<template>
  <div class="report-view">
    <h1 class="mb-4">Report</h1>

    <div class="row">
      <!-- Card 1: Get All Report -->
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <i class="fas fa-file-alt fa-3x mb-3"></i>
            <h5 class="card-title">Get Today Report</h5>
            <p class="card-text">View all sales report</p>
            <button class="btn btn-primary" @click="getAllReports">View All</button>
          </div>
        </div>
      </div>

      <!-- Card 2: Filter Report by Date -->
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <i class="fas fa-calendar-alt fa-3x mb-3"></i>
            <h5 class="card-title">Filter Report by Date</h5>
            <p class="card-text">Filter reports by a date range.</p>
            <button class="btn btn-secondary" @click="filterReportByDate">Filter</button>
          </div>
        </div>
      </div>

      <!-- Card 3: Get Offline Report -->
      <div class="col-md-4 mb-4">
        <div class="card shadow-sm">
          <div class="card-body text-center">
            <i class="fas fa-download fa-3x mb-3"></i>
            <h5 class="card-title">Get Offline Report</h5>
            <p class="card-text">Generate offline sales reports.</p>
            <button class="btn btn-success" @click="getOfflineReport">Offline Report</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReportView",
  methods: {
    getAllReports() {
      this.$router.push("/report-all");
    },
    filterReportByDate() {
      this.$router.push("/report-filter");
    },
    getOfflineReport() {
      this.$router.push("/report-offline");
    },
  },
};
</script>

<style scoped>
.report-view {
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.card-text {
  margin-bottom: 20px;
}

button {
  width: 100%;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.fa-3x {
  font-size: 3rem;
}
</style>
