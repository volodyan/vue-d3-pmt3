<template>
  <div class="poumiantud3">
    <div ref="d3box" class="d3box"></div>
  </div>
</template>
<script>
import Bus from "@/utils/bus.js";
import { mapGetters } from "vuex";
import AxiosUrl from "@/middleware/services/AxiosUrl";
import * as d3 from "d3";
import html2canvas from "html2canvas";
export default {
  name: "poumiantud3",
  props: {
    infoData: {
      type: Object,
      default: {},
    },
    DTinfoData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      fps: 30,
      pause: false,
      now: null,
      then: Date.now(),
      delta: null,
      draw: null,
      /*  */
      requestAnimationFrameVAl: null,
      DongTaiDrawData: null,
    };
  },

  // 销毁前取消动画
  beforeDestroy() {
    cancelAnimationFrame(this.requestAnimationFrameVAl);
  },
  methods: {
    //导出图片
    d3downloadable() {
      var serializer = new XMLSerializer();
      var source = serializer.serializeToString(d3.selectAll(".My_svg").node());
      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
      var url =
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
      var canvas = document.createElement("canvas");
      canvas.width = this.infoData?.width;
      canvas.height = this.infoData?.height;
      var context = canvas.getContext("2d");
      var image = new Image();
      image.src = url;
      image.onload = function () {
        context.drawImage(image, 0, 0);
        var a = document.createElement("a");
        document.body.appendChild(a);
        a.download = "剖面图" + ".jpg";
        a.href = canvas.toDataURL("image/png");
        a.click();
        document.body.removeChild(a);
      };
    },

    //清除d3图形
    cancelD3fun() {
      //画图之前清除之前图形
      d3.selectAll(".My_svg").remove();
    },
    /* 结束动画 */
    Endefun() {
      this.pause = true;
    },
    /* 暂停播放动画开始 */
    pausefun() {
      this.pause = !this.pause;
      if (!this.pause) {
        Bus.$emit("pauseDHfunTo", true);
        this.tick();
      } else {
        Bus.$emit("pauseDHfunTo", false);
      }
    },
    /* 暂停动画结束 */
    tick() {
      var interval = 6000 / this.fps;
      window.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;
      if (this.pause) return;
      if (window.requestAnimationFrame) {
        this.requestAnimationFrameVAl = requestAnimationFrame(this.tick);
        this.now = Date.now();
        this.delta = this.now - this.then;
        if (this.delta > interval) {
          // 这里不能简单then=now,否则还会出现上边简单做法的细微时间差问题。例如fps=10,每帧100ms,而现在每16ms（30fps）执行一次draw。16*7=112>100,需要7次才实际绘制一次。这个情况下,实际10帧需要112*10=1120ms>1000ms才绘制完成。
          this.then = this.now - (this.delta % interval);
          this.DongTaiDraw(); // ... Code for Drawing the Frame ...
        }
      } else {
        setTimeout(this.tick, interval);
        this.DongTaiDraw();
      }
    },
    calculatePath() {
      //数据
      let datasetGround = this.infoData.datasetGround;
      let datasetPipe = this.infoData.datasetPipe;

      /*  */
      let scaleDatasetErWei = [];
      this.infoData.datasetGround.map((ele) => {
        scaleDatasetErWei.push(ele.data);
      });
      this.infoData.datasetPipe.map((ele) => {
        scaleDatasetErWei.push(ele.data);
      });

      let scaleDatasetX = [];
      let scaleDatasetY = [];
      scaleDatasetErWei.flat(1).map((ele) => {
        scaleDatasetX.push(ele[0]);
        scaleDatasetY.push(ele[1]);
      });
      //console.log("scaleDatasetX", scaleDatasetX);
      //console.log("scaleDatasetY", scaleDatasetY);
      /*  */
      //设置宽高
      var width = this.infoData?.width;
      var height = this.infoData?.height;
      //d3初始化svg容器
      let svg = d3
        .select(this.$refs.d3box)
        .append("svg")
        .attr("class", "My_svg")
        .attr("width", width)
        .attr("height", height * 1.3)
        .attr("viewBox", [0, 0, width, height]);

      var linearX = d3
        .scaleLinear()
        // .domain([0, d3.max(scaleDatasetX)])
        // .range([0, width * 0.98]);
        .domain([this.infoData.Min, this.infoData.Max])
        //.range([height * 0.6, 0]);
        .range([0, height * 1])
        .nice();
      var linearY = d3
        .scaleLinear()
        // .domain([0, d3.max(scaleDatasetY)])
        .domain([this.infoData.Min, this.infoData.Max])
        //.range([height * 0.6, 0]);
        .range([height * 1, 0])
        .nice();
      /**************************************** */
      /************************** */

      //画X,Y坐标轴

      var xScale3 = d3
        .scaleLinear()
        // .domain([0, d3.max(scaleDatasetX)])
        // .range([0, width * 1])
        .domain([
          /* d3.max(scaleDatasetY)  */
          this.infoData.Min,
          this.infoData.Max * 1.002,
        ])
        // .range([0, height * 0.65])
        .range([0, height * 1.002])
        .nice();
      var linear_axisY = d3
        .scaleLinear()
        .domain([
          /* d3.max(scaleDatasetY)  */ this.infoData.Max * 1.002,
          this.infoData.Min,
        ])
        // .range([0, height * 0.65])
        .range([0, height * 1.002])
        .nice();
      var axisX = d3
        .axisBottom()
        .scale(xScale3) //指定比例尺
        .ticks(22); //指定刻度的数量

      var axisY = d3
        .axisLeft()
        .scale(linear_axisY) //指定比例尺
        .ticks(20) //指定刻度的数量
        .tickSize(-width);

      svg
        .append("g")
        .attr("class", "axisX")
        .attr("transform", `translate(30, ${height * 1})`)
        .call(axisX)
        .call((g) =>
          g
            .select(".domain")
            .attr("class", "axisX_MydomainPathStyle")
            .attr("stroke-width", 0.5)
            .attr("stroke", "#444D")
        )
        .call((g) =>
          g
            .selectAll(".tick")
            .selectAll("line")
            .attr("class", "axisX_MyTickLineStyle")
            .attr("stroke-width", 0.5)
            .attr("stroke", "#444D")
        )
        .call((g) =>
          g
            .selectAll(".tick")
            .selectAll("text")
            .attr("class", "axisX_MyTextStyle")
            .attr("stroke", "#E1E1E1")
            .attr("stroke-width", 0.5)
        );
      svg
        .append("g")
        .attr("class", "axisY")
        .attr("transform", `translate(30, ${height * 0.005})`)
        .call(axisY)
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .selectAll(".tick")
            .selectAll("line")
            .attr("class", "axisY_MyTickLineStyle")
            .attr("stroke-dasharray", 5)
            .attr("stroke-width", 0.5)
            .attr("stroke-linecap", "round")
            .attr("stroke-opacity", (d) => (d === -2 ? 1 : 1))
            .attr("stroke", "#444D")
        )
        .call((g) =>
          g
            .selectAll(".tick")
            .selectAll("text")
            .attr("class", "axisY_MyTextStyle")
            .attr("stroke", "#E1E1E1")
            .attr("stroke-width", 0.5)
        );
      // //初始化地面高程
      // datasetGround.map((ele, index) => {
      //   svg
      //     .append("polygon")
      //     .attr(
      //       "points",
      //       ele.data.map((ele, index) => {
      //         ////console.log(ele);
      //         let newEle = [];
      //         newEle.push(linearX(ele[0]), linearY(ele[1]));
      //         ////console.log(newEle);
      //         return newEle;
      //       })
      //     )
      //     .attr("stroke", "#9a866a")
      //     .attr("stroke-width", 1)
      //     .attr("fill", "#9a866a")
      //     .attr("transform", `translate(30, ${height * 0})`)
      //     .on("mouseover", (d) => {
      //       console.log("mouseover", d);

      //     })
      //     .on("mouseout", (d) => {});

      //   //(3)移除提示条SVG
      // });

      console.log(
        "Xmax,Ymin,Ymax",
        d3.max(scaleDatasetX),
        this.infoData.Min,
        this.infoData.Max
      );

      //循环画多边形--//画管道
      datasetPipe.map((ele, index) => {
        /* ********颜色渐变开始*********** */
        //渐变坐标算法
        //<1>斜率K
        let K =
          (linearY(ele.data[1][1]) - linearY(ele.data[0][1])) /
          (linearX(ele.data[1][0]) - linearX(ele.data[0][0]));
        let x1 = linearX(ele.data[2][0]);
        let y1 = linearY(ele.data[2][1]);
        // let K =
        //   (ele.data[1][1] - ele.data[0][1]) / (ele.data[1][0] - ele.data[0][0]);
        // let x1 = ele.data[2][0];
        // let y1 = ele.data[2][1];

        //  console.log("BB", BB);
        //<2>x2,y2
        let x2 =
          (Math.pow(K, 2) * linearX(ele.data[0][0]) -
            K * linearY(ele.data[0][1]) +
            x1 +
            K * y1) /
          (Math.pow(K, 2) + 1);
        let y2 = K * (x2 - linearX(ele.data[0][0])) + linearY(ele.data[0][1]);
        // let x2 =
        //   (Math.pow(K, 2) * ele.data[0][0] - K * ele.data[0][1] + x1 + K * y1) /
        //   (Math.pow(K, 2) + 1);
        // let y2 = K * (x2 - ele.data[0][0]) + ele.data[0][1];
        // 颜色线性渐变
        let datasetPipe_defs = svg.append("g").append("defs");
        let datasetPipe_linearGradient = datasetPipe_defs
          .append("linearGradient")
          .attr("id", `datasetPipe_linearColor${index}`)
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", `${x1}`)
          .attr("y1", `${y1}`)
          .attr("x2", `${x2}`)
          .attr("y2", `${y2}`);

        datasetPipe_linearGradient
          .append("stop")
          .attr("offset", "0")
          .style("stop-color", "gray")
          .style("stop-opacity", "1");

        datasetPipe_linearGradient
          .append("stop")
          .attr("offset", "0.5")
          .style("stop-color", "#fff")
          .style("stop-opacity", "1");

        datasetPipe_linearGradient
          .append("stop")
          .attr("offset", "1")
          .style("stop-color", "gray")
          .style("stop-opacity", "1");
        // 颜色线性渐变

        /* ********颜色渐变结束*********** */
        svg
          .append("polygon")
          .attr(
            "points",
            ele.data.map((ele, index) => {
              let newEle = [];
              newEle.push(linearX(ele[0]), linearY(ele[1]));
              return newEle;
            })
          )
          .style("fill", "url(#" + datasetPipe_linearGradient.attr("id") + ")")
          // .style("filter", "url(#pic2)")
          // .attr("filter", "url(#brightness)")
          .style("fill-opacity", "1")
          .attr("transform", `translate(30, ${height * 0})`);
      });
    },
    CancelDongTaiDraw() {
      //画动态图之前清除之前图形
      d3.selectAll(".DongTaiDrawClass").remove();
    },
    //重播
    AginPalyResetDongTaiDraw() {
      this.pause = false;
      this.tick();
    },
    //上一帧&&下一帧
    LastNextAginPalyResetDongTaiDraw() {
      this.DongTaiDraw();
    },
  },
};
</script>
<style lang="scss" scoped>
.poumiantud3 {
  width: 100%;
  margin: 20px 0;
  .d3box {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    width: 100%;
  }
}
</style>
