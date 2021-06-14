<template>
  <div class="home">
    <el-date-picker
      v-model="value1"
      type="daterange"
      placeholder="开始日期"
      :picker-options="pickerOptions0"
      @change="Datefun"
      :clearable="false"
       format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
    >
    </el-date-picker>

    <HomePage />
  </div>
</template>

<script>
// @ is an alias to /src
import HomePage from "@/pages/HomePage/index";

export default {
  name: "Home",
  components: {
    HomePage,
  },
  data() {
    return {
      value1: [this.$moment(new Date()).subtract(1, "days").format("YYYY-MM-DD"),this.$moment(new Date()).format("YYYY-MM-DD")],
      pickerOptions0: {
        disabledDate: (time) => {
          let curDatelastoneday = new Date().getTime() - 24 * 3600 * 1000;
          let twoMonths =
            this.$moment(new Date()).subtract(2, "months").valueOf() -
            24 * 3600 * 1000 * 2;
          return (
            time.getTime() > curDatelastoneday || time.getTime() < twoMonths
          );
        },
      },
    };
  },
  methods: {
    Datefun(val) {
      // let TimeArray = [];
      // val.map((ele) => {
      //   TimeArray.push(this.$moment(ele).format("YYYY-MM-DD"));
      // });
      console.log("TimeArray", val);
    },
  },
};
</script>
