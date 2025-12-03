<template>
  <div class="page-container">
    <h1>📢 공지 및 알림</h1>

    <div v-if="isLoading" class="loading">
      <p>공지사항을 불러오는 중입니다...</p>
    </div>

    <div v-else-if="notices.length" class="notice-list">
      <div
        v-for="notice in notices"
        :key="notice.id"
        class="notice-item"
        @click="selectNotice(notice)"
        :class="{ 'is-read': notice.read }"
      >
        <div class="notice-header">
          <span :class="['tag', notice.important ? 'tag-important' : 'tag-normal']">
            {{ notice.important ? '긴급' : '일반' }}
          </span>
          <span class="date">{{ notice.date }}</span>
        </div>
        <h3 class="title">{{ notice.title }}</h3>
        <p class="preview">{{ notice.content.substring(0, 50) }}...</p>
      </div>
    </div>

    <div v-else>
      <p class="no-data">현재 등록된 공지사항이 없습니다.</p>
    </div>

    <div v-if="selectedNotice" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">×</button>
        <h2>{{ selectedNotice.title }}</h2>
        <p class="modal-date">{{ selectedNotice.date }}</p>
        <div class="modal-body">
          <p>{{ selectedNotice.content }}</p>
          <p v-if="selectedNotice.attachment" class="attachment">
            첨부파일:
            <a :href="selectedNotice.attachment" target="_blank">다운로드</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

// 더미 데이터는 컴포넌트 밖에 선언
const dummyNotices = [
  {
    id: 1,
    title: '화재 대피 훈련 일정 공지',
    content:
      '다음 주 수요일 오전 10시에 전 직원을 대상으로 화재 대피 훈련을 실시합니다. 전원 필수 참여 바랍니다.',
    date: '2025-11-25',
    important: true,
    read: false,
    attachment: '/files/drill.pdf'
  },
  {
    id: 2,
    title: '연말 급여 지급일 안내',
    content:
      '12월 급여는 연말 정산 준비로 인해 20일이 아닌 24일에 지급될 예정입니다.',
    date: '2025-11-20',
    important: false,
    read: true,
    attachment: null
  },
  {
    id: 3,
    title: '새로운 보안 시스템 도입 안내',
    content:
      '1층 출입 통제가 지문 인식으로 변경됩니다. 관련 교육 일정은 별도 통보 예정입니다.',
    date: '2025-11-15',
    important: true,
    read: false,
    attachment: null
  }
]

export default {
  // Nuxt2에서 페이지 미들웨어 지정
  middleware: 'auth',

  data () {
    return {
      notices: [],
      isLoading: false,
      selectedNotice: null
    }
  },

  mounted () {
    this.fetchNotices()
  },

  methods: {
    async fetchNotices () {
      this.isLoading = true
      try {
        // 실제 API 호출 예시
        // const token = process.client ? localStorage.getItem('user_token') : null
        // const response = await axios.get('http://localhost:3001/v1/notices', {
        //   headers: { Authorization: `Bearer ${token}` }
        // })
        // this.notices = response.data.notices

        // 데모용 더미 데이터
        await new Promise(resolve => setTimeout(resolve, 500))
        this.notices = dummyNotices
      } catch (error) {
        console.error('공지사항 불러오기 실패:', error)
      } finally {
        this.isLoading = false
      }
    },

    selectNotice (notice) {
      notice.read = true
      this.selectedNotice = notice
    },

    closeModal () {
      this.selectedNotice = null
    }
  }
}
</script>

<style scoped>
.page-container { padding: 20px; }
.notice-list { margin-top: 20px; }
.notice-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}
.notice-item:hover { background-color: #f9f9f9; }
.notice-item.is-read { opacity: 0.7; }
.notice-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  margin-bottom: 5px;
}
.tag { padding: 3px 8px; border-radius: 10px; font-weight: bold; color: white; }
.tag-important { background-color: #f44336; }
.tag-normal { background-color: #4CAF50; }
.title { margin: 5px 0; font-size: 16px; }
.preview { font-size: 14px; color: #666; }
.date { color: #999; }
.no-data { text-align: center; color: #777; margin-top: 30px; }

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 25px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
.modal-date { font-size: 12px; color: #999; margin-bottom: 15px; }
.modal-body { border-top: 1px solid #eee; padding-top: 15px; }
.attachment { margin-top: 15px; font-weight: bold; }
</style>
