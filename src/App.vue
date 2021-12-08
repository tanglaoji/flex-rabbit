<template>
  <div id="flexRabbit">
    <div id="rabbit-console">
      <div style="display: flex;justify-content: space-between;flex-direction: column;">
        <div style="display: flex;flex-direction: column;margin-bottom: 40px;">
          <div id="console-nav" class="not-selectable">
            <label>FlexRabbit</label>
            <el-popover placement="bottom" width="180" trigger="click" v-model="isCheckpoint">
              <div id="checkpoint-menu" class="not-selectable">
                <div class="checkpoint-menu-item" :class="{'checkpoint-menu-item-bg' : (index+1==level)}" v-for="(item,index) in checkpoint" @click="chooseCheckpoint(index)" :key="index">{{index+1}}
                </div>
              </div>
              <el-button slot="reference">Level&nbsp;{{level}}/{{checkpoint.length}}</el-button>
            </el-popover>
          </div>
          <div id="console-desc" class="not-selectable" v-if="settingType[0] == 'primary'">
            <label v-html="checkpoint[level-1].desc"></label>
            <span>第{{toChineseCase(level)}}关</span>
            <ul>
              <li v-for="item,index in checkpoint[level-1].tips" v-html="item" :key="index"></li>
            </ul>
          </div>
        </div>
        <div id="console-code">
          <el-row class="code-row">
            <div class="code-num not-selectable">0</div>
            <div class="code-desc" style="color: #d7ba7d;">#ground<span style="color: white;">{</span></div>
          </el-row>
          <el-row class="code-row">
            <div class="code-num not-selectable">1</div>
            <div class="code-desc">&nbsp;&nbsp;&nbsp;&nbsp;display: flex;</div>
          </el-row>
          <el-row class="code-row" v-if="level == 16 || level == 17">
            <div class="code-num not-selectable">2</div>
            <div class="code-desc">&nbsp;&nbsp;&nbsp;&nbsp;align-items: flex-start;</div>
          </el-row>
          <el-row class="code-row" v-for="(item,index) in cssValue" :key="index">
            <div class="code-num not-selectable">{{index+2}}</div>
            <div class="code-desc">&nbsp;&nbsp;&nbsp;&nbsp;{{item}}</div>
          </el-row>
          <el-row class="code-row" v-show="level < 14 || level > 17">
            <div class="code-num not-selectable">{{cssValue.length+2}}</div>
            <div class="code-desc code-desc-input">
              <el-input v-model="cssInput" @keyup.enter.native="enterAddCSS" @keyup.delete.native="deleteCSS"></el-input>
            </div>
          </el-row>
          <el-row class="code-row">
            <div class="code-num not-selectable">
              <span v-if="level >= 14 && level <= 17">{{level==16 || level == 17 ? 3 : 2}}</span>
              <span v-else>{{cssValue.length + 3}}</span>
            </div>
            <div class="code-desc">}</div>
          </el-row>
          <!--  当关卡处于14和17之间时才显示  -->
          <div v-if="level >= 14 && level <= 17">
            <el-row class="code-row">
              <div class="code-num not-selectable">{{(level==16||level==17) ? 4 : 3}}</div>
              <div class="code-desc" style="color: #d7ba7d;">.yellow<span style="color: white;">{</span></div>
            </el-row>
            <el-row class="code-row" v-for="(item,index) in cssSingle" :key="index">
              <div class="code-num not-selectable">{{index+2}}</div>
              <div class="code-desc">&nbsp;&nbsp;&nbsp;&nbsp;{{item}}</div>
            </el-row>
            <el-row class="code-row">
              <div class="code-num not-selectable">{{cssValue.length + (level==16||level==17) ? 5 : 4}}</div>
              <div class="code-desc code-desc-input">
                <el-input v-model="cssInput" @keyup.enter.native="enterAddSingle" @keyup.delete.native="deleteSingle"></el-input>
              </div>
            </el-row>
            <el-row class="code-row">
              <div class="code-num not-selectable">{{(level==16||level==17) ? 6 : 5}}</div>
              <div class="code-desc">}</div>
            </el-row>
          </div>
          <el-row class="code-tips-button">
            <el-tooltip class="item" effect="light" v-if="level == 20" content="在本关，需要您规范输入，请不要漏输空格~" placement="bottom">
              <i class="el-icon-warning-outline" style="margin-right: 5px;color: yellow;"></i>
            </el-tooltip>
            <label style="font-size: 12px;white-space: nowrap;"><span style="color: red;">*</span>&nbsp;请务必填上';'号，否则会被判定答案错误！</label>
            <el-button type="danger" :disabled="isDisable" class="not-selectable" @click="nextCheckpoint">{{checkpointTips}}
            </el-button>
          </el-row>
        </div>
      </div>
      <div id="console-footer" class="not-selectable">
        <label style="display: flex;align-items: center;">
          Copyright&nbsp;@&nbsp;2021&nbsp;<a href="https://chenzhongyu.top/" style="color: gainsboro;">陈忠宇</a>&nbsp;
          <el-popover placement="right" width="160" v-model="isSetting">
            <div style="text-align: center; margin: 0;">
              <el-button :type="settingType[0]" size="mini" @click="selectEntryLevel">入门级</el-button>
              <el-button :type="settingType[1]" size="mini" @click="selectExpertLevel">专家级</el-button>
            </div>
            <el-button slot="reference" type="text" style="font-size: 12px !important;">设置</el-button>
          </el-popover>
        </label>
        <el-popover placement="top" width="310">
          <div style="font-size: 13px;">相信您已经拥有一定HTML的基础了，因为FlexRabbit对于零基础玩家并不友好，建议先从最基本的<a href="https://www.baidu.com/s?ie=UTF-8&wd=CSS" target="_blank"
              style="color: #98c1d9">CSS</a>学起，只要拥有了一点点的基础，就足够开始愉快的玩耍啦！在游戏中您需要通过输入CSS代码控制胡萝卜的移动，最后将FlexRabbit捕获！
          </div>
          <label slot="reference" style="cursor: pointer;">关于
            <span style="text-decoration: underline;">FlexRabbit</span>
          </label>
        </el-popover>
      </div>
    </div>
    <div id="rabbit-stage">
      <div style="position: absolute;z-index: 2;width: 100%;height: 100%;display: flex;" :style="cssValue.join('').replace(',','')" :class="{alignItem:isAlignItem}">
        <Carrot :item="item" v-for="item,index in checkpoint[level-1].carrot" :key="index" />
      </div>
      <div style="position: absolute;z-index: 1;width: 100%;height: 100%;display: flex;" :style="checkpoint[level - 1].container.join('').replace(',', '')" :class="{ alignItem: isAlignItem }">
        <Rabbit :item="item" v-for="(item,index) in checkpoint[level-1].rabbit" :key="index" :style="checkpoint[level-1].single[index].replace('#','')" />
      </div>
    </div>
  </div>
