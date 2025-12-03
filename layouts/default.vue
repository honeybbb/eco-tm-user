<template>
  <div id="app-layout">
    <v-main class="main">
      <!-- Nuxt2 레이아웃에서는 보통 <nuxt/>만 사용 -->
      <nuxt />
    </v-main>

    <!-- 로그인 상태일 때만 하단바 표시 -->
    <nav v-if="isLoggedIn" class="bottom-nav">
      <nuxt-link to="/" class="nav-item">
        <span class="icon">⏰</span>
        <span class="label">출퇴근</span>
      </nuxt-link>
      <nuxt-link to="/profile" class="nav-item">
        <span class="icon">👤</span>
        <span class="label">내정보</span>
      </nuxt-link>
      <nuxt-link to="/records" class="nav-item">
        <span class="icon">📊</span>
        <span class="label">근무기록</span>
      </nuxt-link>
      <nuxt-link to="/notice" class="nav-item">
        <span class="icon">📢</span>
        <span class="label">공지</span>
      </nuxt-link>
      <div @click="logout" class="nav-item logout-item">
        <span class="icon">🚪</span>
        <span class="label">로그아웃</span>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'AppLayout',

  // data로 들고 있지 말고, computed로 매번 localStorage 읽게 만들기
  computed: {
    isLoggedIn() {
      if (process.client) {
        return !!localStorage.getItem('user_token');
      }
      return false;
    },
  },

  methods: {
    logout() {
      if (process.client) {
        localStorage.removeItem('user_token');
      }
      // 로그아웃 후 로그인 페이지로 이동
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
#app-layout {
  min-height: 100vh;
  background: #f8f8f8;
}

/* v-main에 class="main" 줬으니까 여기서 패딩 적용 */
.main {
  padding: 10px;
  max-width: 600px;
  margin: 0 auto;
  padding-bottom: 70px; /* 하단 네비게이션 높이만큼 패딩 */
}

/* --- 하단 네비게이션 바 스타일 --- */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;

  background-color: #ffffff;
  color: #333;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  height: 60px;
  max-width: 600px;
  margin: 0 auto;
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: #666;
  padding: 5px;
  flex-grow: 1;
  transition: color 0.2s;
}

.nav-item:hover {
  color: #007bff;
}

/* 활성화된 링크 */
.nav-item.router-link-active {
  color: #007bff;
  font-weight: bold;
}

.icon {
  font-size: 18px;
}

.label {
  font-size: 10px;
  margin-top: 2px;
}

.logout-item {
  cursor: pointer;
}

.logout-item:hover {
  color: #ff6347;
}
</style>
