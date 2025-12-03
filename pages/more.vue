<template>
  <div class="calendar">
    <!-- 요일 헤더 -->
    <div class="grid grid-cols-7 text-center font-semibold">
      <div v-for="d in weekLabels" :key="d">{{ d }}</div>
    </div>

    <!-- 날짜 셀 -->
    <div class="grid grid-cols-7 mt-2 text-sm">
      <div v-for="(cell, i) in cells" :key="i"
           class="border p-2 h-24"
           :class="{ 'opacity-40': !cell.inMonth }">
        <div class="flex justify-between">
          <span class="font-bold">{{ cell.date.getDate() }}</span>
        </div>
        <div v-if="dayMap[cell.iso]" class="mt-1 text-green-700">
          <div>출 {{ formatTime(dayMap[cell.iso].firstIn) }}</div>
          <div>퇴 {{ formatTime(dayMap[cell.iso].lastOut) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    month: String,  // 예: '2025-11'
    data: Array     // [{ workDate, firstIn, lastOut }]
  },
  data() {
    return {
      weekLabels: ['일','월','화','수','목','금','토']
    }
  },
  computed: {
    // API 데이터를 날짜별 맵으로 변환
    dayMap() {
      const m = {}
      for (const d of this.data) m[d.workDate] = d
      return m
    },
    // 달력 셀 생성
    cells() {
      const [year, month] = this.month.split('-').map(Number)
      const firstDay = new Date(year, month - 1, 1)      // 1일
      const startWeek = firstDay.getDay()                // 0=일
      const daysInMonth = new Date(year, month, 0).getDate() // 말일 구하기

      // 달력 첫 칸(이전달 일요일부터 시작)
      const firstCell = new Date(year, month - 1, 1 - startWeek)
      const cells = []

      for (let i = 0; i < 42; i++) {
        const date = new Date(firstCell)
        date.setDate(firstCell.getDate() + i)

        const iso = date.toISOString().split('T')[0]  // YYYY-MM-DD
        const inMonth = (date.getMonth() + 1) === month

        cells.push({ date, iso, inMonth })
      }
      return cells
    }
  },
  methods: {
    formatTime(ts) {
      if (!ts) return ''
      const t = new Date(ts)
      const hh = t.getHours().toString().padStart(2, '0')
      const mm = t.getMinutes().toString().padStart(2, '0')
      return `${hh}:${mm}`
    }
  }
}
</script>
