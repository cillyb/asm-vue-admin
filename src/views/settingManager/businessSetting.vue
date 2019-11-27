<template>
    <section>
        <!--列表-->
        <el-table :header-cell-style="{'text-align':'center'}" :cell-style="{'text-align':'center'}" :data="orderSetting" highlight-current-row v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="orderPayTimeout" label="待付款订单的存在时间" :formatter="formatTimeout">
            </el-table-column>
            <el-table-column prop="refundLimitLevel1" label="第一层时间" :formatter="formatLevel1">
            </el-table-column>
            <el-table-column prop="refundLimitLevel1ServerPercent" label="一级手续费比例" :formatter="formatLevelPercent1">
            </el-table-column>
            <el-table-column prop="refundLimitLevel2" label="第二层时间" :formatter="formatLevel2">
            </el-table-column>
            <el-table-column prop="refundLimitLevel2ServerPercent" label="二级手续费比例" :formatter="formatLevelPercent2">
            </el-table-column>
            <el-table-column prop="remindTime" label="提醒时间" :formatter="formatRemindTime">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-dropdown trigger="click">
                        <el-button size="medium" type="primary">
                            更多操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="handleEdit(scope.$index, scope.row)">编辑</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <div style="padding-top: 30px">
            <p style="font-size: 15px">该设置表示：待付款订单若在{{ orderSetting[0].orderPayTimeout }}分钟内不付款就会自动取消</p>
            <p style="font-size: 15px;padding-left: 90px">退款时间大于{{ orderSetting[0].refundLimitLevel1 }}分钟（第一层时间），不需要手续费</p>
            <p style="font-size: 15px;padding-left: 90px">退款时间小于{{ orderSetting[0].refundLimitLevel1 }}分钟（第一层时间）但大于{{ orderSetting[0].refundLimitLevel2 }}分钟（第二层时间），需要支付{{ orderSetting[0].refundLimitLevel1ServerPercent }}%（一级比例）的手续费</p>
            <p style="font-size: 15px;padding-left: 90px">退款时间小于{{ orderSetting[0].refundLimitLevel2 }}分钟（第二层时间），需要支付{{ orderSetting[0].refundLimitLevel2ServerPercent }}%（二级比例）的手续费</p>
            <p style="font-size: 15px;padding-left: 90px">我们将在服务开始{{ orderSetting[0].remindTime }}分钟（提醒时间）之前，发送短信通知用户</p>
        </div>

        <!--编辑界面-->
        <el-dialog title="编辑" :visible.sync="editFormVisible" @close="editCancel" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="180px" :rules="editFormRules" ref="editForm">
                <el-form-item label="待付款订单的存在时间" prop="orderPayTimeout">
                    <el-input v-model="editForm.orderPayTimeout" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="一级时间" prop="refundLimitLevel1">
                    <el-input v-model="editForm.refundLimitLevel1" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="一级手续费比例" prop="refundLimitLevel1ServerPercent">
                    <el-input v-model="editForm.refundLimitLevel1ServerPercent" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="二级时间" prop="refundLimitLevel2">
                    <el-input v-model="editForm.refundLimitLevel2" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="二级手续费比例" prop="refundLimitLevel2ServerPercent">
                    <el-input v-model="editForm.refundLimitLevel2ServerPercent" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="提醒时间" prop="remindTime">
                    <el-input v-model="editForm.remindTime" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editCancel">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import { getOrderSettingListPage, editOrderSetting} from '../../api/settingApi';

    export default {
        data() {
            return {
                orderSetting: [],
                listLoading: false,

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    orderPayTimeout: [
                        { required: true, message: '请输入待付款订单的存在时间', trigger: 'blur' }
                    ],
                    refundLimitLevel1: [
                        { required: true, message: '请输入一级时间', trigger: 'blur' }
                    ],
                    refundLimitLevel1ServerPercent: [
                        { required: true, message: '请输入一级手续费比例', trigger: 'blur' }
                    ],
                    refundLimitLevel2: [
                        { required: true, message: '请输入二级时间', trigger: 'blur' }
                    ],
                    refundLimitLevel2ServerPercent: [
                        { required: true, message: '请输入二级手续费比例', trigger: 'blur' }
                    ],
                    remindTime: [
                        { required: true, message: '请输入提醒时间', trigger: 'blur' }
                    ],
                },
                //编辑界面数据
                editForm: {
                    orderPayTimeout: '',
                    refundLimitLevel1: '',
                    refundLimitLevel1ServerPercent: '',
                    refundLimitLevel2: '',
                    refundLimitLevel2ServerPercent: '',
                    remindTime: '',
                },
            }
        },
        methods: {
            //获取交易设置
            getOrderSetting() {
                let para = {};
                this.listLoading = true;
                getOrderSettingListPage(para).then((res) => {
                    this.orderSetting = [res.data];
                    this.listLoading = false;
                });
            },

            //订单存在时间格式转化
            formatTimeout: function (row, column) {
                return row.orderPayTimeout+"分钟";
            },
            //一级时间格式转化
            formatLevel1: function (row, column) {
                return row.refundLimitLevel1+"分钟";
            },
            //一级手续费比例格式转化
            formatLevelPercent1: function (row, column) {
                return row.refundLimitLevel1ServerPercent+"%";
            },
            //二级时间格式转化
            formatLevel2: function (row, column) {
                return row.refundLimitLevel2+"分钟";
            },
            //二级手续费比例格式转化
            formatLevelPercent2: function (row, column) {
                return row.refundLimitLevel2ServerPercent+"%";
            },
            //提醒时间格式转化
            formatRemindTime: function (row, column) {
                return row.remindTime+"分钟";
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            //编辑交易设置
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        // this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let para = Object.assign({}, this.editForm);
                            editOrderSetting(para).then((res) => {
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
                                this.getOrderSetting();
                            });
                        // });
                    }
                });
            },
        },
        mounted() {
            this.getOrderSetting();
        }
    }

</script>

<style scoped>

</style>