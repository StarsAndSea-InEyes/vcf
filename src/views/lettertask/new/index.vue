<template>
  <div class="app-container">
    <el-dialog v-model="uploadVCFVisible" title="数据上传" width="700">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>患者信息</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="4">患者姓名</el-col>
          <el-col :span="20">{{ patientForm.name }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4">患者症状</el-col>
          <el-col :span="20">{{ patientForm.clinicalSymptoms }}</el-col>
        </el-row>
      </el-card>
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>文件类型</span>
          </div>
        </template>
        <el-tabs v-model="uploadVcfOrFasta" class="demo-tabs" type="card">
          <el-tab-pane label="上传VCF数据" name="vcf">
            <el-upload class="upload-demo" style="margin-bottom: 1vh" ref="uploadRef" drag :on-exceed="handleExceed"
              :on-success="handleUploadSuccess" :data="uploadData" :action="uploadFileUrl" :limit="1"
              name="multipartFile" :headers="headers" accept=".vcf" :multiple="false" :on-remove="handleRemove"
              :file-list="uploadFileList" element-loading-text="正在上传">
              <el-icon class="el-icon--upload">
                <upload-filled />
              </el-icon>
              <div class="el-upload__text">
                拖曳到此 或
                <em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  <el-text>若VCF文件大小</el-text>
                  <el-text type="danger">超过1G</el-text>
                  <el-text>，请自行上传至目录</el-text>
                  <el-text type="primary">{{ uploadData.path }}</el-text>
                </div>
              </template>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="上传FASTA数据" name="fasta">
            <el-upload class="upload-demo" style="margin-bottom: 1vh" ref="uploadFastaRef" drag
              :on-exceed="handleFastaExceed" :on-success="handleUploadFastaSuccess" :data="uploadData"
              :action="uploadFileUrl" :limit="1" name="multipartFile" :headers="headers" accept=".fasta"
              :multiple="false" :on-remove="handleRemoveFasta" :file-list="uploadFastaFileList"
              element-loading-text="正在上传">
              <el-icon class="el-icon--upload">
                <upload-filled />
              </el-icon>
              <div class="el-upload__text">
                拖曳到此 或
                <em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  <el-text>若FASTA文件大小</el-text>
                  <el-text type="danger">超过1G</el-text>
                  <el-text>，请自行上传至目录</el-text>
                  <el-text type="primary">{{ uploadData.path }}</el-text>
                </div>
              </template>
            </el-upload>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="uploadVCFVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmUploadEnd">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <div style="display: flex; flex-direction: column; align-items: center">
      <el-card shadow="never" style="width: 80%">
        <template #header>
          <div class="card-header">
            <span>患者信息</span>
          </div>
        </template>

        <el-form :model="patientForm" label-width="120" label-position="left" require-asterisk-position="right"
          ref="patientFormRef">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="患者姓名" :rules="[
                {
                  required: true,
                  message: '请输入患者姓名',
                  trigger: 'blur',
                },
              ]" prop="name">
                <el-input v-model="patientForm.name" style="max-width: 260px" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="出生日期">
                <el-date-picker type="date" placeholder="可手动输入YYYY/MM/DD格式日期" value-format="YYYY-MM-DD"
                  format="YYYY/MM/DD" v-model="patientForm.birthdate" style="width: 260px" :disabled-date="disabledDate"
                  @change="getAge" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="年龄" prop="age" :rules="[
                { required: true, message: '请输入年龄' },
                { type: 'number', message: '年龄必须是数字' },
              ]">
                <el-input v-model.number="patientForm.age" style="max-width: 260px" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="性别" prop="sex" :rules="[{ required: true, message: '请选择一个选项' }]">
                <el-radio-group v-model="patientForm.sex">
                  <!-- <el-radio value="man" label="男">男</el-radio>
                  <el-radio value="woman" label="女">女</el-radio>
                  <el-radio value="unknown" label="不明">不明</el-radio>-->
                  <el-radio label="man">男</el-radio>
                  <el-radio label="woman">女</el-radio>
                  <el-radio label="unknown">不明</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="门诊/住院号">
                <el-input v-model="patientForm.outpatient" style="max-width: 260px" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="样本类型">
                <el-select v-model="patientForm.sampleType" clearable placeholder="Select" style="width: 200px">
                  <el-option v-for="item in sampleTypes" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-popover :visible="addSampleTypeVisible" placement="top" :width="300">
                  <p style="text-align: center; color: #0088cc">
                    您正在新建样本类型
                  </p>
                  <el-input v-model="addSampleType" placeholder="Please input" />
                  <div style="text-align: right; margin-top: 7px">
                    <el-button size="small" text @click="cancelEvent">cancel</el-button>
                    <el-button size="small" type="primary" @click="confirmEvent">confirm</el-button>
                  </div>
                  <template #reference>
                    <el-button @click="addSampleTypeVisible = true">新增</el-button>
                  </template>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收样日期">
                <el-date-picker type="date" placeholder="可手动输入YYYY/MM/DD格式日期" value-format="YYYY-MM-DD"
                  format="YYYY/MM/DD" v-model="patientForm.receivedDate" style="width: 260px" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="样本条码">
                <el-input v-model="patientForm.sampleBarCodes" style="max-width: 260px" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="送检医院">
                <div style="color: #0088cc">
                  {{ patientForm.submittingHospital }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="送检医生">
                <div style="color: #0088cc; width: 260px">
                  {{ patientForm.submittingPhysician }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="送检科室">
                {{ patientForm.submittingDepartment }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="发病年龄" prop="onsetAge" :rules="[{ type: 'number', message: '发病年龄必须是数字' }]">
                <el-input v-model.number="patientForm.onsetAge" style="max-width: 260px" />
                <!-- <el-select
                  v-model="patientForm.onsetAge"
                  clearable
                  placeholder="Select"
                  style="width: 260px"
                >
                  <el-option
                    v-for="item in onsetAges"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>-->
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="垂直家族史">
                <el-select v-model="patientForm.verticalFamilyHistory" clearable placeholder="Select"
                  style="width: 260px">
                  <el-option v-for="item in verticalFamilyHistorys" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="临床症状" prop="clinicalSymptoms" :rules="[
            {
              required: true,
              message: '请输入临床症状',
              trigger: 'blur',
            },
          ]">
            <el-input v-model="patientForm.clinicalSymptoms" style="width: 1215px" :rows="4" type="textarea"
              placeholder="Please input" />
          </el-form-item>
          <el-form-item label="临床诊断">
            <el-input v-model="patientForm.clinicalDiagnosis" style="width: 1215px" :rows="3" type="textarea"
              placeholder="Please input" />
          </el-form-item>
          <el-form-item label="检索工具">
            <el-card shadow="never" style="width: 1215px">
              <div style="
                  display: flex;
                  justify-content: center;
                  margin-bottom: 3px;
                ">
                请在下方输入框内输入临床表型(症状)
              </div>
              <div style="display: flex; justify-content: center">
                <el-input v-model="patientForm.symptom" style="width: 90%"
                  placeholder="为避免搜索结果数据量过大导致卡顿，输入英文字符搜索时长度需要大于等于3个" class="input-with-select" @keyup.enter="searchHPO"
                  @input="realtimeSearchHPO">
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
              <div style="display: flex; justify-content: center">
                <el-tree ref="localTree" lazy style="
                    width: 90%;
                    margin-bottom: 10px;
                    margin-top: 1vh;
                    max-height: 400px;
                    overflow-y: auto;
                    overflow-x: hidden;
                  " :data="treeData" :props="props" :load="loadNode" node-key="HPO_ID" show-checkbox check-strictly
                  highlight-current v-loading="searchLoading" element-loading-text="搜索中...">
                  <template #default="{ node }">
                    <span>{{ node.data.HPO_ID }}-{{ node.data.text }}</span>
                  </template>
                </el-tree>
              </div>
            </el-card>
          </el-form-item>
          <el-form-item label="辅助诊断检索池">
            <el-card shadow="never" style="
                width: 100%;
                min-height: 100px;
                display: flex;
                flex-wrap: wrap;
              ">
              <el-tag v-for="tag in patientForm.auxiliaryDiagnosis" :key="tag.HPO_ID" closable
                :disable-transitions="false" @close="closeAuxiliaryDiagnosis(tag)" style="margin-right: 10px">{{
                  tag.HPO_ID }}-{{ tag.text }}</el-tag>
            </el-card>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="夫妻携带筛查" prop="conjugalCarryScreening"
                :rules="[{ required: true, message: '请选择一个选项' }]">
                <el-radio-group v-model="patientForm.conjugalCarryScreening" @change="getV">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="报告模板">
                <el-select v-model="patientForm.reportTemplate" clearable placeholder="Select" style="width: 260px">
                  <el-option v-for="item in reportTemplates" :key="item.value" :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="检测项目">
            <el-select v-model="patientForm.testItem" placeholder="Select" style="width: 260px">
              <el-option v-for="item in testItems" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
      <el-card shadow="never" style="width: 80%">
        <template #header>
          <div class="card-header">
            <span>家系样本栏</span>
          </div>
        </template>
        <el-row :gutter="20">
          <el-col :span="4">序号</el-col>
          <el-col :span="5">姓名</el-col>
          <el-col :span="5">与先证者关系</el-col>
          <el-col :span="4">是否有类似症状</el-col>
          <el-col :span="4">启动相同项目</el-col>
          <el-col :span="2"></el-col>
        </el-row>
        <el-row :gutter="20" style="position: relative" v-for="(item, index) in familySample" :key="index">
          <el-col :span="4">家系成员{{ index + 1 }}</el-col>
          <el-col :span="5">
            <el-input v-model="item.name" style="width: 80%" placeholder="Please input" />
          </el-col>
          <el-col :span="5">
            <el-select v-model="item.relationship" clearable placeholder="Select">
              <el-option v-for="item in relationships" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-radio-group v-model="item.hasSymptom">
              <el-radio value="man" :label="true">是</el-radio>
              <el-radio value="woman" :label="false">否</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="4">
            <el-radio-group v-model="item.startSameProject">
              <el-radio value="man" :label="true">是</el-radio>
              <el-radio value="woman" :label="false">否</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="2">
            <el-icon style="position: absolute; top: 20%" @click="deleteAssociatedSample(index)">
              <CloseBold />
            </el-icon>
          </el-col>
        </el-row>
        <el-button round @click="addAssociatedSample" type="primary">添加关联样本</el-button>
      </el-card>
      <el-button style="
          margin-top: 1vh;
          width: 80%;
          height: 50px;
          font-size: 22px;
          color: #0088cc;
        " @click="createTask" round plain>创建任务</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { getCreateTask, postGenealogy } from "@/api/project.js";
import useUserStore from "@/store/modules/user";
import { genFileId } from "element-plus";
import { getToken } from "@/utils/auth";
import axios from "axios";
const userStore = useUserStore();
const uploadData = ref({
  path: "",
});
const uploadFileList = ref([]);
const uploadFastaFileList = ref([]);
const uploadFileUrl = ref(
  import.meta.env.VITE_APP_BASE_API + "/files/uploadMultipartFile"
); // 上传文件服务器地址
const headers = ref({ Authorization: "Bearer " + getToken() });
const value = ref("");
const textarea = ref("");
const treeData = ref([]);
const uploadVcfOrFasta = ref("vcf");
const uploadVCFVisible = ref(false);
const searchLoading = ref(false);
const { proxy } = getCurrentInstance();
let localSelectNodes = ref([]);
let allFirstNode = ref([]);
let timer = ref(null);
const addSampleType = ref("");
const props = {
  value: "HPO_ID",
  label: "text",
  children: "children",
  isLeaf: "leaf",
};
const addSampleTypeVisible = ref(false);
const onsetAges = [
  {
    value: "婴幼儿",
    label: "婴幼儿(0-5)",
  },
  {
    value: "青少年-青年",
    label: "青少年-青年(5-25)",
  },
  {
    value: "成年人",
    label: "成年人(25-45)",
  },
  {
    value: "中年人",
    label: "中年人(45-)",
  },
  {
    value: "不明",
    label: "不明",
  },
];
const verticalFamilyHistorys = [
  {
    value: "TRUE",
    label: "TRUE",
  },
  {
    value: "FALSE",
    label: "FALSE",
  },
  {
    value: "unknown",
    label: "unknown",
  },
];
const reportTemplates = [
  {
    value: "通用模版",
    label: "通用模版",
  },
];
const testItems = [
  {
    value: "WES",
    label: "WES",
  },
  {
    value: "Panel",
    label: "Panel",
  },
];
const relationships = [
  {
    value: "1",
    label: "之父",
  },
  {
    value: "2",
    label: "之母",
  },
  {
    value: "3",
    label: "之子",
  },
  {
    value: "4",
    label: "之女",
  },
  {
    value: "5",
    label: "之哥",
  },
  {
    value: "6",
    label: "之妹",
  },
  {
    value: "7",
    label: "之姐",
  },
  {
    value: "8",
    label: "之弟",
  },
  {
    value: "9",
    label: "之妻",
  },
  {
    value: "10",
    label: "之夫",
  },
  {
    value: "11",
    label: "之姑",
  },
  {
    value: "12",
    label: "之舅",
  },
  {
    value: "13",
    label: "之姨",
  },
  {
    value: "14",
    label: "其他(男性)",
  },
  {
    value: "15",
    label: "其他(女性)",
  },
  {
    value: "16",
    label: "其他(性别不明)",
  },
];

const sampleTypes = [
  {
    value: "EDTA全血",
    label: "EDTA全血",
  },
  {
    value: "肌肉组织",
    label: "肌肉组织",
  },
  {
    value: "石蜡组织",
    label: "石蜡组织",
  },
  {
    value: "肝素钠全血",
    label: "肝素钠全血",
  },
  {
    value: "凝固血块",
    label: "凝固血块",
  },
  {
    value: "DNA",
    label: "DNA",
  },
  {
    value: "尿液细胞",
    label: "尿液细胞",
  },
  {
    value: "ctDNA",
    label: "ctDNA",
  },
  {
    value: "精子",
    label: "精子",
  },
];

// do not use same name with ref
const patientForm = ref({
  doctorId: userStore.id,
  name: "",
  birthdate: "",
  age: "",
  sex: "man",
  outpatient: "",
  sampleType: "",
  receivedDate: getBeijingDateTime(),
  sampleBarCodes: "",
  submittingHospital: "测试医院",
  submittingPhysician: "测试医生",
  submittingDepartment: "测试科室",
  onsetAge: "",
  verticalFamilyHistory: "",
  clinicalSymptoms: "",
  clinicalDiagnosis: "",
  symptom: "",
  auxiliaryDiagnosis: [],
  conjugalCarryScreening: true,
  reportTemplate: "",
  testItem: "WES",
});
let familySample = ref([
  {
    name: "",
    relationship: "",
    hasSymptom: false,
    startSameProject: true,
  },
]);
const router = useRouter();
const uploadRef = ref();
const handleExceed = (files) => {
  uploadList.value = [];
  uploadRef.value.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  uploadRef.value.handleStart(file);
  // / 在文件数量超出限制时自动上传文件
  uploadRef.value.submit();
};
// 上传VCF成功回调
function handleUploadSuccess(res, file) {
  if (res.succeed == true) {
    uploadFileList.value.push({ name: file.name, url: res.data.url });
    proxy.$modal.msgSuccess("VCF文件上传成功");
  } else {
    proxy.$modal.msgError("VCF文件上传失败");
  }
}
/**移除vcf文件 */

function handleRemove(params) {
  uploadFileList.value = [];
}

const uploadFastaRef = ref();
/**上传FASTA文件超出 */
const handleFastaExceed = (files) => {
  uploadFastaFileList.value = [];
  uploadFastaRef.value.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  uploadFastaRef.value.handleStart(file);
  // / 在文件数量超出限制时自动上传文件
  uploadFastaRef.value.submit();
};
// 上传FASTA文件成功回调
function handleUploadFastaSuccess(res, file) {
  if (res.succeed == true) {
    uploadFastaFileList.value.push({ name: file.name, url: res.data.url });
    proxy.$modal.msgSuccess("FASTA文件上传成功");
  } else {
    proxy.$modal.msgError("FASTA文件上传失败");
  }
} /**移除fasta文件 */
function handleRemoveFasta(params) {
  uploadFastaFileList.value = [];
}

const confirmEvent = () => {
  patientForm.value.sampleType = addSampleType.value;
  addSampleTypeVisible.value = false;
};
const cancelEvent = () => {
  addSampleTypeVisible.value = false;
};
/** 获取不可用日期*/
const disabledDate = (time) => {
  return time.getTime() > Date.now();
};

function getLocalSelectNodes() {
  let arrayOfNames = proxy.$refs.localTree.getCheckedNodes();
  // 去除提交数组所有重复项，并遍历提交的数组，如果数组对象在patientForm.value.auxiliaryDiagnosis不包含，则添加进去
  // 去重数组
  let uniqueA = Array.from(new Set(arrayOfNames.map(item => item.HPO_ID))).map(HPO_ID => arrayOfNames.find(obj => obj.HPO_ID === HPO_ID));

  // 遍历数组，将不包含在提交数组中的对象添加到uniqueA中
  patientForm.value.auxiliaryDiagnosis.forEach(obj => {
    if (!uniqueA.some(item => item.HPO_ID === obj.HPO_ID)) {
      uniqueA.push(obj);
    }
  });
  patientForm.value.auxiliaryDiagnosis = uniqueA;
  // // 遍历取消当前选中节点的选中状态-->此方法有bug
  // arrayOfNames.forEach(element => {
  // proxy.$refs.localTree.setChecked(element.HPO_ID, false);
  // });
  allFirstNode.value = [];
  treeData.value = [];
  clearTimeout(timer); // 清除之前的计时器
  patientForm.value.symptom = ""
  searchLoading.value = false;
}
/**判断是否是英文且英文字符串度是否小于等于2 */
function checkIfAllEnglish(value) {
  const regex = /^[A-Za-z]+$/;
  const isAllEnglish = regex.test(value);
  const isLessThanThree = value.length <= 2 ? true : false;
  if (isAllEnglish) {
    if (isLessThanThree) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
/**搜索获得对应的HPO信息 */
async function searchHPO() {
  if (patientForm.value.symptom == "") {
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
      if (checkIfAllEnglish(patientForm.value.symptom)) {
        allFirstNode.value = [];
        treeData.value = [];
        clearTimeout(timer); // 清除之前的计时器
        searchLoading.value = false;
        // clearTimeout(timer); // 清除之前的计时器
        // timer = setTimeout(async () => {
        //   console.log("用户已停止输入");
        //   // 触发请求
        //   const response = await axios.get(hpoLocalPath);
        //   const jsonData = response.data;
        //   const filteredData = jsonData.filter(item => {
        //     return item.text
        //       .toLowerCase()
        //       .includes(patientForm.value.symptom.toLowerCase());
        //   });
        //   allFirstNode.value = filteredData;
        //   treeData.value = filteredData;
        //   searchLoading.value = false;
        // }, 3000); // 3秒后触发
      } else {
        const response = await axios.get(hpoLocalPath);
        const jsonData = response.data;
        const filteredData = jsonData.filter((item) => {
          return item.text
            .toLowerCase()
            .includes(patientForm.value.symptom.toLowerCase());
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
  if (patientForm.value.symptom == "") {
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
      if (checkIfAllEnglish(patientForm.value.symptom)) {
        allFirstNode.value = [];
        treeData.value = [];
        clearTimeout(timer); // 清除之前的计时器
        searchLoading.value = false;
        // clearTimeout(timer); // 清除之前的计时器
        // timer = setTimeout(async () => {
        //   // 触发请求
        //   const response = await axios.get(hpoLocalPath);
        //   const jsonData = response.data;
        //   const filteredData = jsonData.filter(item => {
        //     return item.text
        //       .toLowerCase()
        //       .includes(patientForm.value.symptom.toLowerCase());
        //   });
        //   allFirstNode.value = filteredData;
        //   treeData.value = filteredData;
        //   searchLoading.value = false;
        // }, 3000); // 3秒后触发
      } else {
        clearTimeout(timer); // 清除之前的计时器
        timer = setTimeout(async () => {
          // 触发请求
          const response = await axios.get(hpoLocalPath);
          const jsonData = response.data;
          const filteredData = jsonData.filter((item) => {
            return item.text
              .toLowerCase()
              .includes(patientForm.value.symptom.toLowerCase());
          });
          allFirstNode.value = filteredData;
          treeData.value = filteredData;
          searchLoading.value = false;
        }, 1000); // 1秒后触发
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
function getV(params) {
  console.log(params);
  console.log(patientForm.value.conjugalCarryScreening);
}
/**根据出生日期获取对应的年龄 */
function getAge(params) {
  let selectYear = parseInt(params.substring(0, 4));
  let currectYear = parseInt(getBeijingDateTime().substring(0, 4));
  patientForm.value.age = currectYear - selectYear;
}
/**获取当前北京时间日期 */
function getBeijingDateTime() {
  const now = new Date();
  const utcOffset = now.getTimezoneOffset() / 60;
  const beijingOffset = 8; // 北京时间的时区偏移为+8小时
  const localOffset = utcOffset + beijingOffset;
  const beijingTime = new Date(now.getTime() + localOffset * 60 * 60 * 1000);
  const year = beijingTime.getFullYear();
  const month = String(beijingTime.getMonth() + 1).padStart(2, "0");
  const day = String(beijingTime.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
/**删除辅助诊断检索池的对应标签-->在选中不同层级内容相同节点后删除有异常 */
function closeAuxiliaryDiagnosis(tag) {
  patientForm.value.auxiliaryDiagnosis.splice(
    patientForm.value.auxiliaryDiagnosis.indexOf(tag),
    1
  );
}
/**添加关联样本 */
function addAssociatedSample() {
  familySample.value.push({
    name: "",
    relationship: "",
    hasSymptom: false,
    startSameProject: true,
  });
}
/**删除对应关联样本 */
function deleteAssociatedSample(index) {
  familySample.value.splice(index, 1);
}
/**新建任务 */
function createTask(params) {
  proxy.$refs.patientFormRef.validate((valid) => {
    if (valid) {
      let temp = {
        admissionNumber: patientForm.value.outpatient,
        age: patientForm.value.age,
        birthDate: patientForm.value.birthdate,
        clinicalDiagnosis: patientForm.value.clinicalDiagnosis,
        clinicalSymptoms: patientForm.value.clinicalSymptoms,
        coupleCarryingScreening: patientForm.value.conjugalCarryScreening,
        department: patientForm.value.submittingDepartment,
        doctor: patientForm.value.submittingPhysician,
        doctorId: patientForm.value.doctorId,
        gender: patientForm.value.sex,
        hospital: patientForm.value.submittingHospital,
        hpo: patientForm.value.auxiliaryDiagnosis
          .map((obj) => obj.HPO_ID)
          .join(','),
        onsetAge: patientForm.value.onsetAge,
        patientName: patientForm.value.name,
        reportTemplate: patientForm.value.reportTemplate,
        sampleBarcode: patientForm.value.sampleBarCodes,
        sampleReceivingDate: patientForm.value.receivedDate,
        sampleType: patientForm.value.sampleType,
        testingItems: patientForm.value.testItem,
        verticalFamilyHistory: patientForm.value.verticalFamilyHistory,
      };
      getCreateTask(temp)
        .then((res) => {
          let id = res.data.data.id
          uploadData.value.path =
            res.data.data.homepath + "/" + id;
          // 判断是否调用postGenealogy方法
          // 过滤出至少一个属性不为空的对象
          let validObjects = familySample.value.filter(obj => obj.name != "" || obj.relationship != "");
          // 返回有效对象的个数
          let validCount = validObjects.length;
          if (validCount >= 1) {
            // 生成新数组
             let tempPost = validObjects.map((obj, index) => ({
              gname: obj.name,
              grelation: obj.relationship,
              sameProject: obj.startSameProject,
              sameSymptom: obj.hasSymptom,
              taskId: id
            }));
            // 设置 tempPost 数组中每个对象的 gnumber 属性
            tempPost.forEach((obj, index) => {
              obj.gnumber = index + 1;
            });
            postGenealogy(tempPost)
              .then((res) => {
                proxy.$modal.msgSuccess("家系样本添加成功");
              })
              .catch((err) => {
                console.log(err);
              });
          } 
          proxy.$modal.msgSuccess("任务新建成功");
          // uploadVCFVisible.value = true;
          router.push("/lettertask/examine");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}
// async function postGenealogy(params) {
//   try {
//     const res = await postGenealogy(params);
//     return res.data.data; // 返回获取的结果
//   } catch (err) {
//     console.log(err);
//     throw err; // 抛出错误
//   }
// }
function confirmUploadEnd(params) {
  uploadVCFVisible.value = false;
  router.push("/lettertask/examine");
}
</script>
<style scoped lang="scss">
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

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>