<template>
  <div class="app-container">
    <el-dialog v-model="geneDialogVisible" :title="geneHpoId + '对应基因'" width="70%">
      <el-table :data="geneData" border height="70vh" v-loading="geneDataLoading">
        <el-table-column label="Symbol" prop="symbol" width="120" fixed/>

        <el-table-column label="tax_id" width="80" prop="taxId" >
        </el-table-column>
        <el-table-column label="GeneID" prop="geneId" show-overflow-tooltip width="80" />
        <el-table-column label="LocusTag" prop="locusTag" show-overflow-tooltip width="100" />
        <el-table-column label="Synonyms" prop="synonyms" show-overflow-tooltip width="140" />
        <el-table-column label="dbXrefs" prop="dbXrefs" show-overflow-tooltip width="160" />
        <el-table-column label="chromosome" prop="chromosome" show-overflow-tooltip width="110" />
        <el-table-column label="map_location" prop="mapLocation" show-overflow-tooltip width="130" align="center" />
        <el-table-column label="description" prop="description" show-overflow-tooltip width="180" align="center" />
        <el-table-column label="type_of_gene" prop="typeOfGene" show-overflow-tooltip width="120" />
        <el-table-column label="Symbol_from_nomenclature_authority" prop="symbolFromNomenclatureAuthority"
          show-overflow-tooltip width="120" align="center" />
        <el-table-column label="Full_name_from_nomenclature_authority" prop="fullNameFromNomenclatureAuthority"
          show-overflow-tooltip width="200" />
        <el-table-column label="Nomenclature_status" prop="nomenclatureStatus" show-overflow-tooltip width="160" />
        <el-table-column label="Other_designations" prop="otherDesignations" show-overflow-tooltip width="200" />
        <el-table-column label="Modification_date" prop="modificationDate" show-overflow-tooltip width="140" />
        <el-table-column label="Feature_type" prop="featureType" show-overflow-tooltip width="140" />
      </el-table>
      <el-pagination style="margin-top: 1vh;" layout="prev, pager, next,sizes,total " :page-sizes="[50, 100, 150, 200]" :total="geneTotalCount"
        v-model:page-size="genePageSize" @size-change="handleHpoGeneSizeChange"
        @current-change="handleHpoGeneCurrentChange" />

    </el-dialog>
    <el-dialog v-model="diseaseDialogVisible" :title="diseaseHpoId + '对应疾病'" width="70%">
      <el-table :data="dieaseData" border max-height="70vh" v-loading="dieaseDataLoading">
        <el-table-column property="diseaseId" label="diseaseId" width="200" />
        <el-table-column property="genes" label="genes" width="200" :formatter="formatterGenes" />
        <el-table-column property="hpoId" label="hpoId" width="160" />
        <el-table-column property="name" label="name" width="320" />
        <el-table-column property="nameZh" label="nameZh" />
<!-- 111 -->
      </el-table>
    </el-dialog>
    <div class="home">
      <el-table :data="hpoTableData" style="width: 100%" border element-loading-text="数据获取中..." v-loading="loading" height="70vh">
        <el-table-column label="HPO_ID" width="130">
          <template #default="scope">
            <el-link type="primary" @click="clickHpo(scope.row)">
              {{ scope.row.id }}&nbsp;
              <svg-icon icon-class="jump" class-name="analysis-icon " />
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="表型术语(英文)" prop="lbls" show-overflow-tooltip width="350" />
        <el-table-column label="表型术语(中文)" prop="lblsZh" show-overflow-tooltip width="200" />
        <el-table-column label="表型定义(英文)" prop="definition" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="表型定义(中文)" prop="definitionZh" show-overflow-tooltip />
        <el-table-column label="对应基因" width="100" align="center">
          <template #default="scope">
            <el-button type="primary" text bg size="small" @click="checkGene(scope.row.id)">查看基因</el-button>
            <!-- <el-link type="primary" @click="clickHpo(scope.row)">
              {{ scope.row.id }}&nbsp;
              <svg-icon icon-class="jump" class-name="analysis-icon " />
            </el-link> -->
          </template>
        </el-table-column>
        <el-table-column label="对应疾病" width="100" align="center">
          <template #default="scope">
            <el-button type="primary" text bg size="small" @click="checkDisease(scope.row.id)">查看疾病</el-button>
            <!-- <el-link type="primary" @click="clickHpo(scope.row)">
              {{ scope.row.id }}&nbsp;
              <svg-icon icon-class="jump" class-name="analysis-icon " />
            </el-link> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination style="margin-top: 1vh" layout="prev, pager, next,sizes,total " :total="totalCount"
        :page-sizes="[100, 200, 300, 400]" v-model:page-size="pageSize" @size-change="handleHpoSizeChange"
        @current-change="handleHpoCurrentChange" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getWebHpoJson, getDiseaseByHpo, getGeneByHpo, getGeneByHpoInfo } from "@/api/project";
