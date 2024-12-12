<template>
  <div class="report-filter">
    <h1 class="mb-4">Filter Report by Date</h1>

    <!-- Form for date range selection -->
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <form @submit.prevent="viewReport">
          <div class="form-group">
            <label for="start-date">Start Date</label>
            <input
              type="date"
              id="start-date"
              v-model="startDate"
              class="form-control"
              required
            />
          </div>
          <div class="form-group mt-3">
            <label for="end-date">End Date</label>
            <input
              type="date"
              id="end-date"
              v-model="endDate"
              class="form-control"
              required
            />
          </div>

          <div class="text-center btn-group mt-4">
            <button type="submit" class="btn btn-success">View Report</button>
            <button class="btn btn-secondary" @click="goBack">Back</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReportFilter",
  data() {
    return {
      startDate: "", 
      endDate: "",   
    };
  },
  methods: {
    async viewReport() {
      if (this.startDate && this.endDate) {
        try {
          const token = localStorage.getItem('token'); 

          const response = await fetch('http://127.0.0.1:8000/api/report', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`, 
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              start_date: this.startDate,
              end_date: this.endDate,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch report data');
          }

          const data = await response.json();

          this.$router.push({
            name: "report-filter-view",
            query: { start: this.startDate, end: this.endDate, report: JSON.stringify(data.report) },
          });
        } catch (error) {
          alert("An error occurred while fetching the report.");
          console.error("Error:", error);
        }
      } else {
        alert("Please select both start and end dates.");
      }
    },
  },
};
</script>

<style scoped>
.report-filter {
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

.form-group label {
  font-size: 1rem;
  font-weight: bold;
}

.form-control {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
}

button {
  width: 200px;
  margin-top: 20px;
}

.text-center {
  text-align: center;
}
</style>
