<template>
  <div class="app-container">
    <div class="home">
      <el-tabs v-model="activeName" type="card" class="demo-tabs">
        <el-tab-pane label="我的项目汇总" name="first"></el-tab-pane>
        <el-tab-pane label="本地数据库" name="second">
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
              <span>{{ data.HPO_ID }}-{{data.text}}</span>
            </template>
          </el-tree>
          <div v-for="(item, index) in localSelectNodes" :key="index">
            <div>{{ item.HPO_ID }}{{ item.text }}</div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="生信数据仓库" name="third">
          <el-table :data="hpoTableData" style="width: 100%" max-height="600">
            <el-table-column label="HPO_ID" width="150">
              <template #default="scope">
                <el-link type="primary" @click="clickHpo(scope.row)">
                  {{ scope.row.hpoId }}&nbsp;
                  <svg-icon icon-class="jump" class-name="analysis-icon " />
                </el-link>
                <!-- <span
                 
                  class="hpo_id_underline-text"
                ></span>-->
              </template>
            </el-table-column>
            <el-table-column label="表型术语(英文)" prop="lbls" show-overflow-tooltip width="350" />
            <el-table-column label="表型术语(中文)" prop="lblsZh" show-overflow-tooltip width="200" />
            <el-table-column label="表型定义(英文)" prop="definition" show-overflow-tooltip>
              <!-- <template #default="scope">
                <el-tooltip effect="con" placement="top">
                  <template #content>
                    <div class="text_warp">{{scope.row.definition}}</div>
                  </template>
                  <div class="text_els">{{ scope.row.definition }}</div>
                </el-tooltip>
              </template>-->
            </el-table-column>
            <el-table-column label="表型定义(中文)" prop="definitionZh" show-overflow-tooltip />
          </el-table>
          <el-pagination
            style="margin-top: 1vh"
            layout="prev, pager, next,sizes "
            :total="totalCount"
            :page-sizes="[100, 200, 300, 400]"
            v-model:page-size="pageSize"
            @size-change="handleHpoSizeChange"
            @current-change="handleHpoCurrentChange"
          />
        </el-tab-pane>
        <el-tab-pane label="我的数据动态" name="fourth"></el-tab-pane>
      </el-tabs>
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
  isLeaf: "leaf"
};
/**获取HPO表格数据 */
function getHPO() {
  getWebHpoJson(pageNum.value, pageSize.value).then(res => {
    totalCount.value = res.data.count;
    hpoTableData.value = res.data.data; // 使用 userList.value 来更新 userList 的值
  });
}
function handleHpoCurrentChange(val) {
  pageNum.value = val;
  getHPO();
}
function handleHpoSizeChange(val) {
  pageSize.value = val;
  getHPO();
}

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
      duration: 5 * 1000
    });
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
          const filteredData = jsonData.filter(item => {
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
        const filteredData = jsonData.filter(item => {
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
    allFirstNode.value=[]
    treeData.value=[]
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
          const filteredData = jsonData.filter(item => {
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
        const filteredData = jsonData.filter(item => {
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
function clickHpo(row) {
  window.open(row.url, "_blank");
}
function findMatchingObjects(first, second, propA, propB) {
  // 新数组用于存储匹配的对象
  let matchingObjects = [];

  // 遍历第一个数组
  first.forEach(obj1 => {
    // 在第二个数组中查找具有相同属性值的对象
    let matchingObj2 = second.find(obj2 => obj1[propA] === obj2[propB]);

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
    const filteredData = jsonData.filter(item => {
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

getHPO();
</script>

<style lang="scss" scoped>
.analysis-icon {
  color: #0088cc;
}
:deep(.el-tabs--card > .el-tabs__header .el-tabs__nav) {
  border: 0 !important;
}

:deep(.el-tabs__item) {
  color: #000000 !important;
  background-color: #fff !important;
  margin-right: 3px;
  border-top-left-radius: 3px !important;
  border-top-right-radius: 3px !important;
  padding: 0 40px;
}

:deep(.el-tabs--top.el-tabs--card
    > .el-tabs__header
    .el-tabs__item:last-child) {
  padding-left: 40px;
  padding-right: 40px;
}

:deep(.el-tabs--top.el-tabs--card
    > .el-tabs__header
    .el-tabs__item:nth-child(2)) {
  padding-left: 40px;
  padding-right: 40px;
}

:deep(.el-tabs--card > .el-tabs__header .el-tabs__item) {
  border-top: 1px solid #e4e7ed;
  border-left: 1px solid #e4e7ed !important;
  border-right: 1px solid #e4e7ed;
  border-bottom: 1px solid #e4e7ed;
}
/* 鼠标选中时样式 */
:deep(.el-tabs__item.is-active) {
  color: #ffffff !important;
  background-color: #0088cc !important;
}
.text_warp {
  max-width: 500px;
  white-space: wrap;
}
.text_els {
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
// .hpo_id_underline-text {
//   color: #409eff;

// }  .hpo_id_underline-text::after {
//     content: "";
//     display: block;
//     width: 65%;
//     height: 1px;
//     background: #409eff;
//     position: absolute;
//     left: 0;
//     bottom: 25%;
//   }
</style>
<style>
.el-popper.is-dark {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  max-width: 600px;
  color: black;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-dark .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}
</style>

