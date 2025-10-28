<!-- src/views/NoticeBoard.vue -->
<template>
  <v-container fluid class="pa-0 mobile-wrap">
    <v-card class="mx-4 mt-4 rounded-xl elevation-1 summary-card">
          <!-- 헤더 -->
          <v-card-title class="py-4">
            <div>
              <div class="title font-weight-bold">공지사항</div>
              <div class="caption grey--text">중요/일반 공지, 카테고리 및 기간으로 빠르게 탐색</div>
            </div>
          </v-card-title>

          <!-- 필터 바 -->
          <v-card-text class="pt-0">
            <v-row dense>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="filters.q"
                  label="검색 (제목/본문/작성자)"
                  prepend-inner-icon="mdi-magnify"
                  outlined dense clearable
                />
              </v-col>
              <!--v-col cols="6" md="3">
                <v-select
                  v-model="filters.category"
                  :items="categoryItems"
                  label="카테고리"
                  outlined dense clearable
                  prepend-inner-icon="mdi-shape"
                />
              </v-col>
              <v-col cols="6" md="3">
                <v-select
                  v-model="filters.importance"
                  :items="importanceItems"
                  label="중요도"
                  outlined dense clearable
                  prepend-inner-icon="mdi-flag"
                />
              </v-col>
              <v-col cols="12" md="2" class="d-flex align-center">
                <v-menu v-model="menu" offset-y :close-on-content-click="false">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on" outlined class="mr-2">
                      <v-icon left small>mdi-calendar-range</v-icon>
                      기간
                    </v-btn>
                  </template>
                  <v-card>
                    <v-date-picker v-model="dateRange" range color="primary" scrollable></v-date-picker>
                    <v-card-actions>
                      <v-spacer/>
                      <v-btn text @click="dateRange=null">해제</v-btn>
                      <v-btn color="primary" text @click="menu=false">적용</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
                <v-btn text @click="resetFilters">필터 초기화</v-btn>
              </v-col-->
            </v-row>
          </v-card-text>

          <v-card-text>
          <!-- 목록 -->
          <table id="notiTable">
            <thead>
            <tr>
              <th v-for="item in headers">{{item.text}}</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="data in filteredNotices">
              <td>{{data.id}}</td>
              <td>{{data.title}}</td>
              <td>{{data.author}}</td>
            </tr>
            <tr v-for="data in filteredNotices">
              <td colspan="3"><div v-html="data.body"></div></td>
            </tr>
            </tbody>
          </table>
          </v-card-text>
          <!--v-data-table
            :headers="headers"
            :items="filteredNotices"
            :search="filters.q"
            :items-per-page="pagination.itemsPerPage"
            :page.sync="pagination.page"
            item-key="id"
            class="notice-table"
            dense
            @click:row="openDetail"
          >
            <template v-slot:item.pinned="{ item }">
              <v-icon v-if="item.pinned" color="amber darken-2" title="상단고정">mdi-pin</v-icon>
            </template>

            <template v-slot:item.title="{ item }">
              <div class="d-flex align-center">
                <v-chip x-small v-if="item.importance==='중요'" color="red" text-color="white" label class="mr-2">중요</v-chip>
                <span class="text-truncate" style="max-width: 520px">{{ item.title }}</span>
                <v-chip x-small class="ml-2" v-if="item.category" label outlined>{{ item.category }}</v-chip>
                <v-chip x-small class="ml-2" v-if="item.attachments && item.attachments.length" label>
                  <v-icon left x-small>mdi-paperclip</v-icon>{{ item.attachments.length }}
                </v-chip>
              </div>
            </template>

            <template v-slot:item.createdAt="{ item }">
              {{ formatDate(item.createdAt) }}
            </template>

            <template v-slot:item.status="{ item }">
              <v-chip x-small :color="item.visible ? 'green' : 'grey'" dark label>
                {{ item.visible ? '게시중' : '비공개' }}
              </v-chip>
            </template>

            <template v-slot:no-data>
              <v-sheet class="text-center pa-8 grey--text">
                <v-icon large class="mb-2">mdi-text-box-search-outline</v-icon>
                조건에 맞는 공지사항이 없습니다.
              </v-sheet>
            </template>
          </v-data-table-->
        </v-card>

    <!-- 우측 상세 패널 -->
    <v-navigation-drawer
      right temporary app
      v-model="drawer"
      width="520"
    >
      <v-toolbar flat dense>
        <v-toolbar-title class="subtitle-1 font-weight-bold">공지 상세</v-toolbar-title>
        <v-spacer/>
        <v-btn icon @click="drawer=false"><v-icon>mdi-close</v-icon></v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <div v-if="current" class="pa-4">
        <div class="d-flex align-center mb-2">
          <v-chip small class="mr-2" color="indigo lighten-5" text-color="indigo darken-3" label>
            {{ current.category || '기타' }}
          </v-chip>
          <v-chip small v-if="current.importance==='중요'" color="red" text-color="white" label>중요</v-chip>
          <v-spacer/>
          <v-icon v-if="current.pinned" small color="amber darken-2" class="mr-1">mdi-pin</v-icon>
          <span class="caption grey--text">작성 {{ formatDate(current.createdAt) }}</span>
        </div>

        <div class="mb-2 font-weight-bold" style="font-size:18px">
          {{ current.title }}
        </div>

        <v-alert v-if="!current.visible" dense type="info" text class="mb-3">
          이 공지는 현재 “비공개” 상태입니다.
        </v-alert>

        <div class="body mb-6" v-html="current.body"></div>

        <div v-if="current.attachments && current.attachments.length">
          <div class="subtitle-2 font-weight-bold mb-1">첨부파일</div>
          <v-list dense>
            <v-list-item v-for="(f,i) in current.attachments" :key="i" @click="" :href="f.url" target="_blank">
              <v-list-item-icon><v-icon small>mdi-paperclip</v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ f.name }}</v-list-item-title>
                <v-list-item-subtitle class="caption grey--text">{{ f.size }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action><v-icon small>mdi-open-in-new</v-icon></v-list-item-action>
            </v-list-item>
          </v-list>
        </div>

        <v-divider class="my-4"></v-divider>

        <div class="d-flex">
          <v-btn small depressed color="primary" class="mr-2" @click="onEdit(current)">
            <v-icon left small>mdi-pencil</v-icon> 편집
          </v-btn>
          <v-btn small depressed color="error" outlined @click="onDelete(current)">
            <v-icon left small>mdi-trash-can</v-icon> 삭제
          </v-btn>
          <v-spacer/>
          <v-btn small text @click="drawer=false">닫기</v-btn>
        </div>
      </div>

      <div v-else class="pa-6 grey--text text--darken-1">
        항목을 선택하면 상세내용이 여기 표시됩니다.
      </div>
    </v-navigation-drawer>
  </v-container>
</template>

<script>
// 실제 연동 시 axios로 서버 페이징/검색 구현 가능
export default {
  name: 'NoticeBoard',
  data () {
    return {
      // filters
      filters: {
        q: '',
        category: null,
        importance: null,
      },
      dateRange: null,
      menu: false,

      // table
      headers: [
        { text: '', value: 'pinned', width: 40, sortable: false },
        { text: '제목', value: 'title', width: 600 },
        { text: '작성자', value: 'author', width: 120 },
        { text: '작성일', value: 'createdAt', width: 140 },
        { text: '상태', value: 'status', width: 100, sortable: false },
      ],
      notices: [
        {
          id: 101,
          title: '5월 근무 스케줄 확정 안내',
          body: '<p>5월 근무 스케줄이 확정되어 게시되었습니다. 각 팀은 스케줄 확인 바랍니다.</p>',
          author: '관리자',
          category: '근태',
          importance: '일반',
          visible: true,
          pinned: true,
          createdAt: '2025-05-02',
          attachments: [{ name: '5월_스케줄.pdf', size: '124KB', url: '#' }],
        },
        {
          id: 102,
          title: '보안 점검으로 인한 시스템 점검 안내 (5/10 01:00~03:00)',
          body: '<p>시스템 안정화를 위한 점검이 예정되어 있으며, 점검 중 일시적으로 접속이 제한될 수 있습니다.</p>',
          author: '시스템팀',
          category: '시스템',
          importance: '중요',
          visible: true,
          pinned: false,
          createdAt: '2025-05-01',
          attachments: [],
        },
        {
          id: 103,
          title: '복리후생 안내 업데이트',
          body: '<p>복지포인트, 휴가 정책 업데이트 내용을 확인하세요.</p>',
          author: 'HR',
          category: '인사',
          importance: '일반',
          visible: false,
          pinned: false,
          createdAt: '2025-04-25',
          attachments: [{ name: '복리후생_가이드.docx', size: '48KB', url: '#' }],
        },
      ],

      // combos
      categoryItems: ['전체', '시스템', '근태', '인사', '일반'],
      importanceItems: ['전체', '중요', '일반'],

      // pagination
      pagination: {
        page: 1,
        itemsPerPage: 10,
      },

      // detail drawer
      drawer: false,
      current: null,
    }
  },
  computed: {
    filteredNotices () {
      const { category, importance } = this.filters
      const [start, end] = this.dateRange
        ? [new Date(this.dateRange.start || this.dateRange[0] || this.dateRange), new Date(this.dateRange.end || this.dateRange[1] || this.dateRange)]
        : [null, null]

      return this.notices
        .filter(n => {
          // 카테고리
          if (category && category !== '전체' && n.category !== category) return false
          // 중요도
          if (importance && importance !== '전체' && n.importance !== importance) return false
          // 기간
          if (start && end) {
            const d = new Date(n.createdAt)
            if (d < start || d > end) return false
          }
          return true
        })
        .sort((a, b) => (b.pinned - a.pinned) || (new Date(b.createdAt) - new Date(a.createdAt)))
    }
  },
  methods: {
    formatDate (d) {
      if (!d) return ''
      const x = new Date(d)
      const y = x.getFullYear()
      const m = ('0' + (x.getMonth() + 1)).slice(-2)
      const day = ('0' + x.getDate()).slice(-2)
      return `${y}-${m}-${day}`
    },
    resetFilters () {
      this.filters.q = ''
      this.filters.category = null
      this.filters.importance = null
      this.dateRange = null
    },
    openDetail (item) {
      this.current = item
      this.drawer = true
    },
    onCreate () {
      // 라우팅 or 다이얼로그 등으로 연결
      // this.$router.push('/notices/new')
      alert('새 공지 작성 화면으로 연결하세요.')
    },
    onEdit (item) {
      // this.$router.push(`/notices/${item.id}/edit`)
      alert(`공지 #${item.id} 편집으로 이동`)
    },
    onDelete (item) {
      if (!confirm('정말 삭제하시겠습니까?')) return
      this.notices = this.notices.filter(n => n.id !== item.id)
      this.drawer = false
    },
  }
}
</script>

<style scoped>
#notiTable th, td {
  font-size: 0.8rem;
  padding: 4px;
}
.notice-table ::v-deep .v-data-table__wrapper {
  max-height: 60vh; /* 스크롤 고정 높이 */
}
.body p { margin: 0 0 8px; line-height: 1.5; }
</style>
