<template>
  <div class="app-container">
      <div class="home">
          <el-table :data="genesTableData" style="width: 100%" v-loading="loading" border  element-loading-text="数据获取中...">
              <el-table-column label="tax_id" width="80" prop="taxId" fixed>
              </el-table-column>
              <el-table-column label="GeneID" prop="geneId" show-overflow-tooltip width="80" />
              <el-table-column label="Symbol" prop="symbol"  width="120" />
              <el-table-column label="LocusTag" prop="locusTag" show-overflow-tooltip width="100" />
              <el-table-column label="Synonyms" prop="synonyms" show-overflow-tooltip width="140" />
              <el-table-column label="dbXrefs" prop="dbXrefs" show-overflow-tooltip width="160" />
              <el-table-column label="chromosome" prop="chromosome" show-overflow-tooltip
                  width="110" />
              <el-table-column label="map_location" prop="mapLocation" show-overflow-tooltip width="130"
                  align="center" />
              <el-table-column label="description" prop="description" show-overflow-tooltip width="180"
                  align="center" />
              <el-table-column label="type_of_gene" prop="typeOfGene" show-overflow-tooltip width="120" />
              <el-table-column label="Symbol_from_nomenclature_authority" prop="symbolFromNomenclatureAuthority" show-overflow-tooltip width="120" align="center"/>
              <el-table-column label="Full_name_from_nomenclature_authority" prop="fullNameFromNomenclatureAuthority" show-overflow-tooltip width="200" />
              <el-table-column label="Nomenclature_status" prop="nomenclatureStatus" show-overflow-tooltip width="160" />
              <el-table-column label="Other_designations" prop="otherDesignations" show-overflow-tooltip width="200" />
              <el-table-column label="Modification_date" prop="modificationDate" show-overflow-tooltip width="140" />
              <el-table-column label="Feature_type" prop="featureType" show-overflow-tooltip width="140" />

          </el-table>
          <el-pagination style="margin-top: 1vh" layout="prev, pager, next,sizes,total " :total="totalCount"
              :page-sizes="[100, 200, 300, 400]" v-model:page-size="pageSize" @size-change="handleHpoSizeChange"
              @current-change="handleHpoCurrentChange" />
      </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getGeneList } from "@/api/project";
const genesTableData = ref([]);
const totalCount = ref(0);
const pageSize = ref(20);
const pageNum = ref(1);
const loading = ref(false);

/**获取HG19表格数据 */
function getGenes() {
  loading.value = true
  getGeneList(pageNum.value, pageSize.value).then((res) => {
      totalCount.value = res.data.count;
      genesTableData.value = res.data.data; // 使用 userList.value 来更新 userList 的值
      loading.value = false

  }).catch((err) => {
      loading.value = false

      console.log(err);
  });
}
function handleHpoCurrentChange(val) {
  pageNum.value = val;
  getGenes();
}
function handleHpoSizeChange(val) {
  pageSize.value = val;
  getGenes();
}
getGenes();
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