<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.modelName" placeholder="模板名称" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="handleQuery">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :data="timeModel" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column type="index" label="序号">
            </el-table-column>
            <el-table-column prop="modelName" label="模板名称" sortable>
            </el-table-column>
            <el-table-column prop="availableDays" label="预约天数"  :formatter="formatDay" sortable>
            </el-table-column>
            <el-table-column prop="timeDevideInterval" label="预约设备时长" :formatter="formatTime" sortable>
            </el-table-column>
            <el-table-column prop="remark" label="备注" sortable>
            </el-table-column>
            <el-table-column prop="status" label="状态">
                <template scope="scope">
                    <el-switch
                            v-model="scope.row.status"
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            :active-value="1"
                            :inactive-value="0"
                            @change=changeSwitch(scope.row)>
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-dropdown trigger="click">
                        <el-button size="medium" type="primary">
                            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="handleEdit(scope.$index, scope.row)">编辑</el-dropdown-item>
                            <el-dropdown-item @click.native="handleDel(scope.$index, scope.row)">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination background layout="total, sizes, prev, pager, next" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 50, 100, 200, 300, 400]" :page-size="size" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" @close="editCancel" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="150px" :rules="editFormRules" ref="editForm">
                <el-form-item label="模板名称" prop="modelName">
                    <el-input v-model="editForm.modelName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="availableDays">
                    <span slot="label" >预约天数 <br>(单位:天)</span>
                    <div class="FormInput" >
                        <el-input-number v-model="editForm.availableDays"></el-input-number>
                        <el-tooltip class="item" effect="dark" content="指可开放几天供用户预约（如：今日为26日预约天数为三天。那么用户便可预约27、28、29三天的设备）" placement="right">
                            <i class="el-icon-info"></i>
                        </el-tooltip>
                    </div>
                </el-form-item>
                <el-form-item prop="timeDevideInterval">
                    <span slot="label" >预约时间段 <br>(单位：分钟)</span>
                    <el-input-number v-model="editForm.timeDevideInterval"></el-input-number>
                    <el-tooltip class="item" effect="dark" content="指在有起止时间（营业时间）的情况下，可按照所设置的分钟数将该设备划成几个时间段" placement="right">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="editForm.remark" auto-complete="off" style="width: 50%;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editCancel">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

        <!--新增界面-->
        <el-dialog title="新增" :visible.sync="addFormVisible" @close="addCancel" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="150px" :rules="addFormRules" ref="addForm">
                <el-form-item label="模板名称" prop="modelName">
                    <el-input v-model="addForm.modelName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="availableDays">
                    <span slot="label" >预约天数 <br>(单位:天)</span>
                    <el-input-number v-model="addForm.availableDays"></el-input-number>
                    <el-tooltip class="item" effect="dark" content="指可开放几天供用户预约（如：今日为26日预约天数为三天。那么用户便可预约27、28、29三天的设备）" placement="right">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item prop="timeDevideInterval">
                    <span slot="label" >预约时间段 <br>(单位：分钟)</span>
                    <el-input-number v-model="addForm.timeDevideInterval"></el-input-number>
                    <el-tooltip class="item" effect="dark" content="指在有起止时间（营业时间）的情况下，可按照所设置的分钟数将该设备划成几个时间段" placement="right">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" v-model="addForm.remark" auto-complete="off" style="width: 50%;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addCancel">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import { getTimeModelListPage, removeTimeModel, addTimeModel, editTimeModel, isvalidDay, isvalidTime, openTimeModel, closeTimeModel } from '../../api/settingApi';
    import ElInputNumber from "../../../node_modules/element-ui/packages/input-number/src/input-number.vue";
    import util from '../../common/js/util'

    var validDay=(rule, value,callback)=>{
        if (value === ''){
            callback(new Error('请输入预约天数'))
        }else  if (!isvalidDay(value)){
            callback(new Error('请输入正确的预约天数'))
        }else {
            callback()
        }
    };

    var validTime=(rule, value,callback)=>{
        if (value === ''){
            callback(new Error('请输入预约设备时长'))
        }else  if (!isvalidTime(value)){
            callback(new Error('请输入正确的预约设备时长'))
        }else {
            callback()
        }
    };

    export default {
        components: {ElInputNumber},
        data() {
            return {
                filters: {
                    modelName: ''
                },
                timeModel: [],
                total: 0,
                page: 1,
                size: 10,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    modelName: [
                        { required: true, message: '请输入模板名称', trigger: 'blur' }
                    ],
                    availableDays: [
                        { required: true, validator: validDay }
                    ],
                    timeDevideInterval: [
                        { required: true, validator: validTime }
                    ],
                    remark: [
                        { required: true, message: '请输入备注', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    modelName: '',
                    availableDays: '',
                    timeDevideInterval: '',
                    remark: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    modelName: [
                        { required: true, message: '请输入模板名称', trigger: 'blur' }
                    ],
                    availableDays: [
                        { required: true, validator: validDay }
                    ],
                    timeDevideInterval: [
                        { required: true, validator: validTime }
                    ],
                    remark: [
                        { required: true, message: '请输入备注', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    modelName: '',
                    availableDays: '',
                    timeDevideInterval: '',
                    remark: ''
                }

            }
        },
        methods: {

            handleSizeChange(val) {
                this.size = val;
                this.getTimeModel();
            },
            handleQuery(){
                this.current = 1;
                this.getTimeModel();
            },
            //switch按钮点击触发事件，日后方便对预约状态进行修改
            changeSwitch(row){
                let para = {
                    ids: [row.id]
                }
                if(row.status == 1){
                    openTimeModel(para).then(res => {
                        if(res.meta.success){
                            this.$message({
                                message: '预约模板已开启',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message:res.meta.message,
                                type: 'error'
                            });
                        }
                    })
                }else{
                    closeTimeModel(para).then(res => {
                        if(res.meta.success){
                            this.$message({
                                message: '预约模板已关闭',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message:res.meta.message,
                                type: 'error'
                            });
                        }
                    })
                }
            },

            //天数显示格式转化
            formatDay: function (row, column) {
                return row.availableDays+"天";
            },

            //时长显示格式转化
            formatTime: function (row, column) {
                return row.timeDevideInterval+"分钟";
            },

            handleCurrentChange(val) {
                this.page = val;
                this.getTimeModel();
            },
            //获取预约模型列表
            getTimeModel() {
                let para = {
                    "page":{
                        "current":this.page,
                        "size":this.size
                    },
                    condition: this.filters
                };
                para.condition = util.filterParams(para.condition);
                this.listLoading = true;
                getTimeModelListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.timeModel = res.data.records;
                    this.listLoading = false;
                });
            },
            //删除预约模型
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = { ids: [row.id] };
                    removeTimeModel(para).then((res) => {
                        this.listLoading = false;
                        if(res.meta.success){
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message:res.meta.message,
                                type: 'error'
                            });
                        }
                        this.getTimeModel();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    modelName: '',
                    availableDays: '',
                    timeDevideInterval: '',
                    remark: ''
                };
            },
            //编辑预约模型
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if(this.editForm.timeDevideInterval > this.editForm.availableDays*60){
                        this.$message({
                            message:"预约设备时长超过了预约天数对应的时长",
                            type: 'error'
                        });
                    }else{
                        if (valid) {
                            this.$confirm('确认提交吗？', '提示', {}).then(() => {
                                this.editLoading = true;
                                let para = Object.assign({}, this.editForm);
                                editTimeModel(para).then((res) => {
                                    this.editLoading = false;
                                    if(res.meta.success){
                                        this.$message({
                                            message: '编辑成功',
                                            type: 'success'
                                        });
                                    }else{
                                        this.$message({
                                            message:res.meta.message,
                                            type: 'error'
                                        });
                                    }
                                    this.$refs['editForm'].resetFields();
                                    this.editFormVisible = false;
                                    this.getTimeModel();
                                });
                            });
                        }
                    }
                });
            },
            //新增预约模型
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if(this.addForm.timeDevideInterval > this.addForm.availableDays*60){
                        this.$message({
                            message:"预约设备时长超过了预约天数对应的时长",
                            type: 'error'
                        });
                    }else{
                        if (valid) {
                            // this.$confirm('确认提交吗？', '提示', {}).then(() => {
                                this.addLoading = true;
                                let para = Object.assign({}, this.addForm);
                                addTimeModel(para).then((res) => {
                                    this.addLoading = false;
                                    if(res.meta.success){
                                        this.$message({
                                            message: '新增成功',
                                            type: 'success'
                                        });
                                    }else{
                                        this.$message({
                                            message:res.meta.message,
                                            type: 'error'
                                        });
                                    }
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getTimeModel();
                                });
                            // });
                        }
                    }
                });
            },
            addCancel: function(){
                this.$refs.addForm.resetFields();
                this.addFormVisible = false;
            },
            editCancel: function(){
                this.$refs.editForm.resetFields();
                this.editFormVisible = false;
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = [];
                for(var i = 0;i < this.sels.length; i++){
                    ids.push(this.sels[i].id);
                }
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = { ids: ids };
                    removeTimeModel(para).then((res) => {
                        this.listLoading = false;
                        if(res.meta.success){
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                        }else{
                            this.$message({
                                message:res.meta.message,
                                type: 'error'
                            });
                        }
                        this.getTimeModel();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getTimeModel();
        }
    }

</script>

<style scoped>
    .el-dialog .el-input{
        width: 25%;
    }

    .el-dialog .el-input-number{
        width: 25%;
    }

    .el-icon-info{
        margin-left: 10px;
        font-size: 20px;
    }

    .el-icon-info:hover{
        color: #409EFF;
    }

    .el-form-item span{
        display:inline-block;
        line-height:1.3;
    }
</style>