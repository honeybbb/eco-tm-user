<!-- src/pages/payment/List.vue (예: /payment) -->
<template>
  <v-container fluid class="pa-0 mobile-wrap">
    <!-- 헤더/필터 -->
    <v-card class="mx-4 mt-4 rounded-xl elevation-1">
      <v-card-title class="py-4">
        <div class="d-flex align-center">
          <!--v-icon left color="indigo">mdi-cash-multiple</v-icon-->
          <span class="headline font-weight-bold">급여명세서</span>
        </div>
        <div class="d-flex align-center" style="gap:12px;">
          <!-- 연도 선택 -->
          <select v-model="year" style="max-width:120px">
            <option value="">전체</option>
            <option v-for="date in years">{{date}}</option>
          </select>
          <!--v-select
            v-model="year"
            :items="years"
            dense outlined hide-details label="연도"
            style="max-width:120px"
            @change="reload"
          /-->
          <!-- 월 선택 -->
          <select v-model="month" style="max-width:110px">
            <option v-for="date in months">{{date.text}}</option>
          </select>
          <!--v-select
            v-model="month"
            :items="months"
            dense outlined hide-details label="월"
            style="max-width:110px"
            @change="reload"
          /-->
          <!-- 상태 -->
          <!--v-select
            v-model="status"
            :items="statusItems"
            dense outlined hide-details label="상태"
            style="max-width:140px"
            @change="reload"
          /-->
          <!-- 검색 (메모/비고 등) -->
          <!--v-text-field
            v-model="q"
            dense outlined hide-details clearable
            prepend-inner-icon="mdi-magnify" placeholder="메모/비고 검색"
            style="max-width:220px"
            @keyup.enter="reload"
          />
          <v-btn color="primary" depressed @click="reload">검색</v-btn-->
        </div>
      </v-card-title>

      <!-- 데이터 테이블 -->
      <v-data-table
        :headers="headers"
        :items="rows"
        :loading="loading"
        :page.sync="page"
        :items-per-page.sync="itemsPerPage"
        :server-items-length="total"
        :footer-props="{ 'items-per-page-options': [10,20,50] }"
        class="elevation-0"
      >
        <template v-slot:item.month="{ item }">
          {{ item.year }}-{{ pad2(item.month) }}
        </template>

        <template v-slot:item.base="{ item }">
          {{ item.base | won }}
        </template>
        <template v-slot:item.allowance="{ item }">
          {{ item.allowance | won }}
        </template>
        <template v-slot:item.deduction="{ item }">
          {{ item.deduction | won }}
        </template>
        <template v-slot:item.net="{ item }">
          <v-chip small color="green lighten-5" text-color="green darken-2">
            {{ item.net | won }}
          </v-chip>
        </template>

        <template v-slot:item.status="{ item }">
          <v-chip small :color="statusColor(item.status)" text-color="white">
            {{ statusLabel(item.status) }}
          </v-chip>
        </template>

        <template v-slot:item.actions="{ item }">
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon small v-bind="attrs" v-on="on" @click="openDetail(item)">
                <v-icon small>mdi-eye</v-icon>
              </v-btn>
            </template>
            <span>상세</span>
          </v-tooltip>

          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon small v-bind="attrs" v-on="on" @click="download(item)">
                <v-icon small>mdi-download</v-icon>
              </v-btn>
            </template>
            <span>다운로드</span>
          </v-tooltip>
        </template>

        <!-- 테이블 하단 합계 -->
        <template v-slot:footer.prepend>
          <div class="pa-3 grey--text text--darken-1" v-if="summary">
            <strong>합계(표시중)</strong> :
            기본 {{ summary.base | won }},
            수당 {{ summary.allowance | won }},
            공제 {{ summary.deduction | won }},
            <span class="green--text text--darken-2">실지급 {{ summary.net | won }}</span>
          </div>
        </template>

        <template v-slot:no-data>
          <v-container class="text-center py-8">
            <v-icon large color="grey">mdi-file-search-outline</v-icon>
            <div class="caption grey--text mt-2">데이터가 없습니다.</div>
          </v-container>
        </template>
      </v-data-table>
    </v-card>

    <!-- 상세 다이얼로그 -->
    <v-dialog v-model="detailOpen" max-width="720px">
      <v-card>
        <v-card-title class="justify-space-between">
          <div class="d-flex align-center">
            <v-icon left color="indigo">mdi-file-document</v-icon>
            <span class="subtitle-1 font-weight-bold">{{ detailTitle }}</span>
          </div>
          <v-btn icon @click="detailOpen=false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>기본급</v-list-item-title>
                    <v-list-item-subtitle>{{ detail?.base | won }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>수당</v-list-item-title>
                    <v-list-item-subtitle>{{ detail?.allowance | won }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>공제</v-list-item-title>
                    <v-list-item-subtitle>{{ detail?.deduction | won }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" sm="6">
              <v-list dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>실지급액</v-list-item-title>
                    <v-list-item-subtitle class="green--text text--darken-2">
                      {{ detail?.net | won }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>지급일</v-list-item-title>
                    <v-list-item-subtitle>{{ detail?.payDate }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>상태</v-list-item-title>
                    <v-list-item-subtitle>{{ statusLabel(detail?.status) }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>

          <v-divider class="my-2"></v-divider>
          <div class="caption grey--text">비고</div>
          <div class="body-2">{{ detail?.memo || '-' }}</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn text @click="detailOpen=false">닫기</v-btn>
          <v-btn color="primary" depressed @click="download(detail)">PDF 다운로드</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: 'PayslipList',
  data: () => ({
    // 필터
    year: new Date().getFullYear(),
    month: null, // null이면 '전체'
    status: null,
    q: '',
    years: Array.from({length: 6}, (_,i) => new Date().getFullYear() - i),
    months: [{text:'전체', value:null}].concat(Array.from({length:12},(_,i)=>({text:`${i+1}월`, value:i+1}))),
    statusItems: [
      { text: '전체', value: null },
      { text: '확정', value: 'CONFIRMED' },
      { text: '예정', value: 'PENDING' },
      { text: '보류', value: 'ON_HOLD' },
    ],

    // 테이블
    headers: [
      { text: '월', value: 'month', width: 100 },
      { text: '지급일', value: 'payDate', width: 120 },
      { text: '기본급', value: 'base', align: 'right' },
      { text: '수당', value: 'allowance', align: 'right' },
      { text: '공제', value: 'deduction', align: 'right' },
      { text: '실지급액', value: 'net', align: 'right' },
      { text: '상태', value: 'status', width: 110 },
      { text: '액션', value: 'actions', sortable: false, width: 120 },
    ],
    rows: [],
    total: 0,
    page: 1,
    itemsPerPage: 10,
    loading: false,

    // 상세
    detailOpen: false,
    detail: null,
  }),

  computed: {
    summary () {
      if (!this.rows.length) return null
      const sum = (k) => this.rows.reduce((a,c)=>a+(Number(c[k])||0),0)
      return {
        base: sum('base'),
        allowance: sum('allowance'),
        deduction: sum('deduction'),
        net: sum('net'),
      }
    },
    detailTitle () {
      if (!this.detail) return ''
      return `급여명세서 ${this.detail.year}-${this.pad2(this.detail.month)}`
    },
  },

  filters: {
    won(v){ return new Intl.NumberFormat('ko-KR').format(Number(v||0)) + '원' }
  },

  created () {
    this.reload()
  },

  methods: {
    pad2(n){ return String(n).padStart(2, '0') },

    statusLabel(s){
      if (s === 'CONFIRMED') return '확정'
      if (s === 'PENDING') return '예정'
      if (s === 'ON_HOLD') return '보류'
      return '-'
    },
    statusColor(s){
      if (s === 'CONFIRMED') return 'green'
      if (s === 'PENDING') return 'indigo'
      if (s === 'ON_HOLD') return 'orange darken-2'
      return 'grey'
    },

    async reload(){
      // ✅ 실제에선 서버로 질의: /api/payslips?year=&month=&status=&q=&page=&size=
      this.loading = true
      try {
        // 데모 데이터 생성
        const y = this.year
        const all = Array.from({length:12}, (_,i)=>i+1).map(m => ({
          id: `${y}-${m}`,
          year: y,
          month: m,
          payDate: `${y}-${this.pad2(m)}-25`,
          base: 2000000,
          allowance: (m%3===0)?350000:300000,
          deduction:  (m%4===0)?380000:350000,
          net: 2000000 + ((m%3===0)?350000:300000) - ((m%4===0)?380000:350000),
          status: (m%5===0)?'ON_HOLD': (m<=new Date().getMonth()+1 ? 'CONFIRMED' : 'PENDING'),
          memo: (m%2===0)?'특근수당 포함':'-'
        }))

        // 필터
        let filtered = all
        if (this.month) filtered = filtered.filter(x=>x.month===this.month)
        if (this.status) filtered = filtered.filter(x=>x.status===this.status)
        if (this.q) {
          const q = this.q.toLowerCase()
          filtered = filtered.filter(x => (x.memo||'').toLowerCase().includes(q))
        }

        // 페이징
        this.total = filtered.length
        const start = (this.page-1) * this.itemsPerPage
        const end = start + this.itemsPerPage
        this.rows = filtered.slice(start, end)
      } finally {
        this.loading = false
      }
    },

    openDetail(item){
      this.detail = { ...item }
      this.detailOpen = true
    },
    download(item){
      // 실제 구현: window.open(`/api/payslips/${item.id}/pdf`)
      this.$emit('download', item)
    },
  },

  watch: {
    page(){ this.reload() },
    itemsPerPage(){ this.page = 1; this.reload() }
  }
}
</script>
