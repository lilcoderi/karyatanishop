<template>
    <div class="report-all">
      <h1 class="mb-4">All Report</h1>
  
      <table class="table table-striped table-bordered" v-if="report">
        <thead class="bg-success text-white">
          <tr>
            <th>Total Sales</th>
            <th>Total Orders</th>
            <th>Total Payment</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ report.total_sales }}</td>
            <td>{{ report.total_orders }}</td>
            <td>Rp{{ formatCurrency(report.total_payment) }}</td>
            <td>{{ formatDate(report.created_at) }}</td>
          </tr>
        </tbody>
      </table>
  
      <!-- Loading and Error Handling -->
      <p v-else-if="isLoading">Loading report data...</p>
      <p v-else-if="error" class="text-danger">{{ error }}</p>
  
      <!-- Back Button -->
      <div class="text-center">
        <button class="btn btn-danger rounded" @click="goBack">Back</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ReportAll",
    data() {
      return {
        report: null, 
        isLoading: true, 
        error: null, 
      };
    },
    methods: {
      getToken() {
        return localStorage.getItem("jwt_token"); 
      },
  
      async fetchReport() {
        const token = localStorage.getItem("token"); 
  
        if (!token) {
          this.error = "You are not authenticated. Please log in.";
          this.isLoading = false;
          return;
        }
  
        try {
          const response = await fetch("http://127.0.0.1:8000/api/report", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, 

            },
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
  
          const data = await response.json();
          console.log("Fetched report:", data);  
  
          if (data.report) {
            this.report = data.report;
          } else {
            this.error = "Failed to fetch report.";
          }
        } catch (error) {
          this.error = error.message;
          console.error("Error fetching report:", error);
        } finally {
          this.isLoading = false;
        }
      },
  
      formatCurrency(value) {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(value);
      },
  
      formatDate(dateString) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString("id-ID", options);
      },
  
      goBack() {
        this.$router.push("/report-view");
      },
    },
    mounted() {
      this.fetchReport(); 
    },
  };
  </script>
  
  <style scoped>
  .report-all {
    padding: 20px;
  }
  
  .table {
    width: 100%;
    margin-top: 20px;
    text-align: center;
  }
  
  .text-danger {
    color: red;
  }
  
  .btn {
    margin-top: 20px;
  }
  </style>
  