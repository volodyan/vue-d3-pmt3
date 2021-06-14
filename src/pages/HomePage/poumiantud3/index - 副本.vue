<template>
  <div class="poumiantud3">
    <div ref="d3box" class="d3box"></div>
    <div class="Ztbox">
      <el-button type="primary" plain @click="pausefun">暂停动画</el-button>
    </div>
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
      default: {
        width: 1820,
        height: 237,
        padding: 30,
        datasetGround: [
          {
            data: [
              [0, 0],
              [40.8, 0],
              [40.8, 4.07],
              [0, 4.06],
            ],
          },
          {
            data: [
              [40.8, 0],
              [76.8, 0],
              [76.8, 4.08],
              [40.8, 4.07],
            ],
          },
        ],
        datasetPipe: [
          {
            data: [
              [1, 1.75],
              [40.8, 1.77],
              [40.8, 2.07],
              [1, 2.05],
            ],
          },
          {
            data: [
              [40.8, 1.77],
              [76.8, 1.94],
              [76.8, 2.24],
              [40.8, 2.07],
            ],
          },
        ],
        datasetWell: [
          {
            data: [
              [0, 1.65],
              [2, 1.65],
              [2, 4.06],
              [0, 4.06],
            ],
          },
          {
            data: [
              [39.8, 1.67],
              [41.8, 1.67],
              [41.8, 4.07],
              [39.8, 4.07],
            ],
          },
          {
            data: [
              [75.8, 1.84],
              [77.8, 1.84],
              [77.8, 4.08],
              [75.8, 4.08],
            ],
          },
        ],
      },
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
      showdata: 0,
      Initdata: 10,
      DongTaiDrawData: null,
    };
  },
  mounted() {
    //this.calculatePath();
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
    /* 暂停动画开始 */
    pausefun() {
      this.pause = !this.pause;
      if (!this.pause) {
        this.tick();
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
      let datasetWell = this.infoData.datasetWell;
      /*  */
      let scaleDatasetErWei = [];
      this.infoData.datasetGround.map((ele) => {
        scaleDatasetErWei.push(ele.data);
      });
      this.infoData.datasetPipe.map((ele) => {
        scaleDatasetErWei.push(ele.data);
      });
      this.infoData.datasetWell.map((ele) => {
        scaleDatasetErWei.push(ele.data);
      });
      //console.log("scaleDatasetErWei", scaleDatasetErWei.flat(1));
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
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height]);

      const tooltip = svg.append("g").attr("class", "My_tootip_G"); //添加tootip组
      /**
         * 比例尺这个方法在V3 V4 版本中方法被规范了,
         * V3 中是axis()调出比例尺方法,orient()划定比例尺的方向
         * 而在v4中直接就是axisBottom()指定比例尺向下
         * var axis = d3.svg.axis()
                        .scale(linear)		//指定比例尺
                        .orient("bottom")	//指定刻度的方向
                        .ticks(7);			//指定刻度的数量
         * */
      //比例尺
      //console.log("d3.max(scaleDatasetY)]", d3.max(scaleDatasetY));
      var linearX = d3
        .scaleLinear()
        .domain([0, d3.max(scaleDatasetX)])
        .range([0, width * 0.98]);
      var linearY = d3
        .scaleLinear()
       // .domain([0, d3.max(scaleDatasetY)])
        .domain([this.infoData.Min, this.infoData.Max])
        .range([height * 0.6, 0]);

      datasetGround.map((ele, index) => {
        svg
          .append("polygon")
          .attr(
            "points",
            ele.data.map((ele, index) => {
              ////console.log(ele);
              let newEle = [];
              newEle.push(linearX(ele[0]), linearY(ele[1]));
              ////console.log(newEle);
              return newEle;
            })
          )
          .attr("stroke", "#9a866a")
          .attr("stroke-width", 1)
          .attr("fill", "#9a866a")
          .attr("transform", `translate(30, ${height * 0.25})`)
          .on("mouseover", (d) => {
            //console.log("d", d);
            // var html = d.toString()
            // tooltip.html(html)
            // tooltip.show()
          })
          .on("mouseout", (d) => {});

        //(3)移除提示条SVG
      });
      //画X,Y坐标轴

      var xScale3 = d3
        .scaleLinear()
        .domain([0, d3.max(scaleDatasetX)])
        .range([0, width*0.98])
        .nice();
      var linear_axisY = d3
        .scaleLinear()
        .domain([/* d3.max(scaleDatasetY)  */this.infoData.Max, this.infoData.Min])
        .range([0, height * 0.65])
        .nice();
      var axisX = d3
        .axisBottom()
        .scale(xScale3) //指定比例尺
        .ticks(8); //指定刻度的数量

      var axisY = d3
        .axisLeft()
        .scale(linear_axisY) //指定比例尺
        .ticks(12) //指定刻度的数量
        .tickSize(-width);

      svg
        .append("g")
        .attr("class", "axisX")
        .attr("transform", `translate(30, ${height * 0.93})`)
        .call(axisX)
        .call((g) =>
          g
            .select(".domain")
            .attr("class", "axisX_MydomainPathStyle")
            .attr("stroke-width", 0.5)
            .attr("stroke", "green")
        )
        .call((g) =>
          g
            .selectAll(".tick")
            .selectAll("line")
            .attr("class", "axisX_MyTickLineStyle")
            .attr("stroke-width", 0.5)
            .attr("stroke", "red")
        )
        .call((g) =>
          g
            .selectAll(".tick")
            .selectAll("text")
            .attr("class", "axisX_MyTextStyle")
            .attr("stroke", "green")
            .attr("stroke-width", 0.5)
        );
      svg
        .append("g")
        .attr("class", "axisY")
        .attr("transform", `translate(30, ${height * 0.25})`)
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
            .attr("stroke-opacity", (d) => (d === -2 ? 0 : 1))
            .attr("stroke", "red")
        )
        .call((g) =>
          g
            .selectAll(".tick")
            .selectAll("text")
            .attr("class", "axisY_MyTextStyle")
            .attr("stroke", "green")
            .attr("stroke-width", 0.5)
        );

      //循环画多边形
      datasetPipe.map((ele, index) => {
        svg
          .append("polygon")
          .attr(
            "points",
            ele.data.map((ele, index) => {
              ////console.log(ele);
              let newEle = [];
              newEle.push(linearX(ele[0]), linearY(ele[1]));
              ////console.log(newEle);
              return newEle;
            })
          )
          .attr("stroke", "#fff")
          .attr("stroke-width", 0)
          .attr("fill", "#fff")
          .attr("transform", `translate(30, ${height * 0.25})`);
      });
      //循环画污水井
      datasetWell.map((ele, index) => {
        svg
          .append("polygon")
          .attr(
            "points",
            ele.data.map((ele, index) => {
              ////console.log(ele);
              let newEle = [];
              newEle.push(linearX(ele[0]), linearY(ele[1]));
              ////console.log(newEle);
              return newEle;
            })
          )
          .attr("stroke", "#444")
          .attr("stroke-width", 1)
          .attr("fill", "#fff")
          .attr("transform", `translate(30, ${height * 0.25})`);
      });

      /* 动态画图 */
      this.DongTaiDrawData = {
        datasetPipe,
        datasetWell,
        svg,
        linearX,
        linearY,
        width,
        height,
        scaleDatasetX,
        scaleDatasetY,
      };
      this.tick();
    },
    DongTaiDraw(
      {
        datasetPipe,
        datasetWell,
        svg,
        linearX,
        linearY,
        width,
        height,
        scaleDatasetX,
        scaleDatasetY,
      } = this.DongTaiDrawData
    ) {
      /* 测试动画开始 */
      //console.log("LOOP", this.showdata++);
      if (this.Initdata === d3.max(scaleDatasetY) - 2) {
        this.Initdata = 1;
      }
      this.Initdata++;
      let polylinResdata = [
        { key: 0, value: this.Initdata },
        { key: d3.max(scaleDatasetX) / 2, value: this.Initdata },
        { key: d3.max(scaleDatasetX), value: this.Initdata },
      ];
      // for (var i = 0; i < d3.max(scaleDatasetX); i++) {
      //   polylinResdata.push({ key: i, value: this.Initdata });
      // }
      let NewdatasetWell = JSON.parse(JSON.stringify(datasetWell));
      NewdatasetWell.forEach((ele) => {
        ele.data.forEach((item, index) => {
          item[2] = this.Initdata;
          item[3] = this.Initdata;
        });
      });
      /* 测试动画结束 */
      /* 动态画图 */
      //画图之前清除之前图形
      d3.selectAll(".DongTaiDrawClass").remove();
      //循环画多边形
      // datasetPipe.map((ele, index) => {
      //   svg
      //     .append("polygon")
      //     .attr("class", "DongTaiDrawClass DongTaiDrawPipe")
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
      //     .attr("stroke", "#a8a8e7")
      //     .attr("stroke-width", 1)
      //     .attr("fill", "#a8a8e7")
      //     .attr("transform", `translate(30, ${height * 0.25})`)
      //     .transition()
      //     .duration(2000)
      //     .ease(d3.easePolyOut)
      //     .delay((d, i) => i * 200)
      //     .style("stroke-dashoffset", 0);
      // });
      //循环画污水井
      // datasetWell.map((ele, index) => {
      //   svg
      //     .append("polygon")
      //     .attr("class", "DongTaiDrawClass DongTaiDrawWell")
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
      //     .attr("stroke", "#444")
      //     .attr("stroke-width", 1)
      //     .attr("fill", "#a8a8e7")
      //     .attr("transform", `translate(30, ${height * 0.25})`)
      //     .transition()
      //     .duration(2000)
      //     .ease(d3.easePolyOut)
      //     .delay((d, i) => i * 200)
      //     .style("stroke-dashoffset", 0);
      // });
      //画液位
      // let parseTime = d3.timeParse("%Y-%m-%d")
      // let line = d3.line().x(d => xScale(parseTime(d.key))).y(d => yScale(d.value))
      let line = d3
        .line()
        .x((d) => linearX(d.key))
        .y((d) => -d.value /* linearY(d.value) */);
      let colorZ = d3.scaleOrdinal(d3.schemeDark2);
      svg
        .append("path")
        .attr("class", "DongTaiDrawClass DongTaiDrawFlow")
        .attr("d", line(polylinResdata))
        .attr("transform", `translate(30, ${height * 0.85})`)
        .attr("fill", "none")
        .attr("stroke", (d, i) => colorZ(Math.random()))
        .attr("stroke-width", 2)
        .style("stroke-dasharray", function (d, i) {
          return d3.select(this).node().getTotalLength();
        })
        .style("stroke-dashoffset", function (d, i) {
          return d3.select(this).node().getTotalLength();
        })
        .transition()
        .duration(20)
        .ease(d3.easePolyOut)
        .delay((d, i) => i * 20)
        .style("stroke-dashoffset", 0);
    },
  },
};
</script>
<style lang="scss" scoped>
.poumiantud3 {
  width: 100%;
  position: relative;
  .d3box {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    width: 100%;
    /*  height: vh(267); */
  }
  .Ztbox {
    position: absolute;
    top: 0;
    right: 0;
  }
}

path {
  fill: none;
  stroke: #76bf8a;
  stroke-width: 3px;
}
</style>