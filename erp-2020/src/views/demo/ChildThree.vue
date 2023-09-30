<template>
  <section>
    <h1>ChildThree</h1>
    <div>{{demoTest}}</div>
  </section>
</template>

<script>
export default {
  name: "ChildThree",
  data() {
    return {
      demoTest: ""
    };
  },
  mounted() {
    console.log("路径：", location.pathname.replace(/^\/|\/$/g, ""));
    /** 面包屑 */
    let s = "";
    let arr = location.pathname.replace(/^\/|\/$/g, "");
    console.log("ARR:", arr);
    if (arr != "") {
      (arr = arr.split("/")), (s = "");
      for (var i = 0, j = arr.length; i < j; i++) {
        if (i == j - 1) s += arr[i];
        else {
          s +=
            '<a href="/' +
            arr.slice(0, i + 1).join("/") +
            '">' +
            arr[i] +
            "</a> / ";
        }
      }
    }
    console.log(s);
    this.demoTest = s;



    // console.log(myUrl.host);
    // console.log(myUrl.path);
    // console.log(myUrl.search);
  },
};
</script>
