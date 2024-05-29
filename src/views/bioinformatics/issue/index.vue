<template>
  <div class="app-container">
    <!-- <el-dialog v-model="letterTasksFilterVisible" title="项目过滤" width="600">
      <el-form :model="letterTasksFilterForm" label-width="auto">
        <el-form-item label="分析日期:">
          <el-date-picker
            v-model="letterTasksFilterForm.letterTasksDate"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            unlink-panels
          />
        </el-form-item>
        <el-form-item label="分析状态:">
          <el-checkbox-group
            v-model="letterTasksFilterForm.letterTasksAnalyzeState"
          >
            <el-checkbox label="分析中">分析中</el-checkbox>
            <el-checkbox label="分析成功">分析成功</el-checkbox>
            <el-checkbox label="注释中">注释中</el-checkbox>
            <el-checkbox label="分析失败">分析失败</el-checkbox>
            <el-checkbox label="返工">返工</el-checkbox>
            <el-checkbox label="已下发到报告">已下发到报告</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="项目状态:">
          <el-checkbox-group v-model="letterTasksFilterForm.letterTasksState">
            <el-checkbox label="显示">显示</el-checkbox>
            <el-checkbox label="隐藏">隐藏</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="letterTasksFilterVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmFilter"> 过滤 </el-button>
        </div>
      </template>
    </el-dialog> -->
    <el-text class="mx-1" style="font-size: 20px; color: #0088cc"
      >NGS任务派工</el-text
    >
    <el-text class="mx-1" size="small">(共{{ totalNum }}条)</el-text>
    <!-- <el-row style="margin-top: 1vh; margin-bottom: 1vh" justify="space-between">
       <el-col :span="8">
         <el-input
           v-model="searchValue"
           style="max-width: 800px"
           :placeholder="searchValuePlaceholder"
           class="input-with-select"
         >
           <template #prepend>
             <el-select
               v-model="searchSelect"
               placeholder="请选择查找类型"
               style="width: 150px"
             >
               <el-option label="先证者姓名" value="先证者姓名" />
               <el-option label="样本号" value="样本号" />
               <el-option label="项目号" value="项目号" />
               <el-option label="分析号" value="分析号" />
             </el-select>
           </template>
           <template #append>
             <el-button>查找</el-button>
           </template>
         </el-input></el-col
       >
       <el-col :span="4"
         ><el-button type="info">任务队列</el-button>
         <el-button type="primary">批量下发</el-button>
         <el-button type="success" @click="letterTasksFilterVisible = true"
           >项目过滤</el-button
         >
       </el-col>
     </el-row> -->
    <el-table
      :data="ngstasks"
      border
      style="width: 100%"
      ref="issueNgsTasksRef"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="编号" width="200" fixed prop="serialNumber">
        <!-- <template #default="scope">
          <span
            >BI/HY{{ scope.row.homepath.match(/\/(\d+)$/)[1]
            }}{{ scope.row.id }}</span
          >
        </template> -->
      </el-table-column>
      <el-table-column width="200" align="center">
        <template #header>
          <div
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div>下发</div>
            <div>
              <el-button @click="batchIssue" style="color: #0088cc"
                >批量下发</el-button
              >
            </div>
          </div>
        </template>
        <template #default="scope">
          <el-button type="primary"  @click="issue(scope.row)"
            >下发</el-button
          >
        </template>
      </el-table-column>
      <el-table-column prop="name" label="是否完整" width="100" />

      <el-table-column label="制作人" width="200">
        <template #default="scope">
          <div
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div>{{ scope.row.producer }}</div>
            <div>
              <el-button @click="selectProducer(scope.row)" text type="primary"
                >选择</el-button
              >
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="报告审核" width="200">
        <template #default="scope">
          <div
            style="
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div>{{ scope.row.reviewer }}</div>
            <div>
              <el-button @click="selectReviewer(scope.row)" text type="primary">选择</el-button>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="检测项目" width="130" />
      <el-table-column prop="name" label="项目类型" width="130" />
      <el-table-column prop="name" label="分析编号" width="200" />
      <el-table-column prop="name" label="分析状态" width="100" />
      <el-table-column prop="name" label="项目号" width="200" />
      <el-table-column
        label="姓名"
        width="200"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="返工" width="100">
        <template #default="scope">
          <el-button type="danger"  @click="reWork(scope.row)"
            >返工</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
 
 <script setup>
import { ref, computed } from "vue";
//  import { getLetterTasks } from "@/api/project.js";
const { proxy } = getCurrentInstance();
const totalNum = ref(0);
const ngstasks = ref([
  {
    serialNumber: "1111111",
    producer: "test",
    reviewer: "test",
  },
]);
function batchIssue(params) {
  proxy.$modal.msgWarning("暂不可用");
};
function issue(params) {
  proxy.$modal.msgWarning("暂不可用");
  
};
function selectProducer(params) {
  proxy.$modal.msgWarning("暂不可用");
  
}
function selectReviewer(params) {
  proxy.$modal.msgWarning("暂不可用");
  
};
function reWork(params) {
  proxy.$modal.msgWarning("暂不可用");
  
}
//  const letterTasksFilterVisible = ref(false);
//  const letterTasksFilterForm = ref({
//    letterTasksDate: "",
//    letterTasksState: ['显示'],
//    letterTasksAnalyzeState: ['分析中'],
//  });
//  const searchValue = ref("");

//  const searchSelect = ref("先证者姓名");

//  const searchValuePlaceholder = computed(() => `请输入${searchSelect.value}`);
//  // const analysisNumber = computed((row) => `请输入${searchSelect.value}`);

//  const letterTasks = ref([]);
//  const letterTaskLoading = ref(false);
//  /** 查询生信任务列表 */
//  function getLetterList() {
//    letterTaskLoading.value = true;

//    getLetterTasks().then((res) => {
//      letterTaskLoading.value = false;
//      totalNum.value = res.data.count;
//      letterTasks.value = res.data.data; // 使用 userList.value 来更新 userList 的值
//    });
//  }
//  /**下发到报告 */
//  function issueToReport(params) {
//    proxy.$modal.msgWarning("暂不可用");
//  }
//  /**返工 */
//  function reWork(params) {
//    proxy.$modal.msgWarning("暂不可用");
//  }
//  /**解释亲缘关系 */
//  function explainKinship(params) {
//    proxy.$modal.msgWarning("暂不可用");
//  }
//  /**解释拆分 */
//  function explainSplit(params) {
//    proxy.$modal.msgWarning("暂不可用");
//  }
//  function confirmFilter(params) {
//    letterTasksFilterVisible.value = false;
//    proxy.$modal.msgWarning("暂不可用");
//  }
</script>
 
 <style lang="scss" scoped>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>