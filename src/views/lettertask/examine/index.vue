<template>
  <div class="app-container">
    <el-dialog v-model="uploadVCFVisible" title="关系指定/数据上传" width="70vw" max-height="70vh">
      <!-- <el-dialog v-model="selectFileVisible" width="500" append-to-body height="auto">
        <template #header>
          <el-text truncated tag="b">选择{{taskFileName}}文件对应样本</el-text>
        </template>
        <div class="my-header">
          <div>样本</div>
          <div v-if="getFileExtension(taskFileName)=='fasta'">fastq Reads信息</div>
        </div>
        <div class="my-header">
          <el-select v-model="selectFileData.genealogyId" placeholder="Please select ">
            <el-option
              v-for="(item, index) in genealogiesData"
              :key="item.id"
              :label="martchRelationLabel(item)"
              :value="item.grelation"
            >
           

            </el-option>
          </el-select>
          <el-select
            v-model="item.fastqReads"
            placeholder="Please select "
            v-if="getFileExtension(taskFileName)=='fasta'"
          >
            <el-option label="R1" value="R1"></el-option>
            <el-option label="R2" value="R2"></el-option>
          </el-select>
        </div>

        <template #footer>
          <div class="dialog-footer">
            <el-button @click="selectFileVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmAddRealtionFile">确认新增</el-button>
          </div>
        </template>
      </el-dialog>-->
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>数据上传</span>
          </div>
        </template>
        <el-upload
          class="upload-demo"
          style="margin-bottom: 1vh"
          ref="taskUploadRef"
          drag
          :on-exceed="handleExceed"
          :on-success="handleUploadSuccess"
          :data="uploadData"
          :action="uploadFileUrl"
          name="file"
          :headers="headers"
          accept=".vcf, .fasta"
          :multiple="true"
          :on-remove="handleRemove"
          :file-list="uploadFileList"
          element-loading-text="正在上传"
        >
          <el-icon class="el-icon--upload">
            <upload-filled />
          </el-icon>
          <div class="el-upload__text">
            拖曳到此 或
            <em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              <el-text>若VCF/FASTA文件大小</el-text>
              <el-text type="danger">超过1G</el-text>
              <el-text>，请自行上传至目录</el-text>
              <el-text type="primary">{{ uploadData.path }}</el-text>
            </div>
          </template>
        </el-upload>
        <el-card shadow="never">
          <template #header>关系指定</template>
          <el-table :data="taskUploadData" style="width: 100%">
            <el-table-column label="文件名" prop="fileName"></el-table-column>
            <!-- <el-table-column label="添加文件对应样本" width="130" align="center">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="addTaskFile(scope.row)"
                :disabled="scope.row.TaskFile!=null"
              >新增文件对应</el-button>
            </template>
            </el-table-column>-->
            <el-table-column label="样本" align="center" width="200">
              <template #default="scope">
                <el-select v-model="scope.row.TaskFile.genealogyId" placeholder="请选择样本 ">
                  <el-option
                    v-for="(item, index) in genealogiesData"
                    :key="index"
                    :label="martchRelationLabel(item)"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </template>
              <!-- <template #default="scope">
              <div style="display:flex;flex-wrap: wrap;">
                <el-tag v-for="item in scope.row.taskFiles ">{{ item.fileName }}</el-tag>
              </div>
              </template>-->
            </el-table-column>
            <el-table-column label="fastq Reads信息" align="center" width="220">
              <template #default="scope">
                <el-select
                  v-model="scope.row.TaskFile.fastqReads"
                  placeholder="请选择fastq Reads信息 "
                  v-if="getFileExtension(scope.row.fileName)=='fasta'"
                >
                  <el-option label="R1" value="R1"></el-option>
                  <el-option label="R2" value="R2"></el-option>
                </el-select>
              </template>
              <!-- <template #default="scope">
              <div style="display:flex;flex-wrap: wrap;">
                <el-tag v-for="item in scope.row.taskFiles ">{{ item.fileName }}</el-tag>
              </div>
              </template>-->
            </el-table-column>
            <el-table-column label="文件大小" width="100" prop="size"></el-table-column>
            <el-table-column label="上传时间" width="200" prop="uploadTime"></el-table-column>

            <el-table-column width="80">
              <template #header>
                <el-button size="small" @click="refreshGetTaskUploadData">刷新</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-card>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="uploadVCFVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmUploadEnd">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="letterTasksFilterVisible" title="项目过滤" width="600">
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
          <el-checkbox-group v-model="letterTasksFilterForm.letterTasksAnalyzeState">
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
          <el-button type="primary" @click="confirmFilter">过滤</el-button>
        </div>
      </template>
    </el-dialog>
    <el-text class="mx-1" style="font-size: 20px; color: #0088cc">生信结果QC</el-text>
    <el-text class="mx-1" size="small">(共{{ totalNum }}条)</el-text>
    <div
      style="display: flex; flex-direction: row;align-items: center;justify-content: space-between;margin-top: 1vh; margin-bottom: 1vh"
    >
      <div>
        <el-input
          v-model="searchValue"
          style="width: 800px"
          :placeholder="searchValuePlaceholder"
          class="input-with-select"
        >
          <template #prepend>
            <el-select v-model="searchSelect" placeholder="请选择查找类型" style="width: 150px">
              <el-option label="先证者姓名" value="先证者姓名" />
              <el-option label="样本号" value="样本号" />
              <el-option label="项目号" value="项目号" />
              <el-option label="分析号" value="分析号" />
            </el-select>
          </template>
          <template #append>
            <el-button>查找</el-button>
          </template>
        </el-input>
      </div>
      <div>
        <el-button type="info">任务队列</el-button>
        <el-button type="primary">批量下发</el-button>
        <el-button type="success" @click="letterTasksFilterVisible = true">项目过滤</el-button>
      </div>
    </div>
    <el-table :data="letterTasks" border ref="letterTasksRef" size="small">
      <el-table-column type="selection" width="27" />
      <el-table-column label="分析编号" width="100" fixed>
        <template #default="scope">
          <span>
            BI{{ scope.row.homepath.match(/\/(\d+)$/)[1]
            }}{{ scope.row.id }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="样本上传" width="80" align="center">
        <template #default="scope">
          <el-button type="primary" @click="uploadSample(scope.row)" size="small">上传</el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="下发到报告" width="86" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            round
            @click="issueToReport(scope.row)"
            size="small"
            >下发</el-button
          >
        </template>
      </el-table-column>-->
      <el-table-column prop="name" label="分析进程" width="75" />
      <el-table-column prop="name" label="状态" width="50" />
      <el-table-column prop="name" label="Snp_start" width="80" />
      <el-table-column prop="name" label="Snp_end" width="80" />
      <el-table-column prop="name" label="批次号" width="65" />

      <el-table-column label="项目号" width="110" show-overflow-tooltip>
        <template #default="scope">
          <span>
            HY{{ scope.row.homepath.match(/\/(\d+)$/)[1]
            }}{{ scope.row.id }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="patientName" label="患者姓名" width="100" show-overflow-tooltip />
      <el-table-column prop="name" width="70">
        <template #header>
          拆分
          <svg-icon icon-class="question-mark" @click="explainSplit" />
        </template>
      </el-table-column>
      <el-table-column prop="name" width="90">
        <template #header>
          亲缘关系
          <svg-icon icon-class="question-mark" @click="explainKinship" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="母源污染" width="80" />
      <el-table-column prop="name" width="115" :formatter="formatterGender">
        <template #header>
          <div style="display: flex; flex-direction: column; align-items: center">
            <div>性别检测</div>
            <div>(录入/检测/判定)</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="detectionChip"
        label="检测芯片"
        width="100"
        :formatter="formatterDetectionChip"
      />
      <el-table-column prop="name" label="20*覆盖度" width="90" />
      <el-table-column prop="name" label="测序数据量Mb" width="110" />
      <el-table-column prop="name" label="捕获效率" width="80" />
      <el-table-column prop="name" label="duplication rate(%)" width="135" />
      <el-table-column prop="name" label="平均测序深度" width="110" />
      <el-table-column width="140" label="下发至报告/返工">
        <template #default="scope">
          <el-button-group>
            <el-button type="success" @click="issueToReport(scope.row)" size="small">下发</el-button>
            <el-button type="danger" @click="reWork(scope.row)" size="small">返工</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  getLetterTasks,
  getTaskGenealogies,
  getTaskUploadFileInfo,
  postTaskFile
} from "@/api/project.js";
import { getToken } from "@/utils/auth";
const { proxy } = getCurrentInstance();
const letterTasksFilterVisible = ref(false);
const selectFileVisible = ref(false);
const uploadVCFVisible = ref(false);
const letterTasksFilterForm = ref({
  letterTasksDate: "",
  letterTasksState: ["显示"],
  letterTasksAnalyzeState: ["分析中"]
});
const selectFileData = ref([
  {
    filePath: "",
    genealogyId: 0,
    fileName: "",
    fastqReads: ""
  }
]);
const relationships = [
  {
    value: "0",
    label: "本人"
  },
  {
    value: "1",
    label: "之父"
  },
  {
    value: "2",
    label: "之母"
  },
  {
    value: "3",
    label: "之子"
  },
  {
    value: "4",
    label: "之女"
  },
  {
    value: "5",
    label: "之哥"
  },
  {
    value: "6",
    label: "之妹"
  },
  {
    value: "7",
    label: "之姐"
  },
  {
    value: "8",
    label: "之弟"
  },
  {
    value: "9",
    label: "之妻"
  },
  {
    value: "10",
    label: "之夫"
  },
  {
    value: "11",
    label: "之姑"
  },
  {
    value: "12",
    label: "之舅"
  },
  {
    value: "13",
    label: "之姨"
  },
  {
    value: "14",
    label: "其他(男性)"
  },
  {
    value: "15",
    label: "其他(女性)"
  },
  {
    value: "16",
    label: "其他(性别不明)"
  }
];
// 为id那个人添加对应文件
const taskPeopleId = ref(null);
const taskId = ref(null);
const taskFileName = ref("");
const selectFileValue = ref([]);
const searchValue = ref("");
const genealogiesData = ref([]);
const taskUploadData = ref([]);
const taskUploadRef = ref();
const patientName = ref("");
const searchSelect = ref("先证者姓名");
const totalNum = ref(0);
const searchValuePlaceholder = computed(() => `请输入${searchSelect.value}`);
//   const addSelectRealtion = computed(() => {
//   // 使用map函数创建新的选项数组，包含从b数组中查找得到的testb作为label
//   return genealogiesData.value.map(item => {
//     // 查找b数组中与当前item.valuea匹配的对象
//     const matchedItem = relationships.find(bItem => bItem.valuea === item.valuea);
//     // 返回包含value和label的新对象，如果未找到匹配项则label为空字符串
//     return {
//       value: item.valuea,
//       label: matchedItem ? matchedItem.testb : ''
//     };
//   });
// });
const uploadFileList = ref([]);
const uploadData = ref({
  path: ""
});
const uploadFileUrl = ref(
  import.meta.env.VITE_APP_BASE_API + "/task/uploadTaskFile"
);
const headers = ref({ Authorization: "Bearer " + getToken() });
const letterTasks = ref([]);
const letterTaskLoading = ref(false);
/** 查询生信任务列表 */
function getLetterList() {
  letterTaskLoading.value = true;

  getLetterTasks().then(res => {
    letterTaskLoading.value = false;
    totalNum.value = res.data.count;
    letterTasks.value = res.data.data; // 使用 userList.value 来更新 userList 的值
  });
}
/**下发到报告 */
function issueToReport(params) {
  proxy.$modal.msgWarning("暂不可用");
}
/**返工 */
function reWork(params) {
  proxy.$modal.msgWarning("暂不可用");
}
/**解释亲缘关系 */
function explainKinship(params) {
  proxy.$modal.msgWarning("暂不可用");
}
/**解释拆分 */
function explainSplit(params) {
  proxy.$modal.msgWarning("暂不可用");
}
function confirmFilter(params) {
  letterTasksFilterVisible.value = false;
  proxy.$modal.msgWarning("暂不可用");
}
function formatterDetectionChip(params) {
  return "Agilent V6";
}
const formatterGender = (row, column) => {
  if (row.gender == null || row.gender == "unknown") {
    return "不明/未知/未知";
  } else if (row.gender == "man") {
    return "男/未知/未知";
  } else {
    return "女/未知/未知";
  }
};
async function uploadSample(params) {
  try {
    patientName.value = params.patientName;
    taskId.value = params.id;
    uploadData.value.path = params.homepath + "/" + params.id;
    uploadVCFVisible.value = true;
    // 调用方法 getGenealogiesData等，等待其执行完成并获取结果

    genealogiesData.value = await getGenealogiesData(params.id);
    genealogiesData.value.push({
      grelation: "0",
      gname: "",
      id: 0,
      fastqReads: ""
    });
    let tempArr = await getTaskUploadData(params.id);
    taskUploadData.value = tempArr.map(item => {
      // 检查当前对象的task是否为null
      if (item.TaskFile == null) {
        // 如果为null，则替换为{t2:""}
        return {
          ...item,
          TaskFile: { genealogyId: "", fileName: "", filePath: "", fastqReads: "",isfalse:true }
        };
      } else {
        // 否则保持原样
        return item;
      }
    });
    // dieaseDataLoading.value = false

    // 在这里可以使用方法 getGenealogiesData 返回的结果进行后续操作
  } catch (err) {
    // 处理错误
    // dieaseDataLoading.value = false
    console.error(err);
  }
}
// 获取任务的家系样本
async function getGenealogiesData(params) {
  try {
    let temp = {
      taskId: params
    };
    const res = await getTaskGenealogies(temp);
    return res.data; // 返回获取的结果
  } catch (err) {
    console.log(err);
    throw err; // 抛出错误
  }
}
// 获取任务的上传文件信息
async function getTaskUploadData(params) {
  try {
    let temp = {
      taskId: params
    };
    const res = await getTaskUploadFileInfo(temp);
    return res.data; // 返回获取的结果
  } catch (err) {
    console.log(err);
    throw err; // 抛出错误
  }
}
// 刷新任务的上传文件信息
async function refreshGetTaskUploadData(params) {
  let temp = {
    taskId: taskId.value
  };
  getTaskUploadFileInfo(temp)
    .then(res => {
      let tempArr = res.data;
    taskUploadData.value = tempArr.map(item => {
      // 检查当前对象的task是否为null
      if (item.TaskFile == null) {
        // 如果为null，则替换为{t2:""}
        return {
          ...item,
          TaskFile: { genealogyId: "", fileName: "", filePath: "", fastqReads: "",isfalse:true }
        };
      } else {
        // 否则保持原样
        return item;
      }
    });
      proxy.$modal.msgSuccess("刷新数据文件成功");
    })
    .catch(err => {
      console.log(err);
    });
}
function confirmUploadEnd(params) {
  uploadFileList.value = [];
  taskUploadRef.value.clearFiles();
  // 保留含有isfalse属性的对象且有genealogyId的属性，并仅保留id、name属性及添加test属性
  const newArray = taskUploadData.value
    .filter(item => item.TaskFile.hasOwnProperty("isfalse")&& item.TaskFile.genealogyId !== "")
    .map(obj => ({
      genealogyId: obj.TaskFile.genealogyId,
      fileName: obj.fileName,
      fastqReads: obj.TaskFile.fastqReads,
      filePath: uploadData.value.path
    }));
  if (newArray.length == 0) {
    proxy.$modal.msgWarning("当前未新增数据文件关系");
    uploadVCFVisible.value = false;

  } else {
    postTaskFile(newArray)
      .then(res => {
        proxy.$modal.msgSuccess("家系样本与数据文件关系添加成功");
        uploadVCFVisible.value = false;
      })
      .catch(err => {
        console.log(err);
        uploadVCFVisible.value = false;
      });
  }
}
const handleExceed = files => {
  uploadList.value = [];
  taskUploadRef.value.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  taskUploadRef.value.handleStart(file);
  // / 在文件数量超出限制时自动上传文件
  taskUploadRef.value.submit();
};
function handleUploadSuccess(res, file) {
  if (res.succeed == true) {
    uploadFileList.value.push({ name: file.name, url: res.data.url });
    proxy.$modal.msgSuccess("文件上传成功");
    refreshGetTaskUploadData();
  } else {
    proxy.$modal.msgError("文件上传失败");
  }
}

function handleRemove(params) {
  uploadFileList.value = [];
}
function martchRelationLabel(params) {
  return (
    "患者" + patientName.value + matchRelation(params.grelation) + params.gname
  );
}
function matchRelation(params) {
  // 使用 find 方法找到具有特定 id 值的对象
  let foundObject = relationships.find(item => item.value == params);

  // 如果找到了对象，则返回该对象的 value 属性值，否则返回 undefined
  return foundObject ? foundObject.label : "其他(性别不明)";
}
const formatterName = (row, column) => {
  if (row.TaskFile == null) {
    return "";
  } else {
    if (row.TaskFile.genealogyId == 0) {
      return "患者" + patientName.value + "本人";
    } else {
      return (
        "患者" + patientName.value + matchRelation(row.TaskFile.genealogyId)
      );
    }
  }
};
function deepEqual(obj1, obj2) {
  // 判断是否为同一对象
  if (obj1 === obj2) {
    return true;
  }

  // 判断是否是对象（非null）并且不属于不同类型
  if (
    obj1 == null ||
    typeof obj1 !== "object" ||
    obj2 == null ||
    typeof obj2 !== "object"
  ) {
    return false;
  }

  // 获取对象的键列表
  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);

  // 比较对象键的数量
  if (keys1.length !== keys2.length) {
    return false;
  }

  // 递归比较每一个键对应的值
  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}
