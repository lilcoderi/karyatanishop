<template>
  <div class="report-filter-view container">
  <!-- Header Section -->
  <div class="text-center mb-4">
    <h1 class="text-dark">Filter Report by Date</h1>
    <p class="text-muted">Lihat laporan berdasarkan rentang tanggal yang ditentukan</p>
  </div>

  <!-- Card Section untuk Total Sales, Orders, Payment Information -->
  <div class="row gx-3 gy-2 mb-4">
    <div class="col-md-4">
      <div class="card shadow-sm h-100">
        <div class="card-body text-center">
          <h5 class="text-success">Total Sales</h5>
          <h3 class="text-dark">{{ report.total_sales }}</h3>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card shadow-sm h-100">
        <div class="card-body text-center">
          <h5 class="text-info">Total Orders</h5>
          <h3 class="text-dark">{{ report.total_orders }}</h3>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card shadow-sm h-100">
        <div class="card-body text-center">
          <h5 class="text-warning">Total Payment</h5>
          <h3 class="text-dark">{{ report.total_payment }}</h3>
        </div>
      </div>
    </div>
  </div>

  <!-- Card untuk Menampilkan Rentang Tanggal -->
  <div class="card mb-4 shadow-sm">
    <div class="card-body">
      <h5 class="text-primary">Report Date Range</h5>
      <div class="d-flex justify-content-between">
        <p><strong>Start Date:</strong> {{ startDate }}</p>
        <p><strong>End Date:</strong> {{ endDate }}</p>
      </div>
    </div>
  </div>

  <!-- Tombol Kembali -->
  <div class="text-center mt-4">
    <button @click="goBack" class="btn btn-secondary">Back</button>
  </div>
</div>

</template>

<script>
export default {
  name: "ReportFilterView",
  data() {
    return {
      report: {
        total_sales: 0,
        total_orders: 0,
        total_payment: 0,
      },
      startDate: this.$route.query.start,
      endDate: this.$route.query.end,
    };
  },
  mounted() {
    const reportData = JSON.parse(this.$route.query.report);
    this.report.total_sales = reportData.total_sales;
    this.report.total_orders = reportData.total_orders;
    this.report.total_payment = reportData.total_payment;
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.report-filter-view {
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

h5 {
  font-size: 1.25rem;
}

span {
  font-weight: bold;
  color: #333;
}

button {
  width: 200px;
  margin-top: 20px;
}

.text-center {
  text-align: center;
}
</style>
