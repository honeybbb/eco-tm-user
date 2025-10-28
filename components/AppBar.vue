<template>
  <!-- 상단 앱바(로고/아이콘) -->
  <v-container class="pa-0 mobile-wrap" fluid>
  <v-app-bar dense flat color="white" class="appbar">
    <div class="d-flex align-center">
      <v-img src="/logo.svg" contain max-width="72" class="mr-2"></v-img>
      <span class="title font-weight-bold">에코그린TM</span>
    </div>
    <v-spacer />
    <v-btn icon to="/notice"><v-icon>mdi-bell-outline</v-icon></v-btn>
    <v-btn icon to="/mypage"><v-icon>mdi-account-circle-outline</v-icon></v-btn>
  </v-app-bar>
  </v-container>
</template>
<script setup>

</script>


<style scoped>
.mobile-wrap {
  max-width: 480px;  /* 모바일 프레임 느낌 */
  margin: 0 auto;
  padding-bottom: 68px; /* bottom nav 공간 */
}
.appbar { border-bottom: 1px solid #eef2f7; }
</style>
