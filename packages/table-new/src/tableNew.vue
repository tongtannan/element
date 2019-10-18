<template>
  <div class="el-table-new">
    <template :table="table">
      <el-table :stripe="!table.hideStripe" :show-summary="table.hasShowSummary" :summary-method="table.getSummaries" ref="TlRlTable" :data="table.data" tooltip-effect="dark" :border="table.border" style="width: 100%" :row-class-name="rowClassName" :span-method="objectSpanMethod" header-row-class-name="thClassName" :class="{elTableNoneBorder: table.noneBorder}" @selection-change="handleSelectionChange" @cell-click="cellClick" @sort-change="sortChange" @row-click="rowClick" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column v-if="table.hasSelect" type="selection" width="55">
        </el-table-column>
        <el-table-column type="index" width="40" v-if="table.index" :label="table.indexName" :index="indexMethod">
        </el-table-column>
        <el-table-column type="expand" v-if="table.hasExpand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item :label="item.label" v-for="item in table.expands" :key="item.id">
                <span>{{ props.row[item.prop] }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <template v-for="(item) in table.tr">
          <el-table-column v-if="item.show === 'template'" :label="item.label" :sortable="item.sortable ? 'custom' : false" :class-name="item.className ? item.className : ''" :key="item.id" :width="item.width ? item.width : ''" :min-width="item.minWidth ? item.minWidth : ''">
            <template slot-scope="scope">
              <slot :item="scope.row[item.prop] ? scope.row : scope.row" :name="item.prop"></slot>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.show !== false && item.show !== 'template'" :label="item.label" :prop="item.prop" :class-name="item.className ? item.className : ''" :key="item.id" :sortable="item.sortable ? 'custom' : false" :width="item.width ? item.width : ''" :min-width="item.minWidth ? item.minWidth : ''" :show-overflow-tooltip="true">
          </el-table-column>
        </template>
        <el-table-column column-key="operation" :label="table.operation.label" :width="table.operation.width ? table.operation.width : ''" :min-width="table.operation.minWidth ? table.operation.minWidth : ''" :class-name="table.operation.className" v-if="table.hasOperation">
          <template slot-scope="scope">
            <el-button v-for="item in table.operation.data" :class="item.classname ? item.classname : ''" :key="item.id" :size="item.size" :icon="item.icon ? item.icon : ''" @click.stop="handleOperation(scope.$index, item.id, scope)">
              {{ item.label }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.page + 1" :page-sizes="[10, 20, 30, 40]" :page-size="page.size" layout=" prev, pager, next, sizes" v-if="!table.hidePage" :total="totalElements">
    </el-pagination>
  </div>
</template>

<script>
import ElTable from 'element-ui/packages/table'
import ElTableColumn from 'element-ui/packages/table-column'
import ElForm from 'element-ui/packages/form'
import ElFormItem from 'element-ui/packages/form-item'
import ElButton from 'element-ui/packages/button'
import ElPagination from 'element-ui/packages/pagination'
import MyInterface from './interface'
let NewInterface = new MyInterface()
let selectionList = []
export default {
  name: 'ElTableNew',
  components: {
    ElTable,
    ElTableColumn,
    ElForm,
    ElFormItem,
    ElButton,
    ElPagination
  },
  props: {
    table: Object
  },
  data() {
    return {
      page: {
        page: 0,
        size: 10
      },
      totalElements: 0,
      loading: false,
      params: {
        search: ''
      }
    }
  },
  created() {
    this.table.getSrc && this.init()
  },
  methods: {
    // 初始化table
    init() {
      if (!this.table.noFirstInit) {
        // this.loading = true
        NewInterface.get(this.table.getSrc, this.params)
          .then(res => {
            this.table.data = res
          })
          .catch(() => {})
          .finally(() => {
            // this.loading = false
          })
      }
    },
    changeTime(val) {
      const time = new Date(val)
      const month_1 = time.getMonth() + 1
      const month = month_1 < 10 ? '0' + month_1 : month_1
      const date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
      const hour =
        time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
      const minute =
        time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
      const second =
        time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()
      return (
        time.getFullYear() +
        '-' +
        month +
        '-' +
        date +
        ' ' +
        hour +
        ':' +
        minute +
        ':' +
        second
      )
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.page.page = val - 1
      this.init()
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.page.size = val
      this.init()
    },
    // 当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      selectionList = val
      this.$emit('onHandleSelectionChange', val)
    },
    // 排序
    sortChange(val) {
      const order = val.order
      this.page.field = val.prop
      this.page.order = order === 'ascending' ? 'ASC' : 'DESC'
      this.init()
    },
    // 操作
    handleOperation(a, id) {
      // console.log(a,id,data);
      if (this.table.operation.data) {
        const data = this.table.operation.data
        for (let i = 0; i < data.length; i++) {
          if (id === data[i].id) {
            if (data[i].Fun === 'delete') {
              this.delete(this.table.data[a])
            } else if (data[i].Fun === 'modify') {
              this.modify(this.table.data[a])
            } else if (data[i].Fun === 'deleteline') {
              this.deleteline(this.table.data[a])
            } else {
              this.$emit('handleOperation', {
                value: this.table.data[a],
                handle: data[i].Fun
              })
            }
          }
        }
      }
    },
    // 批量删除
    deleteAll() {
      if (selectionList.length) {
        let data = ''
        selectionList.forEach((item, idx) => {
          let val = selectionList[idx + 1] ? item.dbid + ',' : item.dbid
          data += val
        })
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            console.log(data)
          })
          .catch(() => {})
      } else {
        this.$message({
          type: 'error',
          message: '请先选择'
        })
      }
    },
    // 删除
    delete(val) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          NewInterface.delete(`${this.table.deleteSrc}?id=${val.id}`)
            .then(() => {})
            .catch(() => {})
        })
        .catch(() => {})
    },
    // 删除行（不发送请求）
    deleteline(val) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$emit('deleteline', val)
        })
        .catch(() => {})
    },
    // 修改
    modify(val) {
      this.$emit('modify', val)
    },
    // 搜索
    select(val) {
      console.log(val)
    },
    // 序号
    indexMethod(index) {
      return this.page.page * this.page.size + index + 1
    },
    // 合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (!this.table.hasMergeRowOrColumn) {
        return
      } else {
        if (columnIndex === 0) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
        this.$emit('onMergeRowOrColumn', { row, column, rowIndex, columnIndex })
      }
    },
    // 点击某个单元格时触发
    cellClick(row, column) {
      if (
        column.className === 'classname-from' ||
        column.className === 'classname-click'
      ) {
        this.$emit('cellClick', {
          val: row,
          label: column.label
        })
      }
    },
    // 点击某一行时触发的函数
    // *** 按下左键然后移动鼠标到其它列放开左键，会有报错 -- 优化：添加点击行参数，
    rowClick(Row, Event, Column) {
      if (
        !Column ||
        Column.type === 'selection' ||
        Column.columnKey === 'operation' ||
        Column.type === 'expand'
      ) {
        return
      }
      const data = {
        row: Row,
        event: Event,
        column: Column
      }
      this.$emit('onRowClick', data)
      if (this.table.isClickChangeColor) {
        for (const val of document.querySelectorAll('.el-table tr')) {
          if (val.classList) {
            val.classList.remove('success-row')
          }
        }
        // if (document.querySelectorAll('.el-table tr').classList) {
        //     document.querySelectorAll('.el-table tr').classList.remove('success-row')
        //   }
        this.table.data.forEach((item, idx) => {
          if (Row == item) {
            document
              .querySelectorAll('.el-table__row')
              [idx].classList.add('success-row')
          }
        })
      }
    },
    // 行类名的回调函数
    // 在表格数据中添加class字段即为表格行类名，配合css可对表格行中的自定义标签进行样式优化
    rowClassName({ rowdata }) {
      return rowdata
      //   const data = this.table.data;
      //   let className = data[rowdata.rowIndex].class ? data[rowdata.rowIndex].class : '';
      //   if (className.length === 0) {
      //     return
      //   }
      //   className = className.join(' ');
      //   return className
    }
  }
}
</script>