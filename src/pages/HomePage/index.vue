<template>
  <div class="HomePage">
    <div class="box1">
      <el-button type="primary" @click="ResDatafun">画剖面图</el-button>
      <div v-if="IsShowStatus" v-animate-css="'fadeInUp'">{{InitData-1>9?(InitData-1):"0"+(InitData-1)}}：00</div>
    </div>
    <div class="box2" v-if="IsShowStatus" v-animate-css="'fadeInUp'">
      <el-button type="primary" @click="LastAginPaly">上一帧</el-button>
      <el-button type="primary" @click="PlayPausefun">{{
        IsPlayStatus ? "暂停" : "播放"
      }}</el-button>
      <el-button type="primary" @click="NextAginPaly">下一帧</el-button>
      <el-button type="primary" @click="AginPaly">重播</el-button>
    </div>

    <div
      class="IsShowblod"
      v-if="IsShowStatus"
      v-animate-css="'fadeInUp'"
      ref="html2canvas"
    >
      <div class="navbar nav_Bg_Color fontColorTitle">
        <div class="navbar_left">管道剖面图</div>
        <div class="navbar_right">
          <span class="exportStyle Button_Bg_Color" @click="d3downloadable()"
            >导出</span
          >
          <span class="closeStyle Button_Bg_Color" @click="CloseFun">关闭</span>
        </div>
      </div>
      <div class="contentbox">
        <poumiantud3
          :infoData="infoData"
          :DTinfoData="DTinfoData"
          ref="poumiantud3"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Bus from "@/utils/bus.js";
import { mapGetters } from "vuex";
import AxiosUrl from "@/middleware/services/AxiosUrl";
import poumiantud3 from "./poumiantud3/index";

