<template>
    <section>
        <div class="app-container">
            <el-row :gutter="20">
                <!--部门数据-->
                <el-col :span="4" :xs="24" style="width: 240px ">
                    <div class="head-container" style="margin-top: 10px;">
                        设备类型
                    </div>
                    <hr style="height:1px;border:none;border-top:1px solid #555555;"/>
                    <div class="toolbar">
                        <el-button type="primary" size="mini" v-on:click="addType">新增</el-button>
                        <el-button type="primary" size="mini" v-on:click="updateType">修改</el-button>
                        <el-button type="primary" size="mini" v-on:click="removeType">删除</el-button>
                    </div>
                    <div class="head-container" style="height: 100%;">
                        <el-tree
                                ref="treeBox"
                                node-key="id"
                                :data="data"
                                :props="defaultProps"
                                :highlight-current="true"
                                :expand-on-click-node="false"
                                default-expand-all
                                @node-click="handleNodeClick">
                        </el-tree>
                    </div>
                </el-col>
                <!--类型新增界面-->
                <el-dialog title="新增类型" :visible.sync="addTypeVisible" :close-on-click-modal="false" width="18%">
                    <el-form label-width="30%" :model="addTypeForm" ref="addTypeForm">
                        <el-form-item label="类型名" prop="name">
                            <el-input v-model="addTypeForm.addTypeName" auto-complete="off" size="small"
                                      style="width: 60%;"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="addTypeVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="addTypeSubmit" :loading="editLoading">提交</el-button>
                    </div>
                </el-dialog>
                <!--类型编辑界面-->
                <el-dialog title="编辑类型" :visible.sync="editTypeVisible" :close-on-click-modal="false" width="18%">
                    <el-form label-width="30%" :model="editTypeForm" ref="editTypeForm">
                        <el-form-item label="类型名" prop="name">
                            <el-input v-model="editTypeForm.editTypeName" auto-complete="off" size="small"
                                      style="width: 60%;"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click.native="editTypeVisible = false">取消</el-button>
                        <el-button type="primary" @click.native="editTypeSubmit" :loading="editLoading">提交</el-button>
                    </div>
                </el-dialog>
                <el-col :span="20" :xs="24" :sm="22" :md="20" :lg="18" :xl="18">
                    <!--工具条-->
                    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                        设备名称:<el-input v-model="condition.assetName" style="width: 10%;"></el-input>
                        所属社区:<el-input v-model="condition.communityName" style="width: 10%;"></el-input>
                        <el-select v-model="condition.isAppuserHold" clearable placeholder="是否有持有人">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                        <el-button type="primary" v-on:click="handleQuery">查询</el-button>
                        <el-button type="primary" @click="handleAdd">新增</el-button>
                    </el-col>

                    <!--列表-->
                    <el-table :data="devices" highlight-current-row v-loading="listLoading"
                              @selection-change="selsChange" style="width: 100%;">
                        <el-table-column type="selection" width="55">
                        </el-table-column>
                        <el-table-column type="index" width="60">
                        </el-table-column>
                        <el-table-column prop="assetName" label="设备名称" width="120" sortable>
                        </el-table-column>
                        <el-table-column prop="deviceNo" label="设备编号" width="100" sortable>
                        </el-table-column>
                        <el-table-column prop="typeName" label="分类" width="100">
                        </el-table-column>
                        <el-table-column prop="provideEndTime" label="截止提供时间" width="150" sortable>
                        </el-table-column>
                        <el-table-column prop="firstCost" label="成本价格" min-width="100" sortable>
                        </el-table-column>
                        <el-table-column prop="" label="租赁价格">
                            <template slot-scope="scope">
                                <el-button @click="showPrice(scope.row)" type="text" size="small">查看</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="shareholdingPercent" label="分利比" :formatter="formatPercent" min-width="100" sortable>
                        </el-table-column>
                        <el-table-column prop="communityName" label="所属社区" min-width="100" sortable>
                        </el-table-column>
                        <el-table-column prop="" label="二维码"  >
                            <template slot-scope="scope">
                                <el-button @click="showImg(scope.row)" type="text" size="small">查看</el-button>
                            </template>
                        </el-table-column>
                        <!--            <el-table-column prop="" label="设备二维码" min-width="100">-->
                        <!--            </el-table-column>-->
                        <el-table-column label="操作" width="150" header-align="center" align="center">
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
                </el-col>
            </el-row>

            <!--租赁价格查看-->
            <el-dialog :title="priceTitle" :visible.sync="showPriceVisible"  width="25%">
                <div style="text-align: center; font-size: large">
                    {{ price }}元 / {{ unitCount }} {{ unitName }}
                </div>
            </el-dialog>

            <!--二维码查看-->
            <el-dialog :title="erweimaTitle" :visible.sync="showErweimaVisible"  width="25%">
                <img :src="erweimaUrl" height="100%" width="100%">
            </el-dialog>

            <!--新增界面+编辑界面-->
            <el-dialog :title="op == 'add' ? '新增' : '编辑'" :visible.sync="addFormVisible" :close-on-click-modal="false">
                <el-form :model="addForm" label-width="150px" :rules="addFormRules" ref="addForm">
                    <el-form-item label="设备名称" prop="assetName">
                        <el-input v-model="addForm.assetName" auto-complete="off" style="width: 25%;"></el-input>
                    </el-form-item>
                    <el-form-item label="分类" prop="typeId">
                        <el-cascader
                                clearable
                                filterable
                                style="width: 25%;"
                                v-model="addForm.typeId"
                                :options="optionsType"
                                :show-all-levels="false"
                                :props="{ expandTrigger: 'hover', value: 'id', label: 'typeName', children: 'fork'}"
                                @change="handleChange"></el-cascader>
                    </el-form-item>
                    <el-form-item label="所属社区" prop="communityId">
                        <span v-model="addForm.communityId">{{ addForm.communityName }}</span>
                        <el-button @click="addChoiceCommunity">选择</el-button>
                    </el-form-item>
                    <el-form-item label="开始提供时间" prop="provideStartTime">
                        <el-date-picker
                                value-format="yyyy-MM-dd"
                                style="width: 25%;"
                                v-model="addForm.provideStartTime"
                                placeholder="选择日期"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="截止提供时间" prop="provideEndTime">
                        <el-date-picker
                                value-format="yyyy-MM-dd"
                                style="width: 25%;"
                                v-model="addForm.provideEndTime"
                                placeholder="选择日期"
                                >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="成本价格" prop="firstCost">
                        <el-input v-model="addForm.firstCost" type="number" auto-complete="off" min="0"
                                  style="width: 25%;"></el-input>
                    </el-form-item>
                    <el-form-item label="是否可以预约">
                        <el-radio-group v-model="addForm.isCanBook">
                            <el-radio class="radio" :label="0">否</el-radio>
                            <el-radio class="radio" :label="1">是</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否有持有人">
                        <el-radio-group v-model="addForm.isAppuserHold">
                            <el-radio class="radio" :label="0">否</el-radio>
                            <el-radio class="radio" :label="1">是</el-radio>
                        </el-radio-group>
                        <el-form-item v-if="addForm.isAppuserHold == 1" label="持有人: ">
                            <span v-model="addForm.appuserId">{{ addForm.userName }}</span>
                            <el-button @click="addChoiceHolder">选择</el-button>
                        </el-form-item>
                        <el-form-item v-if="addForm.isAppuserHold == 1" label="分利方案: " >
                            <span v-model="addForm.shareholdingPercentModelId">{{ addForm.shareholdingModelName }}</span>
                            <el-button @click="addChoiceShare">选择</el-button>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="预约方案">
                        <span v-model="addForm.appointmentModelId">{{ addForm.appointModelName }}</span>
                        <el-button @click="addChoiceAppoint">选择</el-button>
                    </el-form-item>
                    <el-form-item label="价格方案">
                        <span v-model="addForm.priceModelId">{{ addForm.priceModelName }}</span>
                        <el-button @click="addChoicePrice">选择</el-button>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="addCancel">取消</el-button>
                    <el-button v-if="op == 'add'" type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
                    <el-button v-if="op == 'edit'" type="primary" @click.native="editSubmit" :loading="addLoading">修改</el-button>

                </div>
            </el-dialog>

            <!--            社区选择-->
            <el-dialog title="社区选择" :visible.sync="showCommunityList" width="50%" :close-on-click-modal="false">
                <!--列表-->
                <el-table :data="communitys" highlight-current-row v-loading="listLoading"
                          @current-change="selsCommunityChange" style="width: 100%;">
                    <el-table-column type="index">
                    </el-table-column>
                    <el-table-column prop="communityName" label="社区名称" sortable>
                    </el-table-column>
                    <el-table-column prop="address" label="社区地址" sortable>
                    </el-table-column>
                    <el-table-column prop="manager" label="管理员" sortable>
                    </el-table-column>
                    <el-table-column prop="managerPhone" label="联系电话" sortable>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background layout="total, prev, pager, next"
                                   @current-change="handlCommunityCurrentChange" :page-size="size"
                                   :total="otherTotal" style="float:right;">
                    </el-pagination>
                </el-col>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="showCommunityList = false">取消</el-button>
                    <el-button type="primary" @click.native="choiceCommunity" :loading="addLoading">选择</el-button>
                </div>
            </el-dialog>


            <!--            预约选择-->
            <el-dialog title="预约模板选择" :visible.sync="showAppointList" width="50%" :close-on-click-modal="false">
                <!--列表-->
                <el-table :data="appoints" highlight-current-row v-loading="listLoading"
                          @current-change="selsAppointChange" style="width: 100%;">
                    <el-table-column type="index">
                    </el-table-column>
                    <el-table-column prop="modelName" label="模板名称" sortable>
                    </el-table-column>
                    <el-table-column prop="availableDays" label="预约天数" sortable>
                    </el-table-column>
                    <el-table-column prop="timeDevideInterval" label="预约时长" sortable>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" sortable>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background layout="total, prev, pager, next"
                                   @current-change="handlAppointCurrentChange" :page-size="size"
                                   :total="otherTotal" style="float:right;">
                    </el-pagination>
                </el-col>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="showAppointList = false">取消</el-button>
                    <el-button type="primary" @click.native="choiceAppoint" :loading="addLoading">选择</el-button>
                </div>
            </el-dialog>

            <!--            价格选择-->
            <el-dialog title="价格模板选择" :visible.sync="showPriceList" width="50%" :close-on-click-modal="false">
                <!--列表-->
                <el-table :data="prices" highlight-current-row v-loading="listLoading"
                          @current-change="selsPriceChange" style="width: 100%;">
                    <el-table-column type="index">
                    </el-table-column>
                    <el-table-column prop="modelName" label="模板名称" sortable>
                    </el-table-column>
                    <el-table-column prop="price" label="价格" sortable>
                    </el-table-column>
                    <el-table-column prop="unitCount" label="时长" sortable>
                    </el-table-column>
                    <el-table-column prop="unitName" label="单位" sortable>
                    </el-table-column>
                    <el-table-column prop="remark" label="备注" sortable>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background layout="total, prev, pager, next"
                                   @current-change="handlPriceCurrentChange" :page-size="size"
                                   :total="otherTotal" style="float:right;">
                    </el-pagination>
                </el-col>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="showPriceList = false">取消</el-button>
                    <el-button type="primary" @click.native="choicePrice" :loading="addLoading">选择</el-button>
                </div>
            </el-dialog>

            <!--            持有人选择-->
            <el-dialog title="持有人选择" :visible.sync="showHolderList" width="50%" :close-on-click-modal="false">
                <!--列表-->
                <el-table :data="holders" highlight-current-row v-loading="listLoading"
                          @current-change="selsHolderChange" style="width: 100%;">
                    <el-table-column type="index">
                    </el-table-column>
                    <el-table-column prop="userName" label="用户名" sortable>
                    </el-table-column>
                    <el-table-column prop="phoneNumber" label="手机号" sortable>
                    </el-table-column>
                    <el-table-column prop="sex" label="性别" sortable>
                    </el-table-column>
                    <el-table-column prop="createTime" label="注册时间" sortable>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background layout="total, prev, pager, next"
                                   @current-change="handlHolderCurrentChange" :page-size="size"
                                   :total="otherTotal" style="float:right;">
                    </el-pagination>
                </el-col>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="showHolderList = false">取消</el-button>
                    <el-button type="primary" @click.native="choiceHolder" :loading="addLoading">选择</el-button>
                </div>
            </el-dialog>

            <!--            分利选择-->
            <el-dialog title="分利选择" :visible.sync="showShareList" width="50%" :close-on-click-modal="false">
                <!--列表-->
                <el-table :data="shares" highlight-current-row v-loading="listLoading"
                          @current-change="selsShareChange" style="width: 100%;">
                    <el-table-column type="index">
                    </el-table-column>
                    <el-table-column prop="modelName" label="模板名称" sortable>
                    </el-table-column>
                    <el-table-column prop="shareholdingPercent" label="分利百分比" sortable>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" sortable>
                    </el-table-column>
                </el-table>
                <!--工具条-->
                <el-col :span="24" class="toolbar">
                    <el-pagination background layout="total, prev, pager, next"
                                   @current-change="handlShareCurrentChange" :page-size="size"
                                   :total="otherTotal" style="float:right;">
                    </el-pagination>
                </el-col>
                <div slot="footer" class="dialog-footer">
                    <el-button @click.native="showShareList = false">取消</el-button>
                    <el-button type="primary" @click.native="choiceShare" :loading="addLoading">选择</el-button>
                </div>
            </el-dialog>

        </div>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import {getUserListPage, removeUser, batchRemoveUser, editUser, addUser} from '../../api/api';
    import {
        getTypeTree,
        getDevices,
        removeDevice,
        updateTypeName,
        addTypeName,
        removeTypeName,
        addDevice,
        updateDevice,
        getTypeTreeRoute, getAssetErweimaUrl
    } from '../../api/deviceApi'
    import {getCommunityListPage} from '../../api/communityApi'
    import {getTimeModelListPage, getPriceModelListPage, getShareholdingListPage} from '../../api/settingApi'
    import {getHolderListPage} from '../../api/holderApi'

    export default {
        data() {
            return {
                options:[
                    {
                        value: 1,
                        label:'有持有人'
                    },
                    {
                        value: -1,
                        label:'无持有人'
                    },
                ],
                //区分是新增还是编辑操作
                op:'add',

                //实体列表
                devices: [],
                communitys: [],
                prices:[],
                holders:[],
                shares:[],
                appoints:[],

                //选中得
                selsCommunity: '',
                selsAppoint: '',
                selsPrice:'',
                selsHolder:'',
                selsShare:'',

                showCommunityList: false,
                showAppointList: false,
                showPriceList: false,
                showHolderList: false,
                showShareList: false,


                //价格
                showPriceVisible:false,
                priceTitle:'',
                price:'',
                unitCount:'',
                unitName:'',

                //二维码
                showErweimaVisible: false,
                erweimaTitle: '',
                erweimaUrl: '',

                currentNode: '',
                optionsType: {},
                condition: {
                    typeId: '',
                    isAppuserHold:'',
                    assetName: '',
                    communityName: '',
                },
                //treeData
                data: {},
                defaultProps: {
                    children: 'fork',
                    label: 'typeName'
                },
                addTypeVisible: false,
                editTypeVisible: false,
                //类型新增编辑时的临时变量
                // addTypeName: '',
                // editTypeName: '',
                addTypeForm: {
                    addTypeName: ''
                },
                editTypeForm: {
                    editTypeName: ''
                },

                filters: {
                    name: ''
                },

                total: 0,
                size: 10,
                current: 1,
                //其他列表分页参数
                otherTotal: 0,
                otherCurrent: 1,

                listLoading: false,
                sels: [],//列表选中列

                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ]
                },
                //编辑界面数据
                editForm: {},

                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    assetName: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
                    ],
                    typeId: [
                        {required: true, message: '请选择分类', trigger: 'blur'}
                    ],
                    communityId: [
                        {required: true, message: '请选择所属社区', trigger: 'blur'}
                    ],
                    provideStartTime: [
                        {required: true, message: '请输入开始提供时间', trigger: 'blur'}
                    ],
                    provideEndTime: [
                        {required: true, message: '请输入截止提供时间', trigger: 'blur'}
                    ],
                    firstCost: [
                        {required: true, message: '请输入成本价格', trigger: 'blur'}
                    ],
                },
                //新增界面数据
                addForm: {
                    assetName: '',
                    typeId: [],
                    provideStartTime: '',
                    provideEndTime: '',
                    firstCost: '',
                    isCanBook:0,
                    isAppuserHold: '',
                    shareholdingPercentModelId: '',
                    priceModelId: '',
                    appointmentModelId: '',
                    communityId: '',
                    appuserId: '',
                    userName: '',
                    shareholdingModelName: '',
                    appointModelName: '',
                    priceModelName: '',

                }

            }
        },
        methods: {
            //cascader社区选择
            handleChange(value) {
                console.log(value);
                console.log("社区选择发生变化")
                var tmp = value;
                if (Array.isArray(tmp) && tmp != null && tmp.length > 0) {
                    tmp = tmp[tmp.length-1];
                }
                // console.log(tmp);
                this.addForm.typeId = tmp;
            },

            //百分比显示格式转化
            formatPercent: function (row, column) {
                if(row.shareholdingPercent != null) {
                    return row.shareholdingPercent+"%";
                }
            },

            //显示价格
            showPrice(row) {
                this.showPriceVisible = true;
                this.priceTitle = row.assetName+"的价格";
                let para = {
                    page:{
                        current:1,
                        size:10
                    },
                    condition: {
                        id:row.priceModelId
                    }
                };
                para.condition = util.filterParams(para.condition);
                getPriceModelListPage(para).then((res) => {
                    if(res.meta.success) {
                        this.price = res.data.records[0].price;
                        this.unitCount = res.data.records[0].unitCount;
                        this.unitName = res.data.records[0].unitName;
                        console.log(row.assetName + " " + price + " " + unitCount + " " + unitName);
                    } else {
                        this.$message({
                            message: res.meta.message,
                            type: 'error'
                        });
                    }
                });
            },

            //显示二维码
            showImg(row) {
                this.showErweimaVisible = true;
                this.erweimaTitle = row.assetName;
                let para = {
                    id: row.id
                };
                getAssetErweimaUrl(para).then((res) => {
                    if (res.meta.success) {
                        this.erweimaUrl = res.data.qrCodeUrl;
                        console.log(this.erweimaUrl);
                    } else {
                        this.$message({
                            message: res.meta.message,
                            type: 'error'
                        });
                    }
                });
                // console.log(row)
            },

            handleSizeChange(val) {
                this.size = val;
                this.getDevices();
            },

            handleQuery(){
                // console.log(this.condition);
                this.current = 1;
                this.getDevices();
            },
            //------------------------------------------------
            //获取社区
            getCommunity() {
                let para = {
                    "page": {
                        "current": this.otherCurrent,
                        "size": this.size
                    },
                    "condition":{
                        "status": 1
                    }
                };
                this.listLoading = true;
                getCommunityListPage(para).then((res) => {
                    this.otherTotal = res.data.total;
                    this.communitys = res.data.records;
                    this.listLoading = false;
                });
            },
            //点击选择
            choiceCommunity() {
                if (this.selsCommunity == '' || this.selsCommunity == null) {
                    this.$message({
                        message: '请选择社区',
                        type: 'info'
                    });
                } else {
                    this.addForm.communityId = this.selsCommunity.id;
                    this.addForm.communityName = this.selsCommunity.communityName;
                    this.showCommunityList = false;
                }
            },
            //
            selsCommunityChange(val) {
                this.selsCommunity = val;
            },
            //点击选择社区
            addChoiceCommunity() {
                this.otherCurrent = 1;
                this.getCommunity();
                this.selsCommunity = '';
                this.showCommunityList = true;
                // this.addForm.communityId = 321;
            },

            //------------------------------------------------
            //获取预约
            getAppoint() {
                let para = {
                    "page": {
                        "current": this.otherCurrent,
                        "size": this.size
                    },
                    "condition":{
                        "status": 1
                    }
                };
                this.listLoading = true;
                getTimeModelListPage(para).then((res) => {
                    this.otherTotal = res.data.total;
                    this.appoints = res.data.records;
                    this.listLoading = false;
                });
            },
            //点击选择
            choiceAppoint() {
                console.log(this.selsAppoint);
                if (this.selsAppoint == '' || this.selsAppoint == null) {
                    this.$message({
                        message: '请选择预约模板',
                        type: 'info'
                    });
                } else {
                    this.addForm.appointmentModelId = this.selsAppoint.id;
                    this.addForm.appointModelName = this.selsAppoint.modelName;
                    this.showAppointList = false;
                }
            },
            //
            selsAppointChange(val) {
                console.log(val);
                this.selsAppoint = val;
            },
            //点击选择预约方案
            addChoiceAppoint() {
                this.otherCurrent = 1;
                this.getAppoint();
                this.selsAppoint = '';
                this.showAppointList = true;
            },

            //------------------------------------------------
            //获取价格方案
            getPrice() {
                let para = {
                    "page": {
                        "current": this.otherCurrent,
                        "size": this.size
                    },
                    "condition":{
                        "status": 1
                    }
                };
                this.listLoading = true;
                getPriceModelListPage(para).then((res) => {
                    this.otherTotal = res.data.total;
                    this.prices = res.data.records;
                    this.listLoading = false;
                });
            },
            //点击选择
            choicePrice() {
                // console.log(this.selsAppoint);
                if (this.selsPrice == '' || this.selsPrice == null) {
                    this.$message({
                        message: '请选择价格模板',
                        type: 'info'
                    });
                } else {
                    this.addForm.priceModelId = this.selsPrice.id;
                    this.addForm.priceModelName = this.selsPrice.modelName;
                    this.showPriceList = false;
                }
            },
            //
            selsPriceChange(val) {
                // console.log(val);
                this.selsPrice = val;
            },
            //点击选择价格方案
            addChoicePrice() {
                this.otherCurrent = 1;
                this.getPrice();
                this.selsPrice = '';
                this.showPriceList = true;
            },

            //------------------------------------------------
            //获取持有人
            getHolder() {
                let para = {
                    "page": {
                        "current": this.otherCurrent,
                        "size": this.size
                    },
                    "condition":{

                    }
                };
                this.listLoading = true;
                getHolderListPage(para).then((res) => {
                    this.otherTotal = res.data.total;
                    this.holders = res.data.records;
                    this.listLoading = false;
                });
            },
            //点击选择
            choiceHolder() {
                // console.log(this.selsAppoint);
                if (this.selsHolder == '' || this.selsHolder == null) {
                    this.$message({
                        message: '请选择持有人',
                        type: 'info'
                    });
                } else {
                    this.addForm.appuserId = this.selsHolder.id;
                    this.addForm.userName = this.selsHolder.userName;
                    this.showHolderList = false;
                }
            },
            //
            selsHolderChange(val) {
                // console.log(val);
                this.selsHolder = val;
            },
            //点击选择持有人
            addChoiceHolder() {
                this.otherCurrent = 1;
                this.getHolder();
                this.selsHolder = '';
                this.showHolderList = true;
            },


            //------------------------------------------------
            //获取分利模板
            getShare() {
                let para = {
                    "page": {
                        "current": this.otherCurrent,
                        "size": this.size
                    },
                    "condition":{
                        "status": 1
                    }
                };
                this.listLoading = true;
                getShareholdingListPage(para).then((res) => {
                    this.otherTotal = res.data.total;
                    this.shares = res.data.records;
                    this.listLoading = false;
                });
            },
            //点击选择
            choiceShare() {
                // console.log(this.selsAppoint);
                if (this.selsShare == '' || this.selsShare == null) {
                    this.$message({
                        message: '请选择分利模板',
                        type: 'info'
                    });
                } else {
                    this.addForm.shareholdingPercentModelId = this.selsShare.id;
                    this.addForm.shareholdingModelName = this.selsShare.modelName;
                    this.showShareList = false;
                }
            },
            //
            selsShareChange(val) {
                // console.log(val);
                this.selsShare = val;
            },
            //点击选择分利方案
            addChoiceShare() {
                this.otherCurrent = 1;
                this.getShare();
                this.selsShare = '';
                this.showShareList = true;
            },

            //------------------------------------------------



            //类型的增删改查
            addType() {
                this.addTypeForm.addTypeName = '';
                this.addTypeVisible = true;
            },
            updateType() {
                this.editTypeForm.editTypeName = this.$refs.treeBox.getCurrentNode().typeName;
                this.editTypeVisible = true;
            },
            //删除类型

            removeType() {
                this.$confirm('确认删除该类型吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    let para = {ids: []};
                    para.ids.push(this.$refs.treeBox.getCurrentKey());
                    removeTypeName(para).then((res) => {
                        if (res.meta.success) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getTypeTree();
                        } else {
                            this.$message({
                                message: res.meta.message,
                                type: 'error'
                            });
                        }
                    });
                }).catch(() => {

                });
            },
            //编辑类型
            editTypeSubmit: function () {
                this.$refs.editTypeForm.validate((valid) => {
                    // console.log(va)
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = {
                                id: this.condition.typeId,
                                typeName: this.editTypeForm.editTypeName
                            };
                            updateTypeName(para).then((res) => {
                                this.editLoading = false;
                                if (res.meta.success) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.$refs['editTypeForm'].resetFields();
                                    this.editTypeVisible = false;
                                    this.getTypeTree();
                                    // this.getDevices();
                                } else {
                                    this.$message({
                                        message: res.meta.message,
                                        type: 'error'
                                    });
                                }
                            });
                        });
                    }
                });
            },
            //新增类型
            addTypeSubmit: function () {
                this.$refs.addTypeForm.validate((valid) => {
                    // console.log(va)
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = {
                                pId: this.condition.typeId,
                                typeName: this.addTypeForm.addTypeName
                            };
                            addTypeName(para).then((res) => {
                                this.editLoading = false;
                                if (res.meta.success) {
                                    this.$message({
                                        message: '新增成功',
                                        type: 'success'
                                    });
                                    this.$refs['addTypeForm'].resetFields();
                                    this.addTypeVisible = false;
                                    this.getTypeTree();
                                    // this.getDevices();
                                } else {
                                    this.$message({
                                        message: res.meta.message,
                                        type: 'error'
                                    });
                                }
                            });
                        });
                    }
                });
            },

            //获取树形设备类型
            getTypeTree() {
                let para = {};
                getTypeTree(para).then((res) => {
                    // console.log(res);
                    if (res.meta.success) {
                        this.data = res.data;
                        this.optionsType = this.data;
                        //默认选中第一个
                        this.$nextTick(() => {
                            // treeBox 元素的ref   value 绑定的node-key
                            if (this.optionsType.length > 0) {
                                this.$refs.treeBox.setCurrentKey(this.optionsType[0].id);
                                this.condition.typeId = this.optionsType[0].id;
                                console.log("getTypeTree:" + this.condition.typeId);
                                this.editTypeForm.editTypeName = this.optionsType[0].typeName;
                                this.getDevices();
                            } else {
                                this.condition.typeId = -1;
                            }
                        });
                    } else {
                        this.$message({
                            message: res.meta.message,
                            type: 'error'
                        });
                    }
                });
            },

            handleNodeClick(data) {
                // console.log(this.currentNode);
                // console.log(data.id);
                this.condition.typeId = data.id;
                this.getDevices();
            },

            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            handleCurrentChange(val) {
                this.current = val;
                this.getDevices();
            },
            handlCommunityCurrentChange(val) {
                this.otherCurrent = val;
                this.getCommunity();
            },
            handlAppointCurrentChange(val) {
                this.otherCurrent = val;
                this.getAppoint();
            },
            handlPriceCurrentChange(val) {
                this.otherCurrent = val;
                this.getPrice();
            },
            handlHolderCurrentChange(val) {
                this.otherCurrent = val;
                this.getHolder();
            },
            handlShareCurrentChange(val) {
                this.otherCurrent = val;
                this.getShare();
            },

            //获取用户列表
            getDevices() {
                //防止条件isAppuserHold = 0被过滤掉
                let newCondition =  util.filterParams(this.condition);
                if(this.condition.isAppuserHold == -1) {
                    newCondition.isAppuserHold = 0;
                }
                let para = {
                    page: {
                        size: this.size,
                        current: this.current
                    },
                    condition: newCondition
                };
                console.log("getDevices: " + this.condition.typeId);
                this.listLoading = true;
                //NProgress.start();
                getDevices(para).then((res) => {
                    // console.log(res);
                    if (res.meta.success) {
                        this.total = res.data.total;
                        this.devices = res.data.records;
                        this.listLoading = false;
                        //NProgress.done();
                    }
                });
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {ids: []};
                    para.ids.push(row.id);
                    removeDevice(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        if (res.meta.success) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getDevices();
                        } else {
                            this.$message({
                                message: res.meta.message,
                                type: 'error'
                            });
                        }
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                console.log(row);
                this.op = "edit";
                //获取树形分类
                let para = {};
                getTypeTree(para).then((res) => {
                    if (res.meta.success) {
                        this.optionsType = res.data;
                        console.log(this.optionsType);
                    } else {
                        this.$message({
                            message: res.meta.message,
                            type: 'error'
                        });
                    }
                });
                // console.log(row.typeId + " " + row.typeId.length + " " + Array.isArray(row.typeId));
                //typeId设置不正确
                para.id = row.typeId;
                if (Array.isArray(para.id) && para.id != null && para.id.length > 0) {
                    para.id = para.id[para.id.length-1];
                }
                console.log(para.id);
                getTypeTreeRoute(para).then((res) => {
                    if (res.meta.success) {
                        var list = [];
                        var len = res.data.length;
                        for(var i = 1; i < len; i++) {
                            list.push(res.data[len-i-1]);
                            console.log(list);
                        };
                        console.log(list);

                        console.log(len);
                        console.log(row);
                        row.typeId = list;
                        console.log(row);
                        this.handleChange(list);
                        this.addForm = Object.assign({}, row);
                        console.log("addFrom:");
                        console.log(this.addForm);
                        this.addFormVisible = true;
                    } else {
                        this.$message({
                            message: res.meta.message,
                            type: 'error'
                        });
                    }
                });
                // this.editFormVisible = true;
                // this.editForm = Object.assign({}, row);
                //获取分类的路径
            },
            //显示新增界面
            handleAdd: function () {
                this.op = "add";
                this.addFormVisible = true;
                //获取树形分类
                let para = {};
                getTypeTree(para).then((res) => {
                    if (res.meta.success) {
                        this.optionsType = res.data;
                    } else {
                        this.$message({
                            message: res.meta.message,
                            type: 'error'
                        });
                    }
                });
                this.addForm = {
                    isAppuserHold: 0,
                    isCanBook: 0,
                };
            },
            //编辑
            editSubmit: function () {
                // let para = Object.assign({}, this.addForm);
                // if (para.typeId != null && para.typeId.length > 0) {
                //     para.typeId = para.typeId.pop();
                // }
                // if(para.isAppuserHold == 0) {
                //     para.appuserId = null;
                //     para.shareholdingPercentModelId = null;
                // }
                // para = util.filterParams(para);
                // console.log(para);
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        //TODO 提交失败一次this.addForm长度减一
                        // this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            console.log(this.addForm);
                            let para = Object.assign({}, this.addForm);
                            if (Array.isArray(para.typeId) && para.typeId != null && para.typeId.length > 0) {
                                para.typeId = para.typeId.pop();
                            }
                            if(para.isAppuserHold == 0) {
                                para.appuserId = null;
                                para.shareholdingPercentModelId = null;
                            }
                            console.log(para.typeId);
                            this.addLoading = true;
                            //NProgress.start();
                            // let para = Object.assign({}, this.addForm);
                            updateDevice(para).then((res) => {
                                this.addLoading = false;
                                if(res.meta.success) {
                                    //NProgress.done();
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getDevices();
                                } else {
                                    console.log("请求失败:" + res.meta.message);
                                    this.$message({
                                        message: res.meta.message,
                                        type: 'error'
                                    });
                                }
                            });
                        // });
                    }
                });
            },
            //新增
            addSubmit: function () {
                // para = util.filterParams(para);
                // console.log(para);
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        // this.$confirm('确认提交吗？', '提示', {}).then(() => {

                            let para = Object.assign({}, this.addForm);
                            if (Array.isArray(para.typeId) && para.typeId != null && para.typeId.length > 0) {
                                para.typeId = para.typeId.pop();
                            }
                            if(para.isAppuserHold == 0) {
                                para.appuserId = null;
                                para.shareholdingPercentModelId = null;
                            }
                            // console.log(this.addForm);
                            // console.log(para);
                            this.addLoading = true;
                            //NProgress.start();
                            // let para = Object.assign({}, this.addForm);
                            addDevice(para).then((res) => {
                                this.addLoading = false;
                                if(res.meta.success) {
                                    //NProgress.done();
                                    this.$message({
                                        message: '新增成功',
                                        type: 'success'
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.addFormVisible = false;
                                    this.getDevices();
                                } else {
                                    this.$message({
                                        message: res.meta.message,
                                        type: 'error'
                                    });
                                }
                            });
                        // });
                    }
                });
            },
            addCancel: function(){
                this.$refs.addForm.resetFields();
                this.addFormVisible = false;
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                // var ids = this.sels.map(item => item.id).toString();
                var ids = [];
                for (var i = 0; i < this.sels.length; i++) {
                    ids.push(this.sels[i].id);
                }
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {ids: ids};
                    removeDevice(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        if (res.meta.success) {
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.getDevices();
                        } else {
                            this.$message({
                                message: res.meta.message,
                                type: 'error'
                            });
                        }
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getTypeTree();
            // this.getDevices();
        }
    }

</script>

<style scoped>
</style>