</template>

<script>
import Checkpoint from "./database/fr_checkpoint.js";
import Rabbit from "./components/Rabbit.vue";
import Carrot from "./components/Carrot.vue";
export default {
  name: "App",
  components: { Rabbit, Carrot },
  data() {
    return {
      isCheckpoint: false,
      checkpoint: Checkpoint,
      level: 1,
      isDisable: true,
      cssValue: [],
      cssSingle: [],
      cssInput: "",
      chinese_number: [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
      ],
      unit: ["", "十", "百", "千", "万"],
      isAlignItem: false,
      isSetting: false,
      settingType: ["primary", "text"],
      checkpointTips: "下一关",
    };
  },
  methods: {
    toChineseCase(num) {
      num = parseInt(num);
      let getWan = (temp) => {
        let strArr = temp.toString().split("").reverse();
        let newNum = "";
        for (var i = 0; i < strArr.length; i++) {
          newNum =
            (i == 0 && strArr[i] == 0
              ? ""
              : i > 0 && strArr[i] == 0 && strArr[i - 1] == 0
              ? ""
              : this.chinese_number[strArr[i]] +
                (strArr[i] == 0 ? this.unit[0] : this.unit[i])) + newNum;
        }
        return newNum;
      };
      let overWan = Math.floor(num / 10000);
      let noWan = num % 10000;
      if (noWan.toString().length < 4) noWan = "0" + noWan;
      return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
    },
    enterAddCSS() {
      let answerLength = this.checkpoint[this.level - 1].container.length;
      if (this.cssValue.length < answerLength) {
        this.cssValue.push(this.cssInput);
        if (this.cssValue.length == answerLength) {
          let record = 0;
          for (let i in this.cssValue)
            if (
              this.checkpoint[this.level - 1].container.indexOf(
                this.cssValue[i].replace(/\s/, "")
              ) != -1
            )
              record++;
          if (record == answerLength) {
            this.isDisable = false;
            if (this.level != this.checkpoint.length)
              this.checkpointTips = "下一关";
            else this.checkpointTips = "已通关";
            this.$message({
              message:
                "恭喜你喂养到" +
                this.checkpoint[this.level - 1].rabbit.length +
                "只FlexRabbit！",
              type: "success",
              center: true,
            });
          }
        }
      } else {
        if (this.isDisable)
          this.$message({
            message: "答案不会超过" + answerLength + "行哦~",
            type: "warning",
            center: true,
          });
        else
          this.$message({
            message: "您已经通关了，请点击下方按钮前往下一关！",
            center: true,
          });
      }
      this.cssInput = "";
    },
    deleteCSS() {
      if (this.cssInput == "") {
        let str = this.cssValue[this.cssValue.length - 1];
        this.cssValue.pop();
        this.cssInput = str;
        if (this.cssValue.length == 0)
          this.$message({
            message: "已经是最后一行了哦~",
            center: true,
          });
      }
    },
    enterAddSingle() {
      let select = document.getElementById("rabbit-stage").firstChild;
      let arr;
      for (let i = 0; i < this.checkpoint[this.level - 1].single.length; i++) {
        if (this.checkpoint[this.level - 1].single[i] != "#") {
          arr = this.checkpoint[this.level - 1].single[i].split("#");
          select.querySelector(`svg:nth-child(${i + 1})`).style.cssText +=
            this.cssInput;
        }
      }
      let answerSingle = arr.length;
      if (this.cssSingle.length < answerSingle) {
        this.cssSingle.push(this.cssInput);
        if (this.cssSingle.length == answerSingle) {
          let record = 0;
          for (let i in this.cssSingle) {
            if (arr.indexOf(this.cssSingle[i].replace(/\s*/g, "")) != -1)
              record++;
          }
          if (record == answerSingle) {
            this.isDisable = false;
            if (this.level != this.checkpoint.length)
              this.checkpointTips = "下一关";
            else this.checkpointTips = "已通关";
            this.$message({
              message:
                "恭喜你喂养到" +
                this.checkpoint[this.level - 1].rabbit.length +
                "只FlexRabbit！",
              type: "success",
              center: true,
            });
          }
        }
      } else {
        if (this.isDisable)
          this.$message({
            message: "答案不会超过" + answerSingle + "行哦~",
            type: "warning",
            center: true,
          });
        else
          this.$message({
            message: "您已经通关了，请点击下方按钮前往下一关！",
            center: true,
          });
      }
      this.cssInput = "";
    },
    deleteSingle() {
      if (this.cssInput == "") {
        let str = this.cssSingle[this.cssSingle.length - 1];
        this.cssSingle.pop();
        this.cssInput = str;
        if (this.cssSingle.length == 0)
          this.$message({
            message: "已经是最后一行了哦~",
            center: true,
          });
      }
    },
    nextCheckpoint() {
      let select = document.getElementById("rabbit-stage").firstChild;
      for (let i = 0; i < this.checkpoint[this.level - 1].single.length; i++)
        select.querySelector(`svg:nth-child(${i + 1})`).style.cssText = "";
      this.cssSingle = [];
      this.cssValue = [];
      this.isDisable = true;
      if (this.level != this.checkpoint.length) this.level++;
      else {
        this.$confirm("点击确定将回到第一关, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.level = 1;
            this.checkpointTips = "下一关";
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
              center: true,
            });
          });
      }
      if (this.level == 16 || this.level == 17) this.isAlignItem = true;
      else this.isAlignItem = false;
    },
    chooseCheckpoint(index) {
      this.$confirm("另选关卡后不会记录当前输入值, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.isCheckpoint = false;
          this.cssValue = [];
          let select = document.getElementById("rabbit-stage").firstChild;
          for (
            let i = 0;
            i < this.checkpoint[this.level - 1].single.length;
            i++
          )
            select.querySelector(`svg:nth-child(${i + 1})`).style.cssText = "";
          this.cssSingle = [];
          this.level = index + 1;
          if (this.level == 16 || this.level == 17) this.isAlignItem = true;
          else this.isAlignItem = false;
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
            center: true,
          });
        });
    },
    selectEntryLevel() {
      this.isSetting = false;
      this.settingType[0] = "primary";
      this.settingType[1] = "text";
    },
    selectExpertLevel() {
      this.isSetting = false;
      this.settingType[0] = "text";
      this.settingType[1] = "primary";
    },
  },
};
</script>
