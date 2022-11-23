<template>
  <div>
    <el-form :inline="true" :model="input">
      <el-form-item label="用户基表"/>
      <el-form-item>
        <el-input v-model="input.key" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
      <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
      </el-table-column>
      <el-table-column
          prop="id"
          header-align="center"
          align="center"
          label="id">
      </el-table-column>
      <el-table-column
          prop="name"
          header-align="center"
          align="center"
          label="姓名">
      </el-table-column>
      <el-table-column
          prop="password"
          header-align="center"
          align="center"
          label="密码">
      </el-table-column>
      <el-table-column
          prop="identity"
          header-align="center"
          align="center"
          label="身份">
      </el-table-column>
      <el-table-column
          fixed="right"
          header-align="center"
          align="center"
          width="150"
          label="操作">
        <template #default="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <el-dialog
        :title="!dataForm.id ? '新增' : '修改'"
        :close-on-click-modal="false" v-model="visible">
      <el-form :model="dataForm" :rules="dataRule" ref="dataFormRef" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="dataForm.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="dataForm.password" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="身份" prop="identity">
          <el-input v-model="dataForm.identity" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <span class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, nextTick, onMounted} from 'vue'
import FormRules, {ElMessage, ElMessageBox} from 'element-plus'

const currentInstance = getCurrentInstance()
const {$http} = currentInstance.appContext.config.globalProperties


const input = reactive({
  key: ''
})
const dataList = ref([])
const pageIndex = ref(1)
const pageSize = ref(10)
const totalPage = ref(0)
const dataListLoading = ref(false)
const dataListSelections = ref([])


//dialog
const dataFormRef = ref()
const visible = ref(false)
const dataForm = reactive({
  id: 0,
  name: '',
  password: '',
  identity: ''
})

const dataRule = reactive < FormRules > ({
  name: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  password: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  identity: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ]
})
//onMounted
onMounted(() => {
  getDataList()
})

function getDataList() {
  dataListLoading.value = true
  if (input.key === '') {
    $http({
      url: '/user/user/list',
      method: 'get',
      params: {
        'page': pageIndex.value,
        'limit': pageSize.value,
        'key': input.key
      }
    }).then(({data}) => {
      if (data && data.code === 0) {
        dataList.value = data.page.list
        totalPage.value = data.page.totalCount
      } else {
        dataList.value = []
        totalPage.value = 0
      }
      dataListLoading.value = false
    })
  } else {
    $http({
      url: `/user/user/info/${input.key}`,
      method: 'get',
      params: {},
    }).then(({data}) => {
      if (data && data.code === 0 && data.user !== null) {
        dataList.value = [data.user]
      } else {
        dataList.value = []
      }
      dataListLoading.value = false
    })
  }
}

// 每页数
function sizeChangeHandle(val) {
  pageSize.value = val
  pageIndex.value = 1
  getDataList()
}

function currentChangeHandle(val) {
  pageIndex.value = val
  getDataList()
}

// 多选
function selectionChangeHandle(val) {
  dataListSelections.value = val
}

// 新增 / 修改
async function addOrUpdateHandle(id) {
  visible.value = true
  nextTick(() => {
    init(id)
  })
}

// 删除
function deleteHandle(id) {
  const ids = id ? [id] : dataListSelections.value.map(item => {
    return item.id
  })
  ElMessageBox.confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    $http({
      url: '/user/user/delete',
      method: 'post',
      data: ids
    }).then(({data}) => {
      if (data && data.code === 0) {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            input.key = ''
            getDataList()
          }
        })
      } else {
        ElMessage.error(data.msg)
      }
    })
  })
}

function init(id) {
  dataForm.id = id || 0
  visible.value = true
  //await nextTick()
  dataFormRef.value.resetFields()
  if (dataForm.id) {
    $http({
      url: `/user/user/info/${dataForm.id}`,
      method: 'get',
      params: {},
    }).then(({data}) => {
      if (data && data.code === 0) {
        dataForm.name = data.user.name
        dataForm.password = data.user.password
        dataForm.identity = data.user.identity
      }
    })
  }
}

// 表单提交
function dataFormSubmit() {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      $http({
        url: `/user/user/${!dataForm.id ? 'save' : 'update'}`,
        method: 'post',
        data: {
          'id': dataForm.id || undefined,
          'name': dataForm.name,
          'password': dataForm.password,
          'identity': dataForm.identity
        }
      }).then(({data}) => {
        if (data && data.code === 0) {
          ElMessage({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => {
              visible.value = false
              input.key = ''
              getDataList()
            }
          })
        } else {
          ElMessage.error(data.msg)
        }
      })
    }
  })
}
</script>