export default {
  name: "IsShowblod",
  components: {
    poumiantud3,
  },
  data() {
    return {
      NowStaustimerH: null,
      IsShowStatus: false,
      InitData: 0,
      infoData: {
        datasetGround: [
          {
            data: [
              [0, -1.55],
              [1.731125365683459, -1.55],
              [1.731125365683459, 2.4],
              [0, 2.47],
              [0, 2.47],
            ],
          },
          {
            data: [
              [1.7311253656834573, -1.55],
              [24.232779899105033, -1.55],
              [24.232779899105033, 2.48],
              [1.7311253656834573, 2.4],
              [1.7311253656834573, 2.4],
            ],
          },
          {
            data: [
              [24.232779899105033, -1.55],
              [55.739629214173526, -1.55],
              [55.739629214173526, 2.48],
              [24.232779899105033, 2.48],
              [24.232779899105033, 2.48],
            ],
          },
          {
            data: [
              [55.73962921417352, -1.55],
              [86.9194044950724, -1.55],
              [86.9194044950724, 2.63],
              [55.73962921417352, 2.48],
              [55.73962921417352, 2.48],
            ],
          },
          {
            data: [
              [86.9194044950724, -1.55],
              [117.90531998803014, -1.55],
              [117.90531998803014, 2.6],
              [86.9194044950724, 2.63],
              [86.9194044950724, 2.63],
            ],
          },
          {
            data: [
              [117.90531998803014, -1.55],
              [117.90531998803014, -1.55],
              [117.90531998803014, 2.6],
              [117.90531998803014, 2.6],
            ],
          },
        ],
        datasetPipe: [
          {
            data: [
              [0, 1.47],
              [1.731125365683459, -0.18],
              [1.731125365683459, -0.08],
              [0, 1.57],
            ],
          },
          {
            data: [
              [1.731125365683459, -0.32],
              [24.232779899105033, -0.66],
              [24.232779899105033, -0.26],
              [1.7311253656834573, 0.08],
            ],
          },
          {
            data: [
              [24.232779899105033, -0.8],
              [55.739629214173526, -1.03],
              [55.739629214173526, -0.63],
              [24.232779899105033, -0.4],
            ],
          },
          {
            data: [
              [55.739629214173526, -1.027],
              [86.9194044950724, -0.916],
              [86.9194044950724, -0.416],
              [55.73962921417352, -0.527],
            ],
          },
          {
            data: [
              [86.9194044950724, -0.916],
              [117.90531998803014, -0.894],
              [117.90531998803014, -0.294],
              [86.9194044950724, -0.316],
            ],
          },
        ],
        datasetWell: [
          {
            data: [
              [0, 1.47],
              [0, 2.47],
            ],
          },
          {
            data: [
              [1.731125365683459, -0.35],
              [1.731125365683459, 2.4],
            ],
          },
          {
            data: [
              [24.232779899105033, -0.8],
              [24.232779899105033, 2.48],
            ],
          },
          {
            data: [
              [55.739629214173526, -1.03],
              [55.739629214173526, 2.48],
            ],
          },
          {
            data: [
              [86.9194044950724, -0.916],
              [86.9194044950724, 2.63],
            ],
          },
          {
            data: [
              [117.90531998803014, -0.894],
              [117.90531998803014, 2.6],
            ],
          },
        ],
        Min: -1.55,
        Max: 2.8899999999999997,
        datasetPipeLevel: [
          {
            data: [
              [0, 1.47],
              [1.731125365683459, -0.18],
              [1.731125365683459, 1.49],
              [0, 0.48362],
            ],
          },
          {
            data: [
              [1.731125365683459, -0.32],
              [24.232779899105033, -0.66],
              [24.232779899105033, 0.48362],
              [1.731125365683459, 0.48292],
            ],
          },
          {
            data: [
              [24.232779899105033, -0.8],
              [55.739629214173526, -1.03],
              [55.739629214173526, 0.48292],
              [24.232779899105033, 0.48256],
            ],
          },
          {
            data: [
              [55.739629214173526, -1.027],
              [86.9194044950724, -0.916],
              [86.9194044950724, 0.48256],
              [55.739629214173526, 0.48237],
            ],
          },
          {
            data: [
              [86.9194044950724, -0.916],
              [117.90531998803014, -0.894],
              [117.90531998803014, 0.48237],
              [86.9194044950724, 0.48228],
            ],
          },
        ],
        datasetWellLevel: [
          {
            data: [
              [0, 1.47],
              [0, 1.49],
            ],
          },
          {
            data: [
              [1.731125365683459, -0.35],
              [1.731125365683459, 0.48362],
            ],
          },
          {
            data: [
              [24.232779899105033, -0.8],
              [24.232779899105033, 0.48292],
            ],
          },
          {
            data: [
              [55.739629214173526, -1.03],
              [55.739629214173526, 0.48256],
            ],
          },
          {
            data: [
              [86.9194044950724, -0.916],
              [86.9194044950724, 0.48237],
            ],
          },
          {
            data: [
              [117.90531998803014, -0.894],
              [117.90531998803014, 0.48228],
            ],
          },
        ],
        polylinResdata: [
          { key: 0, value: 1.49 },
          { key: 1.731125365683459, value: 0.48362 },
          { key: 24.232779899105033, value: 0.48292 },
          { key: 55.739629214173526, value: 0.48256 },
          { key: 86.9194044950724, value: 0.48237 },
          { key: 117.90531998803014, value: 0.48228 },
        ],
        width: 1820,
        height: 237,
        padding: 30,
      },
      DTinfoData: {
        datasetGround: [
          {
            data: [
              [0, -1.55],
              [1.731125365683459, -1.55],
              [1.731125365683459, 2.4],
              [0, 2.47],
              [0, 2.47],
            ],
          },
          {
            data: [
              [1.7311253656834573, -1.55],
              [24.232779899105033, -1.55],
              [24.232779899105033, 2.48],
              [1.7311253656834573, 2.4],
              [1.7311253656834573, 2.4],
            ],
          },
          {
            data: [
              [24.232779899105033, -1.55],
              [55.739629214173526, -1.55],
              [55.739629214173526, 2.48],
              [24.232779899105033, 2.48],
              [24.232779899105033, 2.48],
            ],
          },
          {
            data: [
              [55.73962921417352, -1.55],
              [86.9194044950724, -1.55],
              [86.9194044950724, 2.63],
              [55.73962921417352, 2.48],
              [55.73962921417352, 2.48],
            ],
          },
          {
            data: [
              [86.9194044950724, -1.55],
              [117.90531998803014, -1.55],
              [117.90531998803014, 2.6],
              [86.9194044950724, 2.63],
              [86.9194044950724, 2.63],
            ],
          },
          {
            data: [
              [117.90531998803014, -1.55],
              [117.90531998803014, -1.55],
              [117.90531998803014, 2.6],
              [117.90531998803014, 2.6],
            ],
          },
        ],
        datasetPipe: [
          {
            data: [
              [0, 1.47],
              [1.731125365683459, -0.18],
              [1.731125365683459, -0.08],
              [0, 1.57],
            ],
          },
          {
            data: [
              [1.731125365683459, -0.32],
              [24.232779899105033, -0.66],
              [24.232779899105033, -0.26],
              [1.7311253656834573, 0.08],
            ],
          },
          {
            data: [
              [24.232779899105033, -0.8],
              [55.739629214173526, -1.03],
              [55.739629214173526, -0.63],
              [24.232779899105033, -0.4],
            ],
          },
          {
            data: [
              [55.739629214173526, -1.027],
              [86.9194044950724, -0.916],
              [86.9194044950724, -0.416],
              [55.73962921417352, -0.527],
            ],
          },
          {
            data: [
              [86.9194044950724, -0.916],
              [117.90531998803014, -0.894],
              [117.90531998803014, -0.294],
              [86.9194044950724, -0.316],
            ],
          },
        ],
        datasetWell: [
          {
            data: [
              [0, 1.47],
              [0, 2.47],
            ],
          },
          {
            data: [
              [1.731125365683459, -0.35],
              [1.731125365683459, 2.4],
            ],
          },
          {
            data: [
              [24.232779899105033, -0.8],
              [24.232779899105033, 2.48],
            ],
          },
          {
            data: [
              [55.739629214173526, -1.03],
              [55.739629214173526, 2.48],
            ],
          },
          {
            data: [
              [86.9194044950724, -0.916],
              [86.9194044950724, 2.63],
            ],
          },
          {
            data: [
              [117.90531998803014, -0.894],
              [117.90531998803014, 2.6],
            ],
          },
        ],
        Min: -1.55,
        Max: 2.8899999999999997,
        datasetPipeLevel: [
          {
            data: [
              [0, 1.47],
              [1.731125365683459, -0.18],
              [1.731125365683459, 1.49],
              [0, 0.48362],
            ],
          },
          {
            data: [
              [1.731125365683459, -0.32],
              [24.232779899105033, -0.66],
              [24.232779899105033, 0.48362],
              [1.731125365683459, 0.48292],
            ],
          },
          {
            data: [
              [24.232779899105033, -0.8],
              [55.739629214173526, -1.03],
              [55.739629214173526, 0.48292],
              [24.232779899105033, 0.48256],
            ],
          },
          {
            data: [
              [55.739629214173526, -1.027],
              [86.9194044950724, -0.916],
              [86.9194044950724, 0.48256],
              [55.739629214173526, 0.48237],
            ],
          },
          {
            data: [
              [86.9194044950724, -0.916],
              [117.90531998803014, -0.894],
              [117.90531998803014, 0.48237],
              [86.9194044950724, 0.48228],
            ],
          },
        ],
        datasetWellLevel: [
          {
            data: [
              [0, 1.47],
              [0, 1.49],
            ],
          },
          {
            data: [
              [1.731125365683459, -0.35],
              [1.731125365683459, 0.48362],
            ],
          },
          {
            data: [
              [24.232779899105033, -0.8],
              [24.232779899105033, 0.48292],
            ],
          },
          {
            data: [
              [55.739629214173526, -1.03],
              [55.739629214173526, 0.48256],
            ],
          },
          {
            data: [
              [86.9194044950724, -0.916],
              [86.9194044950724, 0.48237],
            ],
          },
          {
            data: [
              [117.90531998803014, -0.894],
              [117.90531998803014, 0.48228],
            ],
          },
        ],
        polylinResdata: [
          { key: 0, value: 1.49 },
          { key: 1.731125365683459, value: 0.48362 },
          { key: 24.232779899105033, value: 0.48292 },
          { key: 55.739629214173526, value: 0.48256 },
          { key: 86.9194044950724, value: 0.48237 },
          { key: 117.90531998803014, value: 0.48228 },
        ],
        width: 1820,
        height: 237,
        padding: 30,
      },
      IsPlayStatus: false,
    };
  },
  mounted() {
    Bus.$on("pauseDHfunTo", (e) => {
      this.IsPlayStatus = e;
      if (this.InitData < 24) {
        if (e) {
          this.getTimeNowStausfun();
        } else {
          window.clearInterval(this.NowStaustimerH);
          this.NowStaustimerH = null;
        }
      }
    });
  },
  methods: {
    CloseFun() {
      window.clearInterval(this.NowStaustimerH);
      this.NowStaustimerH = null;
      this.IsShowStatus = false;
      this.$refs.poumiantud3.cancelD3fun();
    },
    //调后台接口方法--画剖面图
    ResDatafun() {
      window.clearInterval(this.NowStaustimerH);
      this.NowStaustimerH = null;
      this.IsShowStatus = false;
      this.IsPlayStatus = true;
      this.JTResDrawd3();
      this.getTimeNowStausfun();
    },
    //调接口绘制剖面图
    JTResDrawd3() {
      this.$axios
        .post(
          AxiosUrl.baseUrlPath + "poumiantuline5",
          JSON.stringify({
            PipeIdList: [
              "915205.2",
              "19342407.1",
              "19341407.3",
              "19287407.4",
              "19286407.3",
            ],
            Hour: 3,
          }),
          {
            headers: { "Content-Type": "application/json;" },
          }
        )
        .then((res) => {
          console.log("res", res);
          // console.log(
          //   "JSON.stringify(res.data.Response)",
          //   JSON.stringify(res.data.Response)
          // );
          let newResponse = JSON.parse(JSON.stringify(res.data.Response));
          newResponse.width = 1820;
          newResponse.height = 437;
          newResponse.padding = 10;
          this.infoData = newResponse;
          // console.log(
          //   "JSON.stringify(newResponse)",
          //   JSON.stringify(newResponse)
          // );
          this.IsShowStatus = true;
          setTimeout(() => {
            this.$refs.poumiantud3.calculatePath(res.data);
          }, 100);
        })
        .catch((error) => {});
    },
    //导出图片
    d3downloadable() {
      this.$refs.poumiantud3.d3downloadable();
    },
    //暂停播放
    PlayPausefun() {
       if (this.InitData < 24) {
      this.$refs.poumiantud3.pausefun();
       }
    },
    //上一帧
    LastAginPaly() {
      if (this.InitData > 0) {
        window.clearInterval(this.NowStaustimerH);
        this.NowStaustimerH = null;
        this.$refs.poumiantud3.Endefun();
        this.$refs.poumiantud3.CancelDongTaiDraw();
        this.IsPlayStatus = false;
        this.InitData--;
        this.DTDatafun();
        this.$refs.poumiantud3.LastNextAginPalyResetDongTaiDraw();
      } else {
        alert(this.InitData);
      }
    },
    //下一帧
    NextAginPaly() {
      if (this.InitData < 24) {
        window.clearInterval(this.NowStaustimerH);
        this.NowStaustimerH = null;
        this.$refs.poumiantud3.Endefun();
        this.$refs.poumiantud3.CancelDongTaiDraw();
        this.IsPlayStatus = false;
       
        this.DTDatafun();
         this.InitData++;
        this.$refs.poumiantud3.LastNextAginPalyResetDongTaiDraw();
      } else {
        alert(this.InitData);
      }
    },
    //重播
    AginPaly() {
      window.clearInterval(this.NowStaustimerH);
      this.NowStaustimerH = null;
      this.$refs.poumiantud3.Endefun();
      this.$refs.poumiantud3.CancelDongTaiDraw();
      this.IsPlayStatus = true;
      this.InitData = 0;
      this.getTimeNowStausfun();
      this.$refs.poumiantud3.AginPalyResetDongTaiDraw();
    },
    //初始化、定时5分钟刷新数据
    getTimeNowStausfun() {
      this.IsDTDatafun();
      this.NowStaustimerH = setInterval(() => {
        this.IsDTDatafun();
      }, 5000);
      this.$once("hook:beforeDestroy", () => {
        console.log("清除定时器NowStaustimerH");
        window.clearInterval(this.NowStaustimerH);
        this.NowStaustimerH = null;
      });
    },
    //
    IsDTDatafun() {
      if (this.InitData < 24) {
        console.log("定时器NowStaustimerH", this.InitData);
        this.DTDatafun();
        this.InitData++;
      } else {
        window.clearInterval(this.NowStaustimerH);
        this.NowStaustimerH = null;
        this.$refs.poumiantud3.Endefun();
      }
    },
    DTDatafun() {
      this.$axios
        .post(
          AxiosUrl.baseUrlPath + "poumiantuline5",
          JSON.stringify({
            PipeIdList: [
              "915205.2",
              "19342407.1",
              "19341407.3",
              "19287407.4",
              "19286407.3",
            ],
            Hour: this.InitData,
          }),
          {
            headers: { "Content-Type": "application/json;" },
          }
        )
        .then((res) => {
          console.log("DTDatafun--res", res);
          let newResponse = JSON.parse(JSON.stringify(res.data.Response));
          newResponse.width = 1820;
          newResponse.height = 437;
          newResponse.padding = 10;
          this.DTinfoData = newResponse;
        })
        .catch((error) => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.nav_Bg_Color {
  background: #b6c2c9;
}
.fontColorTitle {
  color: #506470;

}
.HomePage {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  position: relative;
  .IsShowblod {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 6;
    .navbar {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 40px;

      .navbar_left {
        margin-left: 16px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 600;
      }
      .navbar_right {
        margin-right: 16px;
        .exportStyle {
          padding: 4px 12px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;

          margin-right: 10px;
          background: #cedae1;
          border-radius: 2px;
          cursor: pointer;
        }
        .closeStyle {
          padding: 4px 12px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          background: #cedae1;
          border-radius: 2px;
          cursor: pointer;
        }
      }
    }
    .contentbox {
      width: 100%;
     // height: 567px;
     // background: #506470;
    }
  }
  .box1{
    margin: 20px;
  }
   .box2{
    margin: 20px;
  }
}
</style>