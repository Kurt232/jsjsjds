<template>
  <div>
    <el-form :inline="true" :model="input">
      <el-form-item label="反馈记录"/>
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
          prop="processed"
          header-align="center"
          align="center"
          label="已处理">
      </el-table-column>
      <el-table-column
          prop="uid"
          header-align="center"
          align="center"
          label="反馈人员id">
      </el-table-column>
      <el-table-column
          prop="useridentity"
          header-align="center"
          align="center"
          label="反馈人员身份">
      </el-table-column>
      <el-table-column
          prop="username"
          header-align="center"
          align="center"
          label="反馈人员姓名">
      </el-table-column>
      <el-table-column
          prop="userphonenumber"
          header-align="center"
          align="center"
          label="反馈人员电话">
      </el-table-column>
      <el-table-column
          prop="useremail"
          header-align="center"
          align="center"
          label="反馈人员邮箱">
      </el-table-column>
      <el-table-column
          prop="useraddress"
          header-align="center"
          align="center"
          label="反馈人员住址">
      </el-table-column>
      <el-table-column
          prop="drugid"
          header-align="center"
          align="center"
          label="反馈药物id">
      </el-table-column>
      <el-table-column
          prop="drugname"
          header-align="center"
          align="center"
          label="反馈药物名称">
      </el-table-column>
      <el-table-column
          prop="creattime"
          header-align="center"
          align="center"
          label="创建时间">
      </el-table-column>
      <el-table-column
          prop="message"
          header-align="center"
          align="center"
          label="详细反馈信息">
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
        <el-form-item label="已处理" prop="processed">
          <el-input v-model="dataForm.processed" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="反馈人员id" prop="uid">
          <el-input v-model="dataForm.uid" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="反馈人员身份" prop="useridentity">
          <el-input v-model="dataForm.useridentity" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="反馈人员姓名" prop="username">
          <el-input v-model="dataForm.username" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="反馈人员电话" prop="userphonenumber">
          <el-input v-model="dataForm.userphonenumber" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="反馈人员邮箱" prop="useremail">
          <el-input v-model="dataForm.useremail" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="反馈人员住址" prop="useraddress">
          <el-input v-model="dataForm.useraddress" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="反馈药物id" prop="drugid">
          <el-input v-model="dataForm.drugid" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="反馈药物名称" prop="drugname">
          <el-input v-model="dataForm.drugname" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="creattime">
          <el-input v-model="dataForm.creattime" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="详细反馈信息" prop="message">
          <el-input v-model="dataForm.message" placeholder=""></el-input>
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
  processed: '',
  uid: '',
  useridentity: '',
  username: '',
  userphonenumber: '',
  useremail: '',
  useraddress: '',
  drugid: '',
  drugname: '',
  creattime: '',
  message: ''
})

const dataRule = reactive < FormRules > ({
  processed: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  uid: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  useridentity: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  username: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  userphonenumber: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  useremail: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  useraddress: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  drugid: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  drugname: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  creattime: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  message: [
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
      url: '/user/log/list',
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
      url: `/user/log/info/${input.key}`,
      method: 'get',
      params: {},
    }).then(({data}) => {
      if (data && data.code === 0 && data.log !== null) {
        dataList.value = [data.log]
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
      url: '/user/log/delete',
      method: 'post',
      data: ids
    }).then(({data}) => {
      if (data && data.code === 0) {
        ElMessage({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
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
      url: `/user/log/info/${dataForm.id}`,
      method: 'get',
      params: {},
    }).then(({data}) => {
      if (data && data.code === 0) {
        dataForm.processed = data.log.processed
        dataForm.uid = data.log.uid
        dataForm.useridentity = data.log.useridentity
        dataForm.username = data.log.username
        dataForm.userphonenumber = data.log.userphonenumber
        dataForm.useremail = data.log.useremail
        dataForm.useraddress = data.log.useraddress
        dataForm.drugid = data.log.drugid
        dataForm.drugname = data.log.drugname
        dataForm.creattime = data.log.creattime
        dataForm.message = data.log.message
      }
    })
  }
}

// 表单提交
function dataFormSubmit() {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      $http({
        url: `/user/log/${!dataForm.id ? 'save' : 'update'}`,
        method: 'post',
        data: {
          'id': dataForm.id || undefined,
          'processed': dataForm.processed,
          'uid': dataForm.uid,
          'useridentity': dataForm.useridentity,
          'username': dataForm.username,
          'userphonenumber': dataForm.userphonenumber,
          'useremail': dataForm.useremail,
          'useraddress': dataForm.useraddress,
          'drugid': dataForm.drugid,
          'drugname': dataForm.drugname,
          'creattime': dataForm.creattime,
          'message': dataForm.message
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
