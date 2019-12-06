  <template >
    <div id="app"  :style="backgroundDiv" >

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <p style="font-size: 20px;font-weight: bold;" class="title">ASM资产共享管理软件</p>
      <el-form-item prop="account">
        <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm.password" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
  <!--    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>-->
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
        <div style="text-align: center;margin-top: -135px;">
            <span style="color:#cccccc;">Copyright © 2019 天津众颐科技有限公司</span>
        </div>
    </div>
  </template>


<script>
  import { requestLogin } from '../api/login';
  export default {
    data() {
      return {
          backgroundDiv: {

              backgroundImage:'url(' + require('../assets/bgPic.png') + ')',

              backgroundRepeat:'no-repeat',

              backgroundSize:'100% 30%',

              backgroundPosition: 'bottom'

          },

        logining: false,
        ruleForm: {
          account: 'admin',
          password: '123456'
        },
        rules: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ]
        },
        checked: true
      };
    },
    methods: {
      handleSubmit() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.logining = true;
            var param = {
              username: this.ruleForm.account,
              password: this.ruleForm.password
            };
            requestLogin(param).then((res) => {
              console.log(res);
              this.logining = false;
              let code = res.meta.code;
              // console.log(code);
              if (code !== "10000") {
                this.$message({
                  message: "用户名或密码错误",
                  type: 'error'
                });
              } else {
                let token = res.data.token;
                localStorage.setItem('user', token);
                this.$router.push({ path: '/userList' });
              }
            });
          } else {
            return false;
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 150px auto;
    width: 350px;
    padding: 75px 75px 25px 75px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>