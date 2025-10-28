<!-- src/views/Login.vue -->
<template>
  <v-container fluid class="login-wrap fill-height">
    <v-row no-gutters align="center" justify="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="elevation-2">
          <v-card-title class="justify-center">
            <div class="text-center">
              <div class="mb-1 font-weight-bold">에코그린TM</div>
              <div class="subtitle-2 grey--text">사내 ERP 로그인</div>
            </div>
          </v-card-title>

          <v-card-text>
            <v-alert
              v-if="errorMsg"
              dense
              type="error"
              text
              class="mb-4"
            >
              {{ errorMsg }}
            </v-alert>

            <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
              <v-text-field
                v-model.trim="form.id"
                label="아이디 또는 사번"
                prepend-inner-icon="mdi-account"
                outlined
                dense
                :rules="[rules.required]"
                autocomplete="username"
              />

              <v-text-field
                v-model="form.password"
                :type="showPw ? 'text' : 'password'"
                label="비밀번호"
                prepend-inner-icon="mdi-lock"
                :append-icon="showPw ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="showPw = !showPw"
                outlined
                dense
                :rules="[rules.required]"
                autocomplete="current-password"
              />

              <div class="d-flex align-center justify-space-between">
                <v-checkbox
                  v-model="form.remember"
                  hide-details
                  dense
                  label="자동 로그인"
                />
                <v-btn text small color="primary" @click="$router.push('/forgot')">
                  비밀번호 찾기
                </v-btn>
              </div>

              <v-btn
                color="primary"
                large
                depressed
                block
                class="mt-2"
                :loading="loading"
                :disabled="!valid || loading"
                @click="onSubmit"
              >
                로그인
              </v-btn>

              <!-- 선택: 회원가입 버튼이 필요하면 노출 -->
              <!--
              <v-btn
                text
                block
                class="mt-2"
                @click="$router.push('/signup')"
              >
                회원가입
              </v-btn>
              -->
            </v-form>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="justify-center py-4">
            <span class="caption grey--text">
              © {{ new Date().getFullYear() }} EcoGreen TM
            </span>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'Login',
  data () {
    return {
      valid: false,
      loading: false,
      errorMsg: '',
      showPw: false,
      form: {
        id: '',
        password: '',
        remember: false
      },
      rules: {
        required: v => !!v || '필수 입력입니다.'
      }
    }
  },
  created () {
    // 자동 로그인(로컬 스토리지 기억) 처리
    const saved = false;
    //const saved = localStorage.getItem('egtm_login_id')
    if (saved) {
      this.form.id = saved
      this.form.remember = true
    }
  },
  methods: {
    async onSubmit () {
      this.errorMsg = ''
      if (!this.$refs.form.validate()) return
      this.loading = true
      return;
      try {
        // 실제 API 엔드포인트로 교체하세요.
        // 예: /api/auth/login (Node/Spring 등 백엔드 공용)
        const { data } = await axios.post('/api/auth/login', {
          id: this.form.id,
          password: this.form.password
        })

        // 토큰/유저정보 저장 예시
        // data = { token, user: { name, role ... } }
        localStorage.setItem('egtm_token', data.token)
        localStorage.setItem('egtm_user', JSON.stringify(data.user || {}))

        // 아이디 기억(자동 로그인 체크 시)
        if (this.form.remember) {
          localStorage.setItem('egtm_login_id', this.form.id)
        } else {
          localStorage.removeItem('egtm_login_id')
        }

        // 로그인 후 이동
        this.$router.replace({ path: '/' })
      } catch (err) {
        this.errorMsg = (err.response && err.response.data && err.response.data.message) ||
          '로그인에 실패했습니다. 아이디/비밀번호를 확인하세요.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-wrap {
  //background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
  min-height: 100vh;
}
.v-card {
  border-radius: 14px;
}
</style>