const hpoTableData = ref([]);
const totalCount = ref(0);
const pageSize = ref(20);
const pageNum = ref(1);
const genePageNum = ref(1);
const genePageSize = ref(20);
const geneTotalCount = ref(0);
const loading = ref(false);
const geneHpoId = ref("")
const diseaseHpoId = ref("")
const geneDialogVisible = ref(false)
const diseaseDialogVisible = ref(false)
const geneData = ref([])
const dieaseData = ref([])
const dieaseDataLoading = ref(false)
const geneDataLoading = ref(false)

/**获取HPO表格数据 */
function getHPO() {
  loading.value = true

  getWebHpoJson(pageNum.value, pageSize.value).then((res) => {
    totalCount.value = res.data.count;
    hpoTableData.value = res.data.data; // 使用 userList.value 来更新 userList 的值
    loading.value = false

  }).catch((err) => {
    loading.value = false
    console.log(err);
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
async function handleHpoGeneCurrentChange(val) {
  genePageNum.value = val;
  geneData.value = await getGeneByHpoData(geneHpoId.value, genePageNum.value, genePageSize.value);

}
async function handleHpoGeneSizeChange(val) {
  genePageSize.value = val;
  geneData.value = await getGeneByHpoData(geneHpoId.value, genePageNum.value, genePageSize.value);

}
function clickHpo(row) {
  window.open(row.url, "_blank");
}
async function checkDisease(params) {
  try {
    diseaseHpoId.value = params
    diseaseDialogVisible.value = true
    dieaseDataLoading.value = true
    // 调用方法 getDiseaseData，等待其执行完成并获取结果
    dieaseData.value = await getDiseaseData(params);
    // 在这里可以使用方法 getDiseaseData 返回的结果进行后续操作
    dieaseDataLoading.value = false

  } catch (err) {
    dieaseDataLoading.value = false
    // 处理错误
    console.error(err);
  }
}
async function checkGene(params) {
  try {
    geneHpoId.value = params
    geneDialogVisible.value = true
    geneDataLoading.value = true
    // 调用方法 getGeneByHpoData，等待其执行完成并获取结果
    geneData.value = await getGeneByHpoData(params, genePageNum.value, genePageSize.value);
    geneDataLoading.value = false
    // 在这里可以使用方法 getGeneByHpoData 返回的结果进行后续操作
  } catch (err) {
    // 处理错误
    geneDataLoading.value = false
    console.error(err);
  }
}
async function getDiseaseData(params) {
  try {
    const res = await getDiseaseByHpo(params);
    return res.data.data; // 返回获取的结果
  } catch (err) {
    console.log(err);
    throw err; // 抛出错误
  }
}
async function getGeneByHpoData(params, genePageNum, genePageSize) {
  try {
    const res = await getGeneByHpoInfo(params, genePageNum, genePageSize);
    geneTotalCount.value=res.data.count
    return res.data.data; // 返回获取的结果
  } catch (err) {
    console.log(err);
    throw err; // 抛出错误
  }
}
async function getGeneData(params) {
  try {
    const res = await getGeneByHpo(params);
    return res.data; // 返回获取的结果
  } catch (err) {
    console.log(err);
    throw err; // 抛出错误
  }
}
const formatterGenes = (row, column) => {
  return row.genes.join()
};
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

:deep(.el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:last-child) {
  padding-left: 40px;
  padding-right: 40px;
}

:deep(.el-tabs--top.el-tabs--card > .el-tabs__header .el-tabs__item:nth-child(2)) {
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
//   }</style>
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