<template>
  <div class="app-container">
    <div class="home">
      <div>本页面测试HPO本地搜索</div>
      <div class="mt-4">
        <el-input
          v-model="hpoSearchValue"
          style="max-width: 800px"
          placeholder="Please input"
          class="input-with-select"
          @keyup.enter="searchHPO"
          @input="realtimeSearchHPO"
        >
          <template #suffix>
            <el-icon class="el-input__icon" @click="searchHPO">
              <search />
            </el-icon>
          </template>
          <template #append>
            <el-button @click="getLocalSelectNodes">提交</el-button>
          </template>
        </el-input>
      </div>

      <el-tree
        ref="localTree"
        lazy
        style="
          max-width: 800px;
          margin-top: 1vh;
          max-height: 400px;
          overflow-y: auto;
          overflow-x: hidden;
        "
        :data="treeData"
        :props="props"
        :load="loadNode"
        node-key="HPO_ID"
        show-checkbox
        check-strictly
        highlight-current
        v-loading="searchLoading"
        element-loading-text="搜索中..."
      >
        <template #default="{ node, data }">
          <span>{{ data.HPO_ID }}-{{ data.text }}</span>
        </template>
      </el-tree>
      <div v-for="(item, index) in localSelectNodes" :key="index">
        <div>{{ item.HPO_ID }}{{ item.text }}</div>
      </div>
    </div>
  </div>
</template>
 
 <script setup>
import { ref } from "vue";
import { getWebHpoJson } from "@/api/project";
import { ElMessage } from "element-plus";
const activeName = ref("first");
const hpoTableData = ref([]);
const totalCount = ref(0);
const pageSize = ref(20);
const pageNum = ref(1);
import axios from "axios";
const treeData = ref([]);
const hpoSearchValue = ref("");
const searchLoading = ref(false);
const { proxy } = getCurrentInstance();
let localSelectNodes = ref([]);
let allFirstNode = ref([]);
let timer = ref(null);
const props = {
  value: "HPO_ID",
  label: "text",
  children: "children",
  isLeaf: "leaf",
};


function getLocalSelectNodes() {
  localSelectNodes.value = proxy.$refs.localTree.getCheckedNodes();
}
/**判断是否是英文 */
function checkIfAllEnglish(value) {
  const regex = /^[A-Za-z]+$/;
  const isAllEnglish = regex.test(value);
  return isAllEnglish ? true : false;
}
/**搜索获得对应的HPO信息 */
async function searchHPO() {
  if (hpoSearchValue.value == "") {
    ElMessage({
      message: "您还未输入任何搜索值哦~~",
      type: "warning",
      duration: 5 * 1000,
    });
    clearTimeout(timer); // 清除之前的计时器
    searchLoading.value = false;

  } else {
    try {
      searchLoading.value = true;
      let mode = import.meta.env.MODE;
      let hpoLocalPath =
        mode == "development"
          ? "../../../public/assets/test.json"
          : "../../../assets/test.json";
      if (checkIfAllEnglish(hpoSearchValue.value)) {
        clearTimeout(timer); // 清除之前的计时器
        timer = setTimeout(async () => {
          console.log("用户已停止输入");
          // 触发请求
          const response = await axios.get(hpoLocalPath);
          const jsonData = response.data;
          const filteredData = jsonData.filter((item) => {
            return item.text
              .toLowerCase()
              .includes(hpoSearchValue.value.toLowerCase());
          });
          allFirstNode.value = filteredData;
          treeData.value = filteredData;
          searchLoading.value = false;
        }, 3000); // 3秒后触发
      } else {
        const response = await axios.get(hpoLocalPath);
        const jsonData = response.data;
        const filteredData = jsonData.filter((item) => {
          return item.text
            .toLowerCase()
            .includes(hpoSearchValue.value.toLowerCase());
        });
        allFirstNode.value = filteredData;
        treeData.value = filteredData;
        searchLoading.value = false;
      }
    } catch (error) {
      searchLoading.value = false;

      console.error("Error fetching or parsing JSON:", error);
    }
  }
}
/**实时搜索获得对应的HPO信息 */
async function realtimeSearchHPO() {
  if (hpoSearchValue.value == "") {
    allFirstNode.value = [];
    treeData.value = [];
    clearTimeout(timer); // 清除之前的计时器
    searchLoading.value = false;

  } else {
    try {
      searchLoading.value = true;
      let mode = import.meta.env.MODE;
      let hpoLocalPath =
        mode == "development"
          ? "../../../public/assets/test.json"
          : "../../../assets/test.json";
      if (checkIfAllEnglish(hpoSearchValue.value)) {
        clearTimeout(timer); // 清除之前的计时器
        timer = setTimeout(async () => {
          // 触发请求
          const response = await axios.get(hpoLocalPath);
          const jsonData = response.data;
          const filteredData = jsonData.filter((item) => {
            return item.text
              .toLowerCase()
              .includes(hpoSearchValue.value.toLowerCase());
          });
          allFirstNode.value = filteredData;
          treeData.value = filteredData;
          searchLoading.value = false;
        }, 3000); // 3秒后触发
      } else {
        const response = await axios.get(hpoLocalPath);
        const jsonData = response.data;
        const filteredData = jsonData.filter((item) => {
          return item.text
            .toLowerCase()
            .includes(hpoSearchValue.value.toLowerCase());
        });
        allFirstNode.value = filteredData;
        treeData.value = filteredData;
        searchLoading.value = false;
      }
    } catch (error) {
      searchLoading.value = false;

      console.error("Error fetching or parsing JSON:", error);
    }
  }
}

function findMatchingObjects(first, second, propA, propB) {
  // 新数组用于存储匹配的对象
  let matchingObjects = [];

  // 遍历第一个数组
  first.forEach((obj1) => {
    // 在第二个数组中查找具有相同属性值的对象
    let matchingObj2 = second.find((obj2) => obj1[propA] === obj2[propB]);

    // 如果找到了匹配的对象，则将其加入到新数组中
    if (matchingObj2) {
      matchingObjects.push(obj1);
    }
  });

  // 返回新数组
  return matchingObjects;
}
/**搜索获得父节点对应下一级的HPO信息 */
async function searchNextHPO(node, resolve) {
  try {
    let mode = import.meta.env.MODE;
    let hpoLocalPath =
      mode == "development"
        ? "../../../public/assets/edges.json"
        : "../../../assets/edges.json";
    const response = await axios.get(hpoLocalPath);
    const jsonData = response.data;
    const filteredData = jsonData.filter((item) => {
      // 返回 obj 等于指定值 node 的数组对象
      return item.obj == node;
    });
    let nextNode = findMatchingObjects(
      allFirstNode.value,
      filteredData,
      "HPO_ID",
      "sub"
    );
    return resolve(nextNode);
  } catch (error) {
    console.error("Error fetching or parsing JSON:", error);
  }
}
function loadNode(node, resolve) {
  searchNextHPO(node.data.HPO_ID, resolve);
}

</script>
 
 <style lang="scss" scoped>
.analysis-icon {
  color: #0088cc;
}
</style>

 