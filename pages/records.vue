<template>
  <div class="page-container">
    <h1>📊 월별 근무 기록</h1>

    <div class="controls">
      <select v-model="selectedMonth" @change="fetchRecords">
        <option v-for="month in availableMonths" :key="month" :value="month">
          {{ month }}
        </option>
      </select>
    </div>

    <div v-if="isLoading" class="loading">
      <p>데이터를 불러오는 중입니다...</p>
    </div>

    <div v-else-if="records.length" class="records-summary">
      <h3>{{ selectedMonth }} 근무 요약</h3>
      <!--
      <div class="summary-box">
        <p>총 근무 시간: <strong>{{ totalHours }} 시간</strong></p>
        <p>초과 근무 시간: <strong>{{ overtimeHours }} 시간</strong></p>
      </div>
      -->

      <h3>일별 상세 기록</h3>
      <table class="record-table">
        <thead>
        <tr>
          <th>날짜</th>
          <th>출근</th>
          <th>퇴근</th>
          <th>총 근무</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="record in records" :key="record.date">
          <td>{{ record.date }}</td>
          <td>{{ record.checkin || '-' }}</td>
          <td>{{ record.checkout || '-' }}</td>
          <td>{{ record.duration || '0' }}시간</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else>
      <p class="no-data">선택하신 월의 근무 기록이 없습니다.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

// 더미 데이터 (백엔드 연결 전 테스트용)
const dummyRecords = [
  { date: '2025-11-01', checkin: '09:00', checkout: '18:00', duration: '8h' },
  { date: '2025-11-02', checkin: '09:02', checkout: '18:05', duration: '8h 3m' },
  { date: '2025-11-03', checkin: null, checkout: null, duration: null }, // 휴무
  { date: '2025-10-28', checkin: '08:50', checkout: '17:50', duration: '8h' }
]

export default {
  // Nuxt2 페이지 미들웨어
  middleware: 'auth',

  data () {
    return {
      selectedMonth: '',
      availableMonths: [], // 'YYYY-MM'
      records: [],
      isLoading: false
    }
  },

  computed: {
    totalHours () {
      // 실제 로직 구현 시 duration 파싱해서 합산
      const totalMinutes = this.records.reduce((sum, r) => {
        // 예시 로직 (주석 처리된 부분 참고해서 나중에 구현)
        /*
        if (r.duration) {
          const [h, m] = r.duration.split(/[h,m]/).filter(Boolean).map(Number)
          return sum + (h * 60) + m
        }
        */
        return sum
      }, 0)

      return (totalMinutes / 60).toFixed(1)
    },

    overtimeHours () {
      const standardHours = 160
      const over = this.totalHours - standardHours
      return Math.max(0, over).toFixed(1)
    }
  },

  mounted () {
    this.generateMonthOptions()
    this.fetchRecords()
    this.getWorkFl()
  },

  methods: {
    generateMonthOptions () {
      const date = new Date()
      const months = []

      for (let i = 0; i < 6; i++) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        months.push(`${year}-${month}`)
        date.setMonth(date.getMonth() - 1)
      }

      this.availableMonths = months
      this.selectedMonth = this.availableMonths[0]
    },

    async fetchRecords () {
      this.isLoading = true
      this.records = []

      try {
        const mIdx = 1
        // 실제 API
        const response = await axios.get(`http://localhost:3001/v1/work/sheet/${mIdx}?startDt=${this.selectedMonth}&endDt=${this.selectedMonth}`)
        this.records = response.data.data || []
        console.log(this.records, 'work sheet data')

        // 테스트용 딜레이 + 더미데이터 필터 사용하고 싶으면 아래 주석 해제
        /*
        await new Promise(resolve => setTimeout(resolve, 500))
        this.records = dummyRecords.filter(r => r.date.startsWith(this.selectedMonth))
        */
      } catch (error) {
        console.error('근무 기록 불러오기 실패:', error)
        alert('근무 기록을 불러오는 데 실패했습니다.')
      } finally {
        this.isLoading = false
      }
    },

    async getWorkFl () {
      try {
        const mIdx = 1
        const sIdx = 1
        const response = await axios.get(`http://localhost:3001/v1/work/${mIdx}?sIdx=${sIdx}`)
        console.log(response.data.data, '현재 근무 플래그')
      } catch (e) {
        console.error('work 플래그 조회 실패:', e)
      }
    }
  }
}
</script>

<style scoped>
.page-container { padding: 20px; }
.controls { margin-bottom: 20px; text-align: right; }
select {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
}
.records-summary {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: #eef;
}
.summary-box {
  display: flex;
  justify-content: space-around;
  gap: 10px;
  margin-bottom: 15px;
}
.record-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}
.record-table th,
.record-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}
.record-table th {
  background-color: #f0f0f0;
}
.loading,
.no-data {
  text-align: center;
  color: #777;
  margin-top: 30px;
}
</style>
