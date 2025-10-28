<template>
  <v-container fluid class="py-6">
    <!-- 상단 바 -->
    <v-card class="mb-4 pa-3 d-flex align-center rounded-xl">
      <v-btn icon @click="$router.back()"><v-icon>mdi-arrow-left</v-icon></v-btn>
      <div class="title font-weight-bold ml-2">급여 명세서</div>
      <v-spacer></v-spacer>

      <!-- 월 선택 -->
      <v-menu v-model="monthMenu" offset-y max-width="320px" :close-on-content-click="false">
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-bind="attrs" v-on="on"
            dense outlined readonly hide-details class="mr-2"
            prepend-inner-icon="mdi-calendar-month"
            label="급여월"
            :value="displayMonth"
            style="max-width: 160px"
          />
        </template>
        <v-date-picker v-model="monthModel" type="month" @change="onPickMonth" scrollable />
      </v-menu>

      <v-btn small class="mr-2" @click="printSlip" outlined>
        <v-icon left>mdi-printer</v-icon> 인쇄
      </v-btn>
      <v-btn small color="primary" @click="downloadCsv" depressed>
        <v-icon left>mdi-download</v-icon> 다운로드
      </v-btn>
    </v-card>

    <!-- 본문 -->
    <v-card id="slip" class="pa-6 rounded-xl">
      <v-skeleton-loader :loading="loading" type="card-heading, table" transition="fade-transition">
        <v-row dense>
          <!-- 직원정보 -->
          <v-col cols="12" md="6">
            <v-card outlined>
              <v-card-title class="py-3">
                <v-avatar size="40" class="mr-3">
                  <img :src="employee.avatar || 'https://i.pravatar.cc/80?img=12'">
                </v-avatar>
                <div>
                  <div class="subtitle-1 font-weight-bold">{{ employee.name }}</div>
                  <div class="caption grey--text">
                    사번 {{ employee.empNo }} · {{ employee.position }}
                  </div>
                </div>
                <v-spacer></v-spacer>
                <v-chip x-small label class="text-uppercase">{{ periodText }}</v-chip>
              </v-card-title>
              <v-divider/>
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>입사일</v-list-item-content>
                  <v-list-item-action-text>{{ employee.joinDate }}</v-list-item-action-text>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>지급일</v-list-item-content>
                  <v-list-item-action-text>{{ payslip.payDate }}</v-list-item-action-text>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>지급계좌</v-list-item-content>
                  <v-list-item-action-text>{{ employee.bank }} · {{ employee.account }}</v-list-item-action-text>
                </v-list-item>
              </v-list>
            </v-card>
          </v-col>

          <!-- 합계 -->
          <v-col cols="12" md="6">
            <v-card outlined>
              <v-card-text>
                <v-row>
                  <v-col cols="6" class="text-center">
                    <div class="caption grey--text">지급 총액</div>
                    <div class="headline font-weight-bold">{{ cur(totalEarnings) }}</div>
                  </v-col>
                  <v-col cols="6" class="text-center">
                    <div class="caption grey--text">공제 총액</div>
                    <div class="headline font-weight-bold">{{ cur(totalDeductions) }}</div>
                  </v-col>
                </v-row>
                <v-divider class="my-3"/>
                <div class="text-center">
                  <div class="caption grey--text">실지급액(Net)</div>
                  <div class="display-1 font-weight-bold primary--text">{{ cur(netPay) }}</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row dense class="mt-4">
          <!-- 지급 항목 -->
          <v-col cols="12" md="6">
            <v-card outlined>
              <v-card-title class="py-2">지급(Earnings)</v-card-title>
              <v-data-table
                :items="payslip.earnings" :headers="earnHeaders"
                dense disable-pagination hide-default-footer
              >
                <template v-slot:item.amount="{ item }">{{ cur(item.amount) }}</template>
                <template v-slot:body.append>
                  <tr>
                    <td class="text-right font-weight-bold" colspan="1">합계</td>
                    <td class="text-right font-weight-bold">{{ cur(totalEarnings) }}</td>
                  </tr>
                </template>
              </v-data-table>
            </v-card>
          </v-col>

          <!-- 공제 항목 -->
          <v-col cols="12" md="6">
            <v-card outlined>
              <v-card-title class="py-2">공제(Deductions)</v-card-title>
              <v-data-table
                :items="payslip.deductions" :headers="deductHeaders"
                dense disable-pagination hide-default-footer
              >
                <template v-slot:item.amount="{ item }">{{ cur(item.amount) }}</template>
                <template v-slot:body.append>
                  <tr>
                    <td class="text-right font-weight-bold" colspan="1">합계</td>
                    <td class="text-right font-weight-bold">{{ cur(totalDeductions) }}</td>
                  </tr>
                </template>
              </v-data-table>
            </v-card>
          </v-col>
        </v-row>

        <!-- 비고/메모 -->
        <v-alert dense outlined type="info" class="mt-4" v-if="payslip.note">
          {{ payslip.note }}
        </v-alert>
      </v-skeleton-loader>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'Payment',
  data: () => ({
    loading: false,
    monthMenu: false,
    // YYYY-MM 선택을 위해 date-picker 바인딩 값
    monthModel: new Date(),
    employee: {
      name: '홍길동',
      empNo: 'EGT-0012',
      position: '반장',
      joinDate: '2021-03-01',
      bank: '국민',
      account: '123-456-789012',
      avatar: ''
    },
    payslip: {
      month: '',        // '2024-12'
      payDate: '',      // '2024-12-25'
      earnings: [],     // [{ name:'기본급', amount: 2000000 }, ...]
      deductions: [],   // [{ name:'소득세', amount: 120000 }, ...]
      note: '지각 1회 공제 반영.'
    },
    earnHeaders: [
      { text: '항목', value: 'name' },
      { text: '금액', value: 'amount', align: 'end' },
    ],
    deductHeaders: [
      { text: '항목', value: 'name' },
      { text: '금액', value: 'amount', align: 'end' },
    ],
  }),
  computed: {
    displayMonth () {
      const d = this.monthModel instanceof Date ? this.monthModel : new Date(this.monthModel)
      const y = d.getFullYear()
      const m = ('0' + (d.getMonth() + 1)).slice(-2)
      return `${y}-${m}`
    },
    periodText () {
      return this.payslip.month ? `${this.payslip.month} 급여` : ''
    },
    totalEarnings () {
      return (this.payslip.earnings || []).reduce((s, i) => s + (i.amount || 0), 0)
    },
    totalDeductions () {
      return (this.payslip.deductions || []).reduce((s, i) => s + (i.amount || 0), 0)
    },
    netPay () {
      return this.totalEarnings - this.totalDeductions
    },
  },
  created () {
    this.fetchSlip()
  },
  methods: {
    cur (n) {
      if (n == null) return '-'
      return n.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 })
    },
    onPickMonth () {
      this.monthMenu = false
      this.fetchSlip()
    },
    async fetchSlip () {
      try {
        this.loading = true
        const y = this.monthModel.getFullYear()
        const m = ('0' + (this.monthModel.getMonth() + 1)).slice(-2)
        const month = `${y}-${m}`

        // 실제 API 호출로 교체
        // const { data } = await this.$axios.get(`/v1/me/payslip?month=${month}`)
        // this.employee = data.employee
        // this.payslip  = data.payslip

        // --- 데모 데이터 ---
        this.payslip = {
          month,
          payDate: `${month}-25`,
          earnings: [
            { name: '기본급', amount: 2_100_000 },
            { name: '연장수당', amount: 240_000 },
            { name: '야간수당', amount: 120_000 },
            { name: '식대', amount: 100_000 },
          ],
          deductions: [
            { name: '국민연금', amount: 94_500 },
            { name: '건강보험', amount: 73_000 },
            { name: '고용보험', amount: 19_000 },
            { name: '소득세', amount: 65_000 },
          ],
          note: '결근 없음 / 연장 12h, 야간 6h 반영.'
        }
      } finally {
        this.loading = false
      }
    },
    printSlip () {
      // 인쇄 시 명세서 카드만 깔끔하게 출력
      window.print()
    },
    downloadCsv () {
      const rows = [
        ['구분', '항목', '금액'],
        ...this.payslip.earnings.map(e => ['지급', e.name, e.amount]),
        ...this.payslip.deductions.map(d => ['공제', d.name, d.amount]),
        ['합계(지급)', '', this.totalEarnings],
        ['합계(공제)', '', this.totalDeductions],
        ['실지급액', '', this.netPay],
      ]
      const csv = rows.map(r => r.join(',')).join('\n')
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `payslip_${this.payslip.month}.csv`
      a.click()
      URL.revokeObjectURL(url)
    },
  }
}
</script>

<style scoped>
/* 인쇄 최적화: 명세서 카드만 출력 */
@media print {
  body * { visibility: hidden; }
  #slip, #slip * { visibility: visible; }
  #slip { position: absolute; left: 0; top: 0; width: 100%; }
}
</style>
