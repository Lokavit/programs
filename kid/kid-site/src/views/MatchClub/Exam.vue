<template>
  <div class="exam">
    <header>
      Exam
      <section>
        <template v-for="(item, index) in Object.keys(QuestionBank)">
          <div
            :key="index"
            class="draw_border"
            @click="onselectedLv(item)"
            :style="{ color: lvActive == item ? ' #ff7600' : '' }"
          >
            {{ item }}
          </div>
        </template>
      </section>
    </header>
    <main>
      <aside>
        <div>
          <template v-for="(item, index) in questList">
            <!-- 状态:非禁止输入，非提交 -->
            <div
              v-if="!isDisabled"
              :key="index"
              @click="onSingleQuest(index)"
              :style="{
                'background-color': numActive == index ? '#5acbff' : '',
              }"
            >
              {{ index + 1 }}
            </div>
            <!-- 状态:已禁止输入，已提交 -->
            <div
              v-if="isDisabled"
              :key="index"
              @click="onSingleQuest(index)"
              :style="{
                'background-color': item.result ? 'green' : 'red',
              }"
            >
              {{ index + 1 }}
            </div>
          </template>
        </div>

        <div>
          <button class="draw_border" @click="onSubmit">提交</button>
        </div>
      </aside>
      <section>
        <h1>{{ currentQuest.quest.title }}</h1>
        <img
          v-if="currentQuest.quest.src"
          class="exam_quest_img"
          :src="
            currentQuest.quest.src && currentQuest.quest.src != `图片地址`
              ? `http://assets.program.leadersir.net/kid/site/exam/${currentQuest.quest.src}`
              : `http://assets.program.leadersir.net/img/static/studio_default.png`
          "
          draggable="false"
        />
        <template v-for="(item, index) in currentQuest.options">
          <label :key="index" :for="index" @change="onchangeValue(index)" class="draw_border">
            <input
              type="radio"
              :id="index"
              :value="index"
              v-model="checkedValue"
              :disabled="isDisabled"
            />
            <span v-if="item.title">{{ item.title }}</span>
            <img
              v-if="item.src"
              :src="
                item.src && item.src != `图片地址`
                  ? `http://assets.program.leadersir.net/kid/site/exam/${item.src}`
                  : `http://assets.program.leadersir.net/img/static/studio_default.png`
              "
              draggable="false"
            />
          </label>
        </template>
      </section>
    </main>
  </div>
</template>

<script>
import QuestionBank from "./questionbank.json";
import { generateRandInt } from "../../utils/util";
export default {
  name: "Exam",
  data() {
    return {
      /** @description 题库 */
      QuestionBank,
      qusetLv: "lv1",
      isDisabled: false,
      currentQuest: {},
      checkedValue: "",
      lvActive: "lv1",
      numActive: 0,
    };
  },
  computed: {
    // 当前级别所有题
    currentLvQuestList() {
      return this.QuestionBank[`${this.qusetLv}`];
    },
    // 可以用作题号的数组
    questList() {
      console.log("考题级别:", this.qusetLv);
      // 暂存生成的数组，数组中每个值是题库中题号
      let temp = generateRandInt(30, 1, this.currentLvQuestList.length + 1);
      console.log("temp:", temp);
      console.log("当前级别所有题:", this.currentLvQuestList);
      let temp_obj = [];
      for (let i = 0; i < this.currentLvQuestList.length; i++) {
        // 如果暂存数组中第0个元素的值能够在当前所有题中找到
        let _temp = this.currentLvQuestList.find(
          (item) => item.questnum == temp[i]
        );
        if (_temp) {
          _temp.answer = ""; // 用户回答放这里
          _temp.result = ""; // 每题评判结果放这里
          temp_obj.push(_temp);
        }
      }
      // 默认显示第一道题
      this.currentQuest = temp_obj[0];
      console.log("当前题组", temp_obj);
      // 当级别改变时，就做一个新数组返回？
      return temp_obj;
    },
  },
  watch: {
    qusetLv(newVal, oldVal) {
      console.log("考题级别变更:", newVal, oldVal);
      // 当级别发生变更时,生成一个数组？数组对象？
    },
    currentQuest(newVal, oldVal) {
      console.log("当前题目:", newVal, oldVal);
      // 当级别发生变更时,生成一个数组？数组对象？
    },
  },
  created() {},
  mounted() {},
  methods: {
    /** @description 选择考题等级 */
    onselectedLv(val) {
      console.log("选择考级:", val);
      this.qusetLv = val;
      // 切换当前选中考题等级高亮
      this.lvActive = val;
      // 解除禁止输入
      this.isDisabled = false;
      // 清空默认选项值
      this.checkedValue = "";
      // 重置题号激活项为第一项
      this.numActive = 0;
    },
    /** @description 选择左侧题号 */
    onSingleQuest(val) {
      console.log("选择一道题:", val);
      // 设置当前题号高亮
      this.numActive = val;
      console.log("用数组下标选择：", this.questList[val]);
      this.currentQuest = this.questList[val];
      // 切题时，直接将当前题的answer赋值给选中项?
      this.checkedValue = this.currentQuest.answer;
    },

    /** @description 当前题的答案 */
    onchangeValue(val) {
      console.log("当前题的回答:", val);
      this.currentQuest.answer = val;
    },

    onSubmit() {
      console.log("交卷");
      // 首先禁止输入
      this.isDisabled = true;
      // 重置题号激活项为第一项
      this.numActive = -1;
      /**
       * 统一进行对比，给出结果：
       *    每个对象中的[correct]与[answer]两个值比对,非相等之外，一律判断错误[result:true/false]
       */
      console.log("题组:", this.questList);
      this.questList.map((item, index) => {
        if (
          item.correct &&
          item.answer &&
          item.answer !== "" &&
          item.correct == item.answer
        ) {
          item.result = true;
        } else {
          item.result = false;
        }
      });
      console.log("题组处理结果:", this.questList);
    },
  },
};
</script>
