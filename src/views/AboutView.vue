<template>
  <div class="about">
    <h1 id="dashboard-title" class="text-center mb-4">{{ dynamicTitle }}</h1>
    <h1>This is an about page</h1>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dynamicTitle: "", // Judul dinamis
    };
  },
  methods: {
    getFormattedDate() {
      const today = new Date();
      const options = { year: "numeric", month: "long", day: "numeric" };
      return today.toLocaleDateString("en-US", options); // Format tanggal
    },
  },
  mounted() {
    // Atur judul dinamis saat komponen dimuat
    this.dynamicTitle = `Sales on ${this.getFormattedDate()}`;
  },
};
</script>
