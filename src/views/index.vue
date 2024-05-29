<template>
  <div class="app-container">
    <div class="home">
      <el-tabs v-model="activeName" type="card" class="demo-tabs">
        <el-tab-pane label="VCF数据解读" name="first">
          <div class="analysis-content">
            <div class="analysis-content-title-vcf">VCF数据解读流程</div>
            <el-divider />

            <div class="analysis-content-icon">
              <div
                v-for="(item, index) in vcfIcons"
                :key="index"
                class="analysis-content-single-vcf"
                @click="goViews(item.path)"
              >
                <div>
                  <svg-icon :icon-class="item.vcfIcon" class-name="analysis-icon " />
                </div>
                <div class="analysis-text">{{ item.vcfText }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="FASTQ数据解读" name="second">
          <div class="analysis-content">
            <div class="analysis-content-title">FASTQ数据解读流程</div>
            <el-divider />

            <div class="analysis-content-icon">
              <div v-for="(item, index) in fastqIcons" :key="index" class="analysis-content-single">
                <div>
                  <svg-icon :icon-class="item.Icon" class-name="analysis-icon " />
                </div>
                <div class="analysis-text">{{ item.Text }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-divider></el-divider>
      <el-card class="update-log" shadow="never">
        <template v-slot:header>
          <div class="clearfix">
            <span>更新日志</span>
          </div>
        </template>
        <el-collapse accordion>
          <el-collapse-item title="v0.0.1 - 2024-04-13">
            <ol>
              <li>测试</li>
            </ol>
          </el-collapse-item>
          <el-collapse-item title="v0.0.2 - 2024-05-05">
            <ol>
              <li>初步修改网站风格</li>
            </ol>
          </el-collapse-item>
          <el-collapse-item title="v0.0.3 - 2024-05-11">
            <ol>
              <li>生信任务登记(VCF)</li>
            </ol>
          </el-collapse-item>
          <el-collapse-item title="v0.0.4 - 2024-05-18">
            <ol>
              <li>用户管理新增添加新用户</li>
              <li>用户管理新增添工号，职称</li>
              <li>用户管理新增管理员查看密码</li>
              <li>生信任务登记新增上传弹窗和上传路径</li>
              <li>限制临床表征本地搜索输入英文字符大于等于三</li>
            </ol>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
  </div>
</template>

<script setup name="Index">
import { ref } from "vue";
const activeName = ref("first");
const router = useRouter();

const buttons = [
  { type: "", text: "plain" },
  { type: "primary", text: "primary" },
  { type: "success", text: "success" },
  { type: "info", text: "info" },
  { type: "warning", text: "warning" },
  { type: "danger", text: "danger" }
];
const version = ref("3.8.7");
const vcfIcons = ref([
  {
    vcfIcon: "new-analysis",
    vcfText: "新建分析项目",
    path:"/lettertask/new"

  },
  {
    vcfIcon: "view-analysis",
    vcfText: "查看分析结果",
    path:"/lettertask/examine"

  },
  {
    vcfIcon: "issue-analysis",
    vcfText: "下发解读任务"
  },
  {
    vcfIcon: "analysis",
    vcfText: "解读NGS数据库"
  }
]);
let fixHeaderInput = ref("");
const fastqIcons = ref([
  {
    Icon: "new-analysis",
    Text: "新建分析项目"
  },
  {
    Icon: "start-analysis",
    Text: "启动生信分析"
  },
  {
    Icon: "view-analysis",
    Text: "查看分析结果"
  },
  {
    Icon: "issue-analysis",
    Text: "下发解读任务"
  },
  {
    Icon: "analysis",
    Text: "解读NGS数据库"
  }
]);
function goViews(params) {
  router.push(params)
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

.home {
  width: 70%;
  overflow: hidden;
  .analysis-content {
    .analysis-content-title-vcf {
      color: #ffffff;
      margin-top: 10px;
      border-radius: 10px;
      font-size: 20px;
      background-color: #0088cc;
      padding: 10px 20px;
      display: inline-block; /* 让宽度根据内容大小变化 */
      overflow: hidden; /* 让边框圆角生效 */
    }
    .analysis-content-title {
      color: #ffffff;
      margin-top: 10px;
      border-radius: 10px;
      font-size: 20px;
      background-color: #0088cc;
      padding: 10px 20px;
      display: inline-block; /* 让宽度根据内容大小变化 */
      overflow: hidden; /* 让边框圆角生效 */
    }
    .analysis-content-icon {
      display: flex;
      flex-direction: row;
      margin-top: 1vh;
      .analysis-content-single-vcf {
        padding: 40px 20px;
        margin-left: 20px;
        border: 1px solid #0088cc;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 200px;
        .analysis-icon {
          font-size: 80px;
          color: #0088cc;
        }
        .analysis-text {
          font-size: 20px;
          color: #0088cc;
        }
      }
      .analysis-content-single {
        padding: 40px 20px;
        margin-left: 20px;
        border: 1px solid #0088cc;
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 200px;

        .analysis-icon {
          font-size: 80px;
          color: #0088cc;
        }
        .analysis-text {
          font-size: 20px;
          color: #0088cc;
        }
      }
    }
  }

  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    width: 60%;
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>

