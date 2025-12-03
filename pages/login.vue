<template>
  <div class="login-container">
    <h2>🔑 에코그린티엠 직원 로그인</h2>
    <form @submit.prevent="handleLogin">
      <input
        type="text"
        v-model="form.username"
        placeholder="사번 또는 ID"
        required
      />
      <input
        type="password"
        v-model="form.password"
        placeholder="비밀번호"
        required
      />
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? '로그인 중...' : '로그인' }}
      </button>
      <p class="error-message" v-if="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginPage',
  middleware: ['guest-only','auth'],

  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      isLoading: false,
      error: null
    }
  },

  methods: {
    async handleLogin () {
      this.error = null
      this.isLoading = true

      try {
        /*
        const response = await axios.post('http://localhost:3001/v1/member/auth', {
          id: this.form.username,
          password: this.form.password
        })

        // 여기서 토큰/유저정보 저장
        const token = response.data && response.data.data

        if (process.client) {
          localStorage.setItem('user_token', token)
        }

         */

        // 로그인 후 메인(또는 원하는 페이지)으로 이동
        this.$router.push('/')

      } catch (err) {
        console.error('Login Failed:', err)
        this.error = '로그인 실패: 사번 또는 비밀번호를 확인해주세요.'
        // 임시 로그인 처리 넣고 싶으면 여기에서 localStorage/set, 라우터 이동 등 추가
        // if (process.client) localStorage.setItem('user_token', 'temp_token')
        // this.$router.push('/')
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
.login-container { padding: 40px 20px; text-align: center; max-width: 400px; margin: auto; }
input { width: 100%; padding: 12px; margin: 10px 0; border: 1px solid #ccc; border-radius: 8px; box-sizing: border-box; }
button { width: 100%; padding: 15px; margin-top: 20px; background-color: #007bff; color: white; border: none; border-radius: 8px; font-size: 16px; cursor: pointer; }
.error-message { color: red; margin-top: 10px; }
</style>
