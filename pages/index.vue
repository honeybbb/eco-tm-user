<template>
  <v-container class="pa-0 mobile-wrap" fluid>
    <!-- 상단 앱바(로고/아이콘) -->
    <!--v-app-bar dense flat color="white" class="appbar">
      <div class="d-flex align-center">
        <v-img src="/logo.svg" contain max-width="72" class="mr-2"></v-img>
        <span class="title font-weight-bold">에코그린TM</span>
      </div>
      <v-spacer />
      <v-btn icon><v-icon>mdi-bell-outline</v-icon></v-btn>
      <v-btn icon to="/mypage"><v-icon>mdi-account-circle-outline</v-icon></v-btn>
    </v-app-bar-->

    <!-- 상단 요약 카드(오늘) -->
    <v-card class="mx-4 mt-4 rounded-xl elevation-1 summary-card">
      <v-card-text class="py-3">
        <div class="d-flex align-center justify-space-between">
          <div>
            <div class="caption grey--text">오늘</div>
            <div class="headline font-weight-bold">{{ headerDate }}</div>
            <div class="caption grey--text">{{ shiftLabel }}</div>
          </div>
          <div class="text-right">
            <div class="caption grey--text">근무시간</div>
            <div class="subtitle-1 font-weight-bold">
              {{ workedHours }}h / {{ targetHours }}h
            </div>
          </div>
        </div>

        <v-divider class="my-3"></v-divider>

        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-avatar size="44" class="mr-3 check-avatar" tile>
              <v-icon large color="white">mdi-fingerprint</v-icon>
            </v-avatar>
            <div>
              <div class="body-2 grey--text">현재 상태</div>
              <div class="subtitle-2 font-weight-bold">
                {{ statusLabel }}
              </div>
            </div>
          </div>

          <v-btn
            :color="isWorking ? 'red darken-1' : 'primary'"
            class="px-5 rounded-lg"
            depressed
            @click="toggleCheck"
          >
            <v-icon left>
              {{ isWorking ? 'mdi-logout-variant' : 'mdi-login-variant' }}
            </v-icon>
            {{ isWorking ? '퇴근하기' : '출근하기' }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <!-- 본문 카드 -->
    <v-card class="mx-4 mt-3 rounded-xl elevation-1">
      <v-card-text class="py-4">
        <!-- 달력(월) -->
        <div class="mb-3 font-weight-bold ml-1">나의 근무</div>
        <v-date-picker
          v-model="selectedDate"
          :events="eventDates"
          event-color="green"
          color="primary"
          class="rounded-lg"
          :show-current="true"
          @input="onPickDate"
          locale="ko-KR"
        ></v-date-picker>

      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog">
      <v-card class="pa-4" color="#fff">
        <!-- 근무시간 입력/표시 -->
        <div class="d-flex align-center justify-space-between mt-5 mb-1">
          <div class="subtitle-2 grey--text">근무시간</div>
          <div class="caption grey--text">{{ workedHours }}시간 / {{ targetHours }}시간</div>
        </div>

        <v-list dense class="rounded-lg py-0 time-list">
          <v-list-item class="px-0">
            <v-list-item-avatar tile>
              <v-chip x-small color="green lighten-5" text-color="green darken-2">출근</v-chip>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-text-field
                v-model="form.checkIn"
                hide-details
                dense
                outlined
                placeholder="예: 09:00"
                append-icon="mdi-clock-outline"
                @click:append="pick('checkIn')"
              />
            </v-list-item-content>
          </v-list-item>

          <v-list-item class="px-0">
            <v-list-item-avatar tile>
              <v-chip x-small color="amber lighten-5" text-color="amber darken-2">휴식</v-chip>
            </v-list-item-avatar>
            <v-list-item-content class="d-flex" style="gap:8px;">
              <v-text-field
                v-model="form.breakStart"
                hide-details dense outlined style="max-width: 46%;"
                placeholder="18:00"
                append-icon="mdi-clock-outline"
                @click:append="pick('breakStart')"
              />
              <v-text-field
                v-model="form.breakEnd"
                hide-details dense outlined style="max-width: 46%;"
                placeholder="19:00"
                append-icon="mdi-clock-outline"
                @click:append="pick('breakEnd')"
              />
            </v-list-item-content>
          </v-list-item>

          <v-list-item class="px-0">
            <v-list-item-avatar tile>
              <v-chip x-small color="red lighten-5" text-color="red darken-1">퇴근</v-chip>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-text-field
                v-model="form.checkOut"
                hide-details dense outlined
                placeholder="예: 18:00"
                append-icon="mdi-clock-outline"
                @click:append="pick('checkOut')"
              />
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <!-- 등록 버튼 -->
        <!--v-btn
          block large color="primary"
          class="mt-4 rounded-lg"
          @click="saveWork"
        >
          근무 등록
        </v-btn-->
      </v-card>
    </v-dialog>



    <!-- 간단 시간 피커(시:분) -->
    <v-dialog v-model="timePicker.show" max-width="320">
      <v-card class="rounded-xl">
        <v-card-title class="py-3">{{ timePicker.label }}</v-card-title>
        <v-card-text>
          <div class="d-flex" style="gap:10px;">
            <v-select
              :items="hours" v-model="timePicker.hh"
              dense outlined hide-details label="시"
            />
            <v-select
              :items="minutes" v-model="timePicker.mm"
              dense outlined hide-details label="분"
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="timePicker.show=false">취소</v-btn>
          <v-btn color="primary" text @click="applyTime">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  name: 'AttendanceMobile',
  data: () => ({
    // 상단 상태
    isWorking: false,
    workedHours: 18.5,
    targetHours: 24,
    selectedDate: new Date().toISOString().substr(0, 10),

    // 시간 입력
    form: {
      checkIn: '09:13',
      breakStart: '18:00',
      breakEnd: '19:00',
      checkOut: '19:00',
    },

    // 데모: 이벤트 날짜(달력 점)
    eventDates: [],
    timePicker: {
      show: false,
      key: null,
      label: '',
      hh: '09',
      mm: '00',
    },
    dialog: false,
  }),
  computed: {
    headerDate () {
      const d = new Date(this.selectedDate)
      const yoil = ['일','월','화','수','목','금','토'][d.getDay()]
      return `${d.getFullYear()}년 ${d.getMonth()+1}월 ${d.getDate()}일 (${yoil})`
    },
    statusLabel () {
      return this.isWorking ? '근무중' : '대기'
    },
    shiftLabel () {
      return '09:00 ~ 19:00 (휴게 1시간)'
    },
    hours () {
      return Array.from({length:24},(_,i)=>String(i).padStart(2,'0'))
    },
    minutes () {
      return ['00','05','10','15','20','25','30','35','40','45','50','55']
    },
  },
  mounted () {
    // 달력에 근무 마크 데모
    const base = new Date()
    const dots = [0,1,2,3,5,7,10,11,12,15,17,20,21,22,24,25,28]
    this.eventDates = dots.map(n => {
      const d = new Date(base.getFullYear(), base.getMonth(), n+1)
      return d.toISOString().substr(0,10)
    })

    this.getWorkFl();
  },
  methods: {
    getWorkFl() {
      this.isWorking = true;
      //내 정보 확인 후 출근여부 확인
      // const mIdx = this.$store.state.auth?.memberId || 0;
      const mIdx = 1;
      if (!mIdx) {
        console.warn('회원 식별자가 없습니다.');
        this.isWorking = false;
        return;
      }

      axios
        .get(`http://localhost:3001/v1/member/data/${mIdx}`, { timeout: 8000 })
        .then((res) => {
          const result = res?.data?.data;
          if (!result || result.length === 0) {
            console.warn("회원 데이터가 없습니다.");
            return;
          }

          const sIdx = result.sIdx || result[0]?.sIdx;
          if (!sIdx) {
            console.warn("현장 정보(sIdx)가 없습니다.");
            return;
          }

          // 출근여부 확인
          return axios.get(`http://localhost:3001/v1/work/${mIdx}`, {
            params: { sIdx },
            timeout: 8000,
          });
        })
        .then((res) => {
          if (!res) return; // 이전 then에서 에러나 조기 종료된 경우
          const workData = res?.data?.data;
          console.log("출근여부 확인 결과:", workData);
          if(workData.length == 0) this.isWorking = false;
        })
        .catch((err) => {
          console.error("getWorkFl() 실패:", err);
        });
    },
    onPickDate (val) {
      // 날짜 변경 시, 데모로 값만 유지
      this.selectedDate = val
      this.dialog = true
    },
    toggleCheck() {
      const mIdx = 1;
      const sIdx = 1;
      let params = new URLSearchParams();
      params.append('mIdx', mIdx)
      params.append('sIdx', sIdx)
      //출근 로직
      if(this.isWorking) {
        console.log('퇴근하기')
        axios.put('http://localhost:3001/v1/work/end', params)
          .then(res => {
            console.log(res.data)
            alert("퇴근이 처리되었습니다.")
          })
      }else {
        console.log('출근하기')

        axios.post('http://localhost:3001/v1/work/start', params)
          .then(res => {
            console.log(res.data)
            alert("출근이 처리되었습니다.")
          })
      }

    },
    toggleCheck1 () {
      if(this.isWorking) confirm("퇴근하시겠습니까?")
      this.isWorking = !this.isWorking
      if (this.isWorking && !this.form.checkIn) {
        const now = new Date()
        this.form.checkIn = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`

      }
      if (!this.isWorking && !this.form.checkOut) {
        const now = new Date()
        this.form.checkOut = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
      }

      console.log(this.form)

      //출근등록
      let params = new URLSearchParams();
      params.append('mIdx', this.mIdx);
      params.append('sIdx', this.sIdx);
      if (!this.isWorking) {
        // 퇴근등록
        axios.put('http://localhost:3000/v1/work/end', params)
          .then(res => {
            console.log('퇴근 등록 결과:', res.data.result);
          })
          .catch(err => {
            console.error('퇴근등록 오류:', err);
          });
      } else {
        // 출근등록
        axios.post('http://localhost:3000/v1/work/start', params)
          .then(res => {
            console.log('출근 등록 결과:', res.data.result);
          })
          .catch(err => {
            console.error('출근등록 오류:', err);
          });
      }
    },
    pick (key) {
      this.timePicker.key = key
      this.timePicker.label =
        key === 'checkIn' ? '출근 시간' :
          key === 'checkOut' ? '퇴근 시간' :
            key === 'breakStart' ? '휴식 시작' : '휴식 종료'
      const cur = (this.form[key] || '09:00').split(':')
      this.timePicker.hh = cur[0]
      this.timePicker.mm = cur[1]
      this.timePicker.show = true
    },
    applyTime () {
      const v = `${this.timePicker.hh}:${this.timePicker.mm}`
      this.$set(this.form, this.timePicker.key, v)
      this.timePicker.show = false
    },
    saveWork () {
      // 실제로는 API 호출
      this.$toast && this.$toast.success
        ? this.$toast.success('근무가 저장되었습니다.')
        : alert('근무가 저장되었습니다.')
    }
  }
}
</script>

<style scoped>
.mobile-wrap {
  max-width: 480px;  /* 모바일 프레임 느낌 */
  margin: 0 auto;
  padding-bottom: 68px; /* bottom nav 공간 */
}
.appbar { border-bottom: 1px solid #eef2f7; }
.summary-card {
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
}
.check-avatar {
  background: #3b82f6;
  border-radius: 12px !important;
}
.time-list :deep(.v-list-item__content) { padding-right:0 !important; }
</style>
