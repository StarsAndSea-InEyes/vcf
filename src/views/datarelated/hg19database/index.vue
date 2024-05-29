<template>
    <div class="app-container">
        <div class="home">
            <el-table :data="hg19TableData" style="width: 100%" v-loading="loading" border  element-loading-text="数据获取中...">
                <el-table-column label="AlleleID" width="80" prop="alleleId" fixed>
                </el-table-column>
                <el-table-column label="Type" prop="type" show-overflow-tooltip width="180" />
                <el-table-column label="Name" prop="hgName"  width="400" />
                <el-table-column label="GeneID" prop="geneId" show-overflow-tooltip width="80" />
                <el-table-column label="GeneSymbol" prop="geneSymbol" show-overflow-tooltip width="110" />
                <el-table-column label="HGNC_ID" prop="hgncId" show-overflow-tooltip width="130" />
                <el-table-column label="ClinicalSignificance" prop="clinicalSignificance" show-overflow-tooltip
                    width="200" />
                <el-table-column label="ClinSigSimple" prop="clinSigSimple" show-overflow-tooltip width="115"
                    align="center" />
                <el-table-column label="LastEvaluated" prop="lastEvaluated" show-overflow-tooltip width="120"
                    align="center" />
                <el-table-column label="RS#(dbSNP)" prop="dbSnp" show-overflow-tooltip width="120" />
                <el-table-column label="nsv/esv(dbVar)" prop="dbVar" show-overflow-tooltip width="120" align="center"/>
                <el-table-column label="RCVaccession" prop="rcVaccession" show-overflow-tooltip width="200" />
                <el-table-column label="PhenotypeIDS" prop="phenotypeIds" show-overflow-tooltip width="200" />
                <el-table-column label="PhenotypeList" prop="henotypeList" show-overflow-tooltip width="200" />
                <el-table-column label="Origin" prop="origin" show-overflow-tooltip width="210" />
                <el-table-column label="OriginSimple" prop="originSimple" show-overflow-tooltip width="110" />
                <el-table-column label="Assembly" prop="assembly" show-overflow-tooltip width="100" />
                <el-table-column label="ChromosomeAccession" prop="hromosomeAccession" show-overflow-tooltip
                    width="180" />
                <el-table-column label="Chromosome" prop="chromosome" show-overflow-tooltip width="120" />
                <el-table-column label="Start" prop="start" show-overflow-tooltip width="110" />
                <el-table-column label="Stop" prop="stop" show-overflow-tooltip width="110" />
                <el-table-column label="ReferenceAllele" prop="referenceAllele" show-overflow-tooltip width="130" />
                <el-table-column label="AlternateAllele" prop="alternateAllele" show-overflow-tooltip width="120" />
                <el-table-column label="Cytogenetic" prop="cytogenetic" show-overflow-tooltip width="110" />
                <el-table-column label="ReviewStatus" prop="reviewStatus" show-overflow-tooltip width="240" />
                <el-table-column label="NumberSubmitters" prop="numberSubmitters" show-overflow-tooltip width="150" align="center"/>
                <el-table-column label="Guidelines" prop="guidelines" show-overflow-tooltip width="200" align="center"/>
                <el-table-column label="TestedInGTR" prop="testedInGtr" show-overflow-tooltip width="110" />
                <el-table-column label="OtherIDs" prop="otherIds" show-overflow-tooltip width="200" />
                <el-table-column label="SubmitterCategories" prop="submitterCategories" show-overflow-tooltip
                    width="160" />
                <el-table-column label="VariationID" prop="variationId" show-overflow-tooltip width="110" />
                <el-table-column label="PositionVCF" prop="positionVcf" show-overflow-tooltip width="110" />
                <el-table-column label="ReferenceAlleleVCF" prop="eferenceAlleleVcf" show-overflow-tooltip
                    width="180" />
                <el-table-column label="AlternateAlleleVCF" prop="alternateAlleleVcf" show-overflow-tooltip
                    width="200" />
                <el-table-column label="SomaticClinicalImpact" prop="omaticClinicalImpact" show-overflow-tooltip
                    width="180" />
                <el-table-column label="SomaticClinicalImpactLastEvaluated" prop="somaticClinicalImpactLastEvaluated"
                    show-overflow-tooltip width="260" />
                <el-table-column label="ReviewStatusClinicalImpact" prop="reviewStatusClinicalImpact"
                    show-overflow-tooltip width="200" />
                <el-table-column label="Oncogenicity" prop="oncogenicity" show-overflow-tooltip width="160" />
                <el-table-column label="OncogenicityLastEvaluated" prop="oncogenicityLastEvaluated"
                    show-overflow-tooltip width="200" />
                <el-table-column label="ReviewStatusOncogenicity" prop="reviewStatusOncogenicity" show-overflow-tooltip
                    width="200" />
            </el-table>
            <el-pagination style="margin-top: 1vh" layout="prev, pager, next,sizes,total " :total="totalCount"
                :page-sizes="[100, 200, 300, 400]" v-model:page-size="pageSize" @size-change="handleHpoSizeChange"
                @current-change="handleHpoCurrentChange" />
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { getHg19List } from "@/api/project";
const hg19TableData = ref([]);
const totalCount = ref(0);
const pageSize = ref(20);
const pageNum = ref(1);
const loading = ref(false);

/**获取HG19表格数据 */
function getHg19() {
    loading.value = true
    getHg19List(pageNum.value, pageSize.value).then((res) => {
        totalCount.value = res.data.count;
        hg19TableData.value = res.data.data; // 使用 userList.value 来更新 userList 的值
        loading.value = false

    }).catch((err) => {
        loading.value = false

        console.log(err);
    });
}
function handleHpoCurrentChange(val) {
    pageNum.value = val;
    getHg19();
}
function handleHpoSizeChange(val) {
    pageSize.value = val;
    getHg19();
}
function clickHpo(row) {
    window.open(row.url, "_blank");
}
getHg19();
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