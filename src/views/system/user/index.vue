<template>
  <div class="app-container">
    <el-dialog v-model="addUserVisible" :show-close="true" width="800">
      <template #header>
        <el-text size="large" tag="b">新增用户</el-text>
      </template>

      <el-form :model="addUserForm" label-width="100px" :rules="rules" ref="addUserRef">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="addUserForm.username" placeholder="请输入用户名" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="nickName">
              <el-input v-model="addUserForm.nickName" placeholder="请输入用户真实姓名" maxlength="30" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="addUserForm.phone" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="addUserForm.password" placeholder="请输入密码" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户工号" prop="jobId">
              <el-input v-model="addUserForm.jobId" placeholder="请输入用户工号" maxlength="30" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户职称" prop="professionalTitle">
              <el-select
                v-model="addUserForm.professionalTitle"
                placeholder="请选择用户职称"
                style="width: 100%"
              >
                <el-option
                  v-for="item in userTitles"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addUserVisible = false">取消</el-button>
          <el-button type="primary" @click="addUserConfirm">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-table :data="userList" max-height="90vh" v-loading="userListLoading">
      <el-table-column prop="username">
        <template #header>
          <div style="display:flex;flex-direction:row;justify-content:space-between">
            <el-text>
              用户名
              <el-button icon="Search" circle size="small"  />
            </el-text>
            <el-button @click="addUserVisible = true" plain size="small">新增</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="nickName"  width="250" >
        <template #header>
            <el-text>
              真实姓名
              <el-button icon="Search" circle size="small"  />
            </el-text>
        </template>
      </el-table-column>
      <el-table-column prop="phone"  width="250" >
        <template #header>
            <el-text>
              手机号
              <el-button icon="Search" circle size="small"  />
            </el-text>
        </template>
      </el-table-column>
      <el-table-column prop="jobId"  width="250" >
        <template #header>
            <el-text>
              工号
              <el-button icon="Search" circle size="small"  />

            </el-text>
        </template>
      </el-table-column>
      <el-table-column prop="professionalTitle" label="职称" width="200" />

      <el-table-column align="center" prop="enable" width="150">
        <template #header>是否可用</template>
        <template #default="{ row }">
          <el-switch
            :active-value="1"
            :inactive-value="0"
            active-text="是"
            inactive-text="否"
            v-model="row.enable"
            @change="handleStatusChange(row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" width="200">
        <template #header>
          操作
          <el-button icon="Refresh" circle size="small" @click="resetQuery" />
        </template>
        <template #default="{ row }">
          <el-popover placement="bottom" :title="'用户' + row.username" :width="200" trigger="click">
            <template #reference>
              <el-button type="primary" text>查看密码</el-button>
            </template>
            密码:
            <el-text type="primary">{{ row.password }}</el-text>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!-- <el-row :gutter="20">
      <el-col :span="3">
        <el-tree
          ref="userTypeRef"
          style="max-width: 600px"
          :data="searchValueTypes"
          :props="defaultProps"
          @node-click="handleNodeClick"
          node-key="id"
          default-expand-all
          :current-node-key="1"
          :expand-on-click-node="false"
          :highlight-current="true"
        />
      </el-col>
      <el-col :span="21">
        <div class="table-container">
          <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="68px">
            <el-row>
              <el-col :span="5">
                <el-form-item label="用户名" prop="username">
                  <el-input
                    v-model="queryParams.username"
                    placeholder="请输入用户名称"
                    clearable
                    @keyup.enter="filterSearch"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="手机号" prop="phone">
                  <el-input
                    v-model="queryParams.phone"
                    placeholder="请输入手机号"
                    clearable
                    @keyup.enter="filterSearch"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="真实姓名" prop="nickName">
                  <el-input
                    v-model="queryParams.nickName"
                    placeholder="请输入真实姓名"
                    clearable
                    @keyup.enter="filterSearch"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item label="工号" prop="jobId">
                  <el-input
                    v-model="queryParams.jobId"
                    placeholder="请输入工号"
                    clearable
                    @keyup.enter="filterSearch"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button type="primary" icon="Search" @click="filterSearch">搜索</el-button>
                  <el-button color="#0088cc" @click="addUserVisible = true" icon="Plus">新增</el-button>
                  <el-button @click="resetQuery" icon="Refresh">重置</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </el-col>
    </el-row>-->
  </div>
</template>
   <script  setup name="User">
import { register } from "@/api/login";
import {
  changeUserStatus,
  listUser,
  resetUserPwd,
  delUser,
  getUser,
  updateUser,
  addUser,
  deptTreeSelect
} from "@/api/system/user";
import { ref } from "vue";
import { id } from "element-plus/es/locales.mjs";
const { proxy } = getCurrentInstance();

