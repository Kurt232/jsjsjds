<template>
  <div>
    <el-form :inline="true" :model="input">
      <el-form-item label="用药目的表"/>
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
          prop="eventid"
          header-align="center"
          align="center"
          label="不良事件报告编码">
      </el-table-column>
      <el-table-column
          prop="caseid"
          header-align="center"
          align="center"
          label="病例编码">
      </el-table-column>
      <el-table-column
          prop="drugid"
          header-align="center"
          align="center"
          label="药品序号">
      </el-table-column>
      <el-table-column
          prop="purposechinese"
          header-align="center"
          align="center"
          label="用药目的_中文">
      </el-table-column>
      <el-table-column
          prop="purposeenglish"
          header-align="center"
          align="center"
          label="用药目的_英文">
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
        <el-form-item label="不良事件报告编码" prop="eventid">
          <el-input v-model="dataForm.eventid" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="病例编码" prop="caseid">
          <el-input v-model="dataForm.caseid" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="药品序号" prop="drugid">
          <el-input v-model="dataForm.drugid" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="用药目的_中文" prop="purposechinese">
          <el-input v-model="dataForm.purposechinese" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="用药目的_英文" prop="purposeenglish">
          <el-input v-model="dataForm.purposeenglish" placeholder=""></el-input>
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
  eventid: '',
  caseid: '',
  drugid: '',
  purposechinese: '',
  purposeenglish: ''
})

const dataRule = reactive < FormRules > ({
  eventid: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  caseid: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  drugid: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  purposechinese: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  purposeenglish: [
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
      url: '/data/data5/list',
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
      url: `/data/data5/info/${input.key}`,
      method: 'get',
      params: {},
    }).then(({data}) => {
      if (data && data.code === 0 && data.data5 !== null) {
        dataList.value = [data.data5]
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
      url: '/data/data5/delete',
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
      url: `/data/data5/info/${dataForm.id}`,
      method: 'get',
      params: {},
    }).then(({data}) => {
      if (data && data.code === 0) {
        dataForm.eventid = data.data5.eventid
        dataForm.caseid = data.data5.caseid
        dataForm.drugid = data.data5.drugid
        dataForm.purposechinese = data.data5.purposechinese
        dataForm.purposeenglish = data.data5.purposeenglish
      }
    })
  }
}

// 表单提交
function dataFormSubmit() {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      $http({
        url: `/data/data5/${!dataForm.id ? 'save' : 'update'}`,
        method: 'post',
        data: {
          'id': dataForm.id || undefined,
          'eventid': dataForm.eventid,
          'caseid': dataForm.caseid,
          'drugid': dataForm.drugid,
          'purposechinese': dataForm.purposechinese,
          'purposeenglish': dataForm.purposeenglish
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
