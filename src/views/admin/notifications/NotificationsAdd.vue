<template>
  <div class="notifications-add d-flex justify-content-center align-items-center">
  <div class="card shadow mb-4 col-md-8 p-2">
    <div class="card-header py-3">
      <h6 class="m-0 font-weight-bold text-success">Message</h6>
    </div>
    <div class="card-body">
      <!-- Form to Add Notification -->
      <form @submit.prevent="submitNotification">
        <div class="form-group">
          <textarea
            id="message"
            v-model="message"
            class="form-control"
            placeholder="Enter notification message"
            required
          ></textarea>
        </div>
        <div class="btn-group">
          <button type="submit" class="btn btn-success">Send Notification</button>
          <!-- Back Button -->
          <button class="btn btn-secondary" @click="goBack">Back</button>
        </div>
      </form>
    </div>
  </div>
</div>

</template>

<script>
import axios from "axios";

export default {
  name: "NotificationsAdd",
  data() {
    return {
      message: "",
      responseMessage: null,
      responseClass: "",
    };
  },
  methods: {
    async submitNotification() {
      const token = localStorage.getItem("token");
      if (!token) {
        this.responseMessage = "You are not authenticated. Please log in.";
        this.responseClass = "error";
        return;
      }

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/notifications",
          { message: this.message },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        this.responseMessage = response.data.message || "Notification sent successfully.";
        this.responseClass = "success";
        this.message = "";

        this.$router.push("/notif-view");
      } catch (error) {
        console.error("Error sending notification:", error);
        this.responseMessage =
          error.response?.data?.message || "An error occurred while sending the notification.";
        this.responseClass = "error";
      }
    },

    goBack() {
      this.$router.push("/notif-view");
    },
  },
};
</script>

<style scoped>

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-size: 16px;
  font-weight: 500;
}

.form-group textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.response-message {
  margin-top: 15px;
  font-size: 16px;
}

.response-message.success {
  color: green;
}

.response-message.error {
  color: red;
}
</style>
