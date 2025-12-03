<template>
  <!-- 하단 네비 -->
  <v-bottom-navigation
    v-if="$route.path !== '/login'"
    grow
    height="60"
    fixed
    app
    color="primary"
    class="btm-nav"
  >
    <!--v-btn @click="$router.push('/home')" text>
      <span>홈</span>
      <v-icon>mdi-home-outline</v-icon>
    </v-btn-->
    <v-btn text class="active" to="/">
      <span>근태</span>
      <v-icon>mdi-calendar-check</v-icon>
    </v-btn>
    <v-btn text>
      <span>근로계약서</span>
      <v-icon>mdi-cash-multiple</v-icon>
    </v-btn>
    <v-btn text @click="$router.push('/more')">
      <span>더보기</span>
      <v-icon>mdi-dots-horizontal</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<style scoped>
.btm-nav {
  border-top: 1px solid #eef2f7;
  background: #ffffff !important;
}
.btm-nav .v-btn.active {
  color: #1e40af !important;
}
</style>
