<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.modelName" placeholder="价格模板名称"></el-input>
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
        <el-table :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :data="shareholding" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column type="index" label="序号">
            </el-table-column>
            <!--<el-table-column prop="id" label="模板id" sortable>-->
            <!--</el-table-column>-->
            <el-table-column prop="modelName" label="模板名称" sortable>
            </el-table-column>
            <el-table-column prop="price" label="价格" :formatter="formatPrice" sortable>
            </el-table-column>
            <el-table-column prop="unitCount" label="时长" sortable>
            </el-table-column>
            <el-table-column prop="unitName" label="单位" sortable>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" sortable>
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
                <el-form-item prop="unitCount">
                    <span slot="label" >时长 <br>(单位：分钟)</span>
                    <el-input-number v-model="editForm.unitCount" auto-complete="off" placeholder="请输入时长"></el-input-number>
                    <el-tooltip class="item" effect="dark" content="指设备单次运行所需要的时间" placement="right">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item prop="price">
                    <span slot="label" >价格 <br>(单位：元)</span>
                    <el-input v-model="editForm.price" auto-complete="off" placeholder="请输入价格"></el-input>
                    <el-tooltip class="item" effect="dark" content="指设备单次运行所要支付的价格" placement="right">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
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
                <el-form-item prop="unitCount">
                    <span slot="label" >时长 <br>(单位：分钟)</span>
                    <el-input-number v-model="addForm.unitCount" auto-complete="off"></el-input-number>
                    <el-tooltip class="item" effect="dark" content="指设备单次运行所需要的时间" placement="right">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item prop="price">
                    <span slot="label" >价格 <br>(单位：元)</span>
                    <el-input v-model="addForm.price" auto-complete="off" placeholder="单位是元"></el-input>
                    <el-tooltip class="item" effect="dark" content="指设备单次运行所要支付的价格" placement="right">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
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
    import util from '../../common/js/util'

    import { getPriceModelListPage, removePriceModel, addPriceModel, editPriceModel, isvalidPrice, isvalidUnitCount, openPriceModel, closePriceModel } from '../../api/settingApi';

    var validPrice=(rule, value,callback)=>{
        if (value === ''){
            callback(new Error('请输入价格'))
        }else  if (!isvalidPrice(value)){
            callback(new Error('请输入正确的价格'))
        }else {
            callback()
        }
    };

    var validUnitCount=(rule, value,callback)=>{
        if (value === ''){
            callback(new Error('请输入时长'))
        }else  if (!isvalidUnitCount(value)){
            callback(new Error('请输入正确的时长'))
        }else {
            callback()
        }
    };

    export default {
        data() {
            return {
                filters: {
                    modelName: ''
                },
                shareholding: [],
                total: 0,
                page: 1,
                size: 10,
                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    modelName: [
                        { required: true, message: '请输入价格模板名称', trigger: 'blur' }
                    ],
                    unitCount: [
                        { required: true, validator: validUnitCount }
                    ],
                    price: [
                        { required: true, validator: validPrice, trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    modelName: '',
                    shareholdingPercent: ''
                },

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    modelName: [
                        { required: true, message: '请输入价格模板名称', trigger: 'blur' }
                    ],
                    unitCount: [
                        { required: true, validator: validUnitCount }
                    ],
                    price: [
                        { required: true, validator: validPrice, trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    modelName: '',
                    unitCount: '',
                    price: ''
                }
            }
        },
        methods: {

            handleSizeChange(val) {
                this.size = val;
                this.getPriceModel();
            },
            handleQuery(){
                this.current = 1;
                this.getPriceModel();
            },
            //switch按钮点击触发事件，日后方便对价格状态进行修改
            changeSwitch(row){
                let para = {
                    ids: [row.id]
                }
                if(row.status == 1){
                    openPriceModel(para).then(res => {
                        if(res.meta.success){
                            this.$message({
                                message: '价格模板已开启',
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
                    closePriceModel(para).then(res => {
                        if(res.meta.success){
                            this.$message({
                                message: '价格模板已关闭',
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

            //百分比显示格式转化
            formatPrice: function (row, column) {
                return row.price+"元";
            },

            handleCurrentChange(val) {
                this.page = val;
                this.getPriceModel();
            },
            //获取价格模板列表
            getPriceModel() {
                let para = {
                    page:{
                        current:this.page,
                        size:this.size
                    },
                    condition: this.filters
                };
                para.condition = util.filterParams(para.condition);
                this.listLoading = true;
                getPriceModelListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.shareholding = res.data.records;
                    this.listLoading = false;
                });
            },
            //删除价格模板
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = { ids: [row.id] };
                    console.log(para);
                    removePriceModel(para).then((res) => {
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
                        this.getPriceModel();
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
                    unitCount: '',
                    price: ''
                };
            },
            //编辑价格模板
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            editPriceModel(para).then((res) => {
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
                                this.getPriceModel();
                            });
                        });
                    }
                });
            },
            //新增价格模板
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        // this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            let para = Object.assign({}, this.addForm);
                            para.priceUnitId = "4623c111cecd9a19251304b2db184468";
                            addPriceModel(para).then((res) => {
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
                                this.getPriceModel();
                            });
                        // });
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
                    removePriceModel(para).then((res) => {
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
                        this.getPriceModel();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getPriceModel();
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