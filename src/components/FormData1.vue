<template>
  <div>
    <el-form :inline="true" :model="input">
      <el-form-item label="信号强度表"/>
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
          prop="atcid"
          header-align="center"
          align="center"
          label="药品ATC编码">
      </el-table-column>
      <el-table-column
          prop="atccategory"
          header-align="center"
          align="center"
          label="药品ATC分类">
      </el-table-column>
      <el-table-column
          prop="drugchinesename"
          header-align="center"
          align="center"
          label="药品名称_中文">
      </el-table-column>
      <el-table-column
          prop="drugenglishname"
          header-align="center"
          align="center"
          label="药品名称_英文">
      </el-table-column>
      <el-table-column
          prop="eventchinesename"
          header-align="center"
          align="center"
          label="事件名称_中文">
      </el-table-column>
      <el-table-column
          prop="eventenglishname"
          header-align="center"
          align="center"
          label="事件名称_英文">
      </el-table-column>
      <el-table-column
          prop="unexpected"
          header-align="center"
          align="center"
          label="说明书外不良反应">
      </el-table-column>
      <el-table-column
          prop="times"
          header-align="center"
          align="center"
          label="目标事件报告例次">
      </el-table-column>
      <el-table-column
          prop="total"
          header-align="center"
          align="center"
          label="所有实践报告例次">
      </el-table-column>
      <el-table-column
          prop="rorvalue"
          header-align="center"
          align="center"
          label="ROR值">
      </el-table-column>
      <el-table-column
          prop="rorlowerlimit"
          header-align="center"
          align="center"
          label="ROR 95%CI下限">
      </el-table-column>
      <el-table-column
          prop="rorupperlimit"
          header-align="center"
          align="center"
          label="ROR 95%CI上限">
      </el-table-column>
      <el-table-column
          prop="icvalue"
          header-align="center"
          align="center"
          label="IC值">
      </el-table-column>
      <el-table-column
          prop="iclowerlimit"
          header-align="center"
          align="center"
          label="IC 95%CI下限">
      </el-table-column>
      <el-table-column
          prop="icupperlimit"
          header-align="center"
          align="center"
          label="IC 95%CI上限">
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
        <el-form-item label="药品ATC编码" prop="atcid">
          <el-input v-model="dataForm.atcid" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="药品ATC分类" prop="atccategory">
          <el-input v-model="dataForm.atccategory" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="药品名称_中文" prop="drugchinesename">
          <el-input v-model="dataForm.drugchinesename" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="药品名称_英文" prop="drugenglishname">
          <el-input v-model="dataForm.drugenglishname" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="事件名称_中文" prop="eventchinesename">
          <el-input v-model="dataForm.eventchinesename" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="事件名称_英文" prop="eventenglishname">
          <el-input v-model="dataForm.eventenglishname" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="说明书外不良反应" prop="unexpected">
          <el-input v-model="dataForm.unexpected" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="目标事件报告例次" prop="times">
          <el-input v-model="dataForm.times" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="所有实践报告例次" prop="total">
          <el-input v-model="dataForm.total" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="ROR值" prop="rorvalue">
          <el-input v-model="dataForm.rorvalue" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="ROR 95%CI下限" prop="rorlowerlimit">
          <el-input v-model="dataForm.rorlowerlimit" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="ROR 95%CI上限" prop="rorupperlimit">
          <el-input v-model="dataForm.rorupperlimit" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="IC值" prop="icvalue">
          <el-input v-model="dataForm.icvalue" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="IC 95%CI下限" prop="iclowerlimit">
          <el-input v-model="dataForm.iclowerlimit" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="IC 95%CI上限" prop="icupperlimit">
          <el-input v-model="dataForm.icupperlimit" placeholder=""></el-input>
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
  atcid: '',
  atccategory: '',
  drugchinesename: '',
  drugenglishname: '',
  eventchinesename: '',
  eventenglishname: '',
  unexpected: '',
  times: '',
  total: '',
  rorvalue: '',
  rorlowerlimit: '',
  rorupperlimit: '',
  icvalue: '',
  iclowerlimit: '',
  icupperlimit: ''
})

const dataRule = reactive < FormRules > ({
  atcid: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  atccategory: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  drugchinesename: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  drugenglishname: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  eventchinesename: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  eventenglishname: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  unexpected: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  times: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  total: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  rorvalue: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  rorlowerlimit: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  rorupperlimit: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  icvalue: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  iclowerlimit: [
    {required: true, message: '不能为空', trigger: 'blur'}
  ],
  icupperlimit: [
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
      url: '/data/data1/list',
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
  }else{
    $http({
      url: `/data/data1/info/${input.key}`,
      method: 'get',
      params: {},
    }).then(({data}) => {
      if (data && data.code === 0 && data.data1 !== null) {
        dataList.value = [data.data1]
      }
      else{
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
  console.log(id)
  visible.value = true
  nextTick(() => {
    init(id)
    console.log(id)
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
      url: '/data/data1/delete',
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
  console.log(id)
  dataForm.id = id || 0
  visible.value = true
  //await nextTick()
  dataFormRef.value.resetFields()
  if (dataForm.id) {
    $http({
      url: `/data/data1/info/${dataForm.id}`,
      method: 'get',
      params: {},
    }).then(({data}) => {
      if (data && data.code === 0) {
        dataForm.atcid = data.data1.atcid
        dataForm.atccategory = data.data1.atccategory
        dataForm.drugchinesename = data.data1.drugchinesename
        dataForm.drugenglishname = data.data1.drugenglishname
        dataForm.eventchinesename = data.data1.eventchinesename
        dataForm.eventenglishname = data.data1.eventenglishname
        dataForm.unexpected = data.data1.unexpected
        dataForm.times = data.data1.times
        dataForm.total = data.data1.total
        dataForm.rorvalue = data.data1.rorvalue
        dataForm.rorlowerlimit = data.data1.rorlowerlimit
        dataForm.rorupperlimit = data.data1.rorupperlimit
        dataForm.icvalue = data.data1.icvalue
        dataForm.iclowerlimit = data.data1.iclowerlimit
        dataForm.icupperlimit = data.data1.icupperlimit
      }
    })
  }
}

// 表单提交
function dataFormSubmit() {
  dataFormRef.value.validate((valid) => {
    if (valid) {
      $http({
        url: `/data/data1/${!dataForm.id ? 'save' : 'update'}`,
        method: 'post',
        data: {
          'id': dataForm.id || undefined,
          'atcid': dataForm.atcid,
          'atccategory': dataForm.atccategory,
          'drugchinesename': dataForm.drugchinesename,
          'drugenglishname': dataForm.drugenglishname,
          'eventchinesename': dataForm.eventchinesename,
          'eventenglishname': dataForm.eventenglishname,
          'unexpected': dataForm.unexpected,
          'times': dataForm.times,
          'total': dataForm.total,
          'rorvalue': dataForm.rorvalue,
          'rorlowerlimit': dataForm.rorlowerlimit,
          'rorupperlimit': dataForm.rorupperlimit,
          'icvalue': dataForm.icvalue,
          'iclowerlimit': dataForm.iclowerlimit,
          'icupperlimit': dataForm.icupperlimit
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
