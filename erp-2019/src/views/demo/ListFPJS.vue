<template>
  <section>ListFPJS</section>
</template>

<script>
// FP javascript
export default {
  name: "ListFPJS",
  data() {
    return {};
  },
  computed: {},
  watch: {},
  mounted() {
    const sum = (a, b) => a + b;
    console.log(sum(3, sum(5, 8)));
    console.log(`函数式的加法计算`, sum(1, sum(2, sum(3, 4))));

    let students = [
      { name: "Asura", grade: 6 },
      { name: "Satya", grade: 4 },
      { name: "Shakya", grade: 9 }
    ];

    const isApproved = student => student.grade >= 6;
    const byName = obj => obj.name;
    console.log(students.filter(isApproved).map(byName));

    this.reveseObject();
  },
  methods: {
    // 键值对列表转换为一个对象。Object.entries()的反函数
    reveseObject() {
      const entries = Object.entries(
        this.$store.getters.labels.Vendor.formLabels
      );
      console.log("对象的键值对数组:", entries);
      // 反转
      console.log("反转为对象:", Object.fromEntries(entries));
    }
  }
};
</script>