//可以优化
function addTaskFile(params) {
  taskFileName.value = params.fileName;
  if (params.gname == patientName.value) {
    taskPeopleId.value = 0;
  } else {
    taskPeopleId.value = params.id;
  }
  let temp = {
    filePath: "",
    genealogyId: 0,
    fileName: "",
    fastqReads: ""
  };
  if (deepEqual(selectFileData.value[0], temp)) {
    selectFileData.value[0] = {
      filePath: uploadData.value.path,
      genealogyId: taskPeopleId.value,
      fileName: "",
      fastqReads: ""
    };
  }
  selectFileVisible.value = true;
}
function confirmAddRealtionFile(params) {
  console.log(selectFileData.value);
  // postTaskFile(selectFileData.value)
  //   .then(res => {
  //     selectFileData.value = [{
  //     filePath: "",
  //     genealogyId: 0,
  //     fileName: "",
  //     fastqReads: ""
  //   }];
  //     proxy.$modal.msgSuccess("家系样本与数据文件关系添加成功");
  //   })
  //   .catch(err => {
  //     console.log(err);
  //   });
  // selectFileVisible.value = false;
}
function getFileExtension(filename) {
  if (typeof filename !== "string") {
    throw new Error("Input must be a string");
  }

  let lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    // 没有"." 或者"."是第一个字符（隐藏文件无后缀）
    return "";
  }
  return filename.substring(lastDotIndex + 1);
}
function addTaskRelationFileRow(params) {
  selectFileData.value.push({
    filePath: uploadData.value.path,
    genealogyId: taskPeopleId.value,
    fileName: "",
    fastqReads: ""
  });
}
getLetterList();
</script>

<style lang="scss" scoped>
.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
.my-header {
  margin-top: 1vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
</style>