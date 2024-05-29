<template>
  <div class="app-container">
    <el-table :data="hpoTableData" style="width: 70%">
      <el-table-column type="expand">
        <template #default="props">
          <div m="4">
            <p m="t-0 b-2">hpoId: {{ props.row.hpoId }}</p>
            <p m="t-0 b-2">definition: {{ props.row.definition }}</p>
            <p m="t-0 b-2">definitionZh: {{ props.row.definitionZh }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="lbls" prop="lbls" />
      <el-table-column label="lblsZh" prop="lblsZh" />
      <el-table-column label="url" prop="url" />
    </el-table>
    <el-pagination
      layout="prev, pager, next,sizes "
      :total="1000"
      :page-sizes="[100, 200, 300, 400]"
      v-model:page-size="pageSize"
    />
    <div class="mt-4">
      <el-input
        v-model="hpoSearchValue"
        style="max-width: 600px"
        placeholder="Please input"
        class="input-with-select"
      >
        <template #suffix>
          <el-icon class="el-input__icon" @click="searchHPO">
            <search />
          </el-icon>
        </template>
        <template #append>
          <el-button @click="searchClick">提交</el-button>
        </template>
      </el-input>
    </div>

    <el-tree-v2
      style="max-width: 600px"
      :data="treeData"
      :height="208"
      :props="props"
      show-checkbox
      :check-strictly="true"
      :highlight-current="true"
      v-loading="searchLoading"
      element-loading-text="搜索中..."
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
const treeData = ref([]);
const hpoTableData = ref([]);
const pageSize = ref(100);

const input = ref("糖尿病");
const hpoSearchValue = ref("");
const searchLoading = ref(false);
const currentPage2 = ref(1);
const { proxy } = getCurrentInstance();
const props = {
  value: "ids",
  label: "text",
  children: "children"
};
const searchClick = async () => {
  console.log(import.meta.env);
  // try {
  //   const response = await axios.get("../../../src/assets/json/result.json");
  //   const jsonData = response.data;
  //   const filteredData = jsonData.filter(item => {
  //     return item.text.toLowerCase().includes(input.value.toLowerCase());
  //   });
  //   treeData.value = filteredData;
  // } catch (error) {
  //   console.error("Error fetching or parsing JSON:", error);
  // }
};
/**搜索获得对应的HPO信息 */
async function searchHPO() {
  try {
    searchLoading.value = true;
    let mode = import.meta.env.MODE;
    let hpoLocalPath =
      mode == "development"
        ? "../../../public/assets/test.json"
        : "../../../assets/test.json";
    const response = await axios.get(hpoLocalPath);
    const jsonData = response.data;
    const filteredData = jsonData.filter(item => {
      return item.text
        .toLowerCase()
        .includes(hpoSearchValue.value.toLowerCase());
    });
    treeData.value = filteredData;
    searchLoading.value = false;
  } catch (error) {
    searchLoading.value = false;

    console.error("Error fetching or parsing JSON:", error);
  }
}
function handleCurrentChange() {}
</script>