const userList = ref([]);
const searchValue = ref("");
const searchValueType = ref("");
const addUserVisible = ref(false);
const searchTip = ref("请输入要搜索的值");
const userTitles = [
  {
    value: "初级",
    label: "初级"
  },
  {
    value: "中级",
    label: "中级"
  },
  {
    value: "副高级",
    label: "副高级"
  },
  {
    value: "高级",
    label: "高级"
  }
];
const queryParams = ref({
  username: "",
  phone: "",
  jobId: "",
  nickName: ""
});
const userListLoading = ref(false);
const defaultProps = {
  children: "children",
  label: "label"
};
const searchValueTypes = [
  {
    label: "全部类型",
    id: 1,
    children: [
      {
        label: "管理员",
        id: 2
      },
      {
        label: "普通用户",
        id: 3
      },
      {
        label: "可用",
        id: 4
      },
      {
        label: "禁用",
        id: 5
      },
      {
        label: "全部职称",
        id: 6,

        children: [
          {
            label: "初级",
            id: 7
          },
          {
            label: "中级",
            id: 8
          },
          {
            label: "副高级",
            id: 9
          },
          {
            label: "高级",
            id: 10
          }
        ]
      }
    ]
  }
];
const searchValueTypeOptions = ref([
  {
    label: "筛选类型/(筛选类型+搜索用户名)",
    options: [
      {
        value: "isAdminType",
        label: "管理员"
      },
      {
        value: "isCommonType",
        label: "普通用户"
      },
      {
        value: "isenableType",
        label: "可用"
      },
      {
        value: "noenableType",
        label: "禁用"
      }
    ]
  },
  {
    label: "筛选类型+对应筛选属性值",
    options: [
      {
        value: "usernameType",
        label: "用户名"
      },
      {
        value: "nickNameType",
        label: "真实姓名"
      },
      {
        value: "phoneType",
        label: "电话号"
      },
      {
        value: "jobId",
        label: "工号"
      }
    ]
  }
]);
const addUserForm = ref({
  jobId: "",
  nickName: "",
  password: "",
  phone: "",
  professionalTitle: "",
  username: ""
});
const form = reactive({
  name: "",
  region: "",
  date1: "",
  date2: "",
  delivery: false,
  type: [],
  resource: "",
  desc: ""
});
// 表单校验
const rules = ref({
  username: [
    { required: true, message: "用户名不能为空", trigger: "blur" },
    {
      min: 2,
      max: 20,
      message: "用户名长度必须介于 2 和 20 之间",
      trigger: "blur"
    }
  ],
  nickName: [
    { required: true, message: "用户真实姓名不能为空", trigger: "blur" }
  ],
  password: [
    { required: true, message: "用户密码不能为空", trigger: "blur" },
    {
      min: 5,
      max: 20,
      message: "用户密码长度必须介于 5 和 20 之间",
      trigger: "blur"
    },
    {
      pattern: /^[^<>"'|\\]+$/,
      message: "不能包含非法字符：< > \" ' \\ |",
      trigger: "blur"
    }
  ],
  phone: [
    { required: true, message: "手机号码不能为空", trigger: "blur" },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur"
    }
  ]
});
/** 查询用户列表 */
function getList(data) {
  userListLoading.value = true;
  let a = {
    username: "",
    nickName: "",
    phone: "",
    isAdmin: "",
    enable: ""
  };
  if (data) {
    listUser(a).then(res => {
    userListLoading.value = false;
    userList.value = res.data; // 使用 userList.value 来更新 userList 的值
    proxy.$modal.msgSuccess("数据更新成功");

  });
  } else {
    listUser(a).then(res => {
    userListLoading.value = false;
    userList.value = res.data; // 使用 userList.value 来更新 userList 的值
  });
  }

}
/** 用户状态修改  */
function handleStatusChange(row) {
  const id = parseInt(row.id);
  const text = row.enable == 0 ? "停用" : "启用";
  const booleanEnable = row.enable == 1;

  if (id == 100003) {
    proxy.$modal.msgError("管理员账号，不可禁用");
    row.enable = 1;
    return;
  }

  proxy.$modal
    .confirm('确认要"' + text + '""' + row.username + '"用户吗?')
    .then(() => changeUserStatus(booleanEnable, id))
    .then(() => {
      proxy.$modal.msgSuccess(text + "成功");
      getList();
    })
    .catch(() => {
      row.enable = row.enable == 0 ? 1 : 0;
    });
}
function switchSearchTypeCase(argument, searchValue) {
  switch (argument) {
    case "全部类型":
      return {};
    case "管理员":
      return {
        isAdmin: "2"
      };
    case "普通用户":
      return {
        isAdmin: "1"
      };
    case "可用":
      return {
        enable: "1"
      };
    case "禁用":
      return {
        enable: "0"
      };

    case "全部职称":
      return {};

    case "初级":
      return {
        professionalTitle: "初级"
      };

    case "中级":
      return {
        professionalTitle: "中级"
      };
    case "副高级":
      return {
        professionalTitle: "副高级"
      };
    case "高级":
      return {
        professionalTitle: "高级"
      };
    default:
      return {
        username: "",
        nickName: "",
        phone: "",
        isAdmin: "",
        enable: ""
      };
  }
}

function filterSearch(params) {
  listUser(queryParams.value).then(res => {
    userListLoading.value = false;
    userList.value = res.data; // 使用 userList.value 来更新 userList 的值
  });
}
function addUserConfirm(params) {
  proxy.$refs.addUserRef.validate(valid => {
    if (valid) {
      register(addUserForm.value)
        .then(res => {
          const username = addUserForm.value.username;
          proxy.$modal.msgSuccess("账号" + username + "添加成功");
          addUserVisible.value = false;
          getList();
        })
        .catch(err => {
          console.log(err);

          addUserVisible.value = false;
        });
    }
  });
}
const handleNodeClick = data => {
  listUser(switchSearchTypeCase(data.label)).then(res => {
    userListLoading.value = false;
    userList.value = res.data; // 使用 userList.value 来更新 userList 的值
  });
};
function getSearchTip(params) {
  proxy.$refs.userTypeRef.setCurrentKey(1, true);
  getList();
  if (params == "usernameType") {
    searchTip.value = "请输入要搜索的用户名";
  } else if (params == "nickNameType") {
    searchTip.value = "请输入要搜索的用户真实姓名";
  } else if (params == "phoneType") {
    searchTip.value = "请输入要搜索的电话号码";
  } else {
    searchTip.value = "请输入要搜索的工号";
  }
}
function resetQuery(params) {
  getList(true);
}
getList();
</script>      
<style lang='scss' scoped>
// -------
.my-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>