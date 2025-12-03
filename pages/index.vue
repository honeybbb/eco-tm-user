<template>
  <div class="time-tracker">
    <h1>⏰ 출퇴근 기록</h1>
    <h2>{{ isWorking ? '✅ 근무 중' : '❌ 미출근 상태' }}</h2>
    <p>현재 시간: {{ currentTime }}</p>

    <p :class="['status-message', isLocationValid ? 'status-valid' : 'status-invalid']">
      {{ statusMessage }}
    </p>

    <button
      :disabled="isLoading || !isLocationFetched"
      @click="handleTimeRecord"
      :class="{ 'btn-primary': !isWorking, 'btn-danger': isWorking }"
    >
      {{ isLoading ? '처리 중...' : (isWorking ? '🏃‍♂️ 퇴근하기' : '🚶‍♂️ 출근하기') }}
    </button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'TimeTracker',

  // Nuxt2에서는 이렇게 middleware 지정
  middleware: ['auth'],

  data () {
    return {
      // 위치 관련 상태 (원래 useLocation에서 가져오던 것)
      userLocation: {
        lat: null,
        lng: null
      },
      statusMessage: '📍 위치 정보를 확인 중입니다...',
      isLocationFetched: false,
      isLocationValid: false,

      // 근무/로딩 상태
      isWorking: false,
      isLoading: false,
      currentTime: '',

      _timerId: null // setInterval 저장용
    }
  },

  mounted () {
    this.updateTime()
    // 현재 시간 1초마다 갱신
    this._timerId = setInterval(this.updateTime, 1000)

    if (process.client) {
      this.fetchUserLocation()
    }
  },

  beforeDestroy () {
    if (this._timerId) {
      clearInterval(this._timerId)
    }
  },

  methods: {
    updateTime () {
      this.currentTime = new Date().toLocaleTimeString('ko-KR')
    },

    // 원래 useLocation().fetchUserLocation 역할
    fetchUserLocation () {
      if (!process.client) return

      if (!navigator.geolocation) {
        this.statusMessage = '❌ 이 브라우저에서는 위치 정보를 사용할 수 없습니다.'
        this.isLocationFetched = true
        this.isLocationValid = false
        return
      }

      this.statusMessage = '📡 위치 정보를 가져오는 중입니다...'
      this.isLocationFetched = false

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords
          this.userLocation.lat = latitude
          this.userLocation.lng = longitude
          this.isLocationFetched = true

          // TODO: 여기에서 실제 근무지 좌표를 사용해서 유효 범위 체크
          // 예시: const siteLat = 37.123; const siteLng = 127.456;
          //      this.isLocationValid = this.checkDistance(latitude, longitude, siteLat, siteLng) < 200; // 200m 이내

          // 일단은 테스트용으로 "무조건 정상" 처리
          this.isLocationValid = true
          this.statusMessage = '✅ 근무지 근처에서 출퇴근 기록이 가능합니다.'
        },
        (err) => {
          console.error('위치 정보 조회 실패:', err)
          this.statusMessage = '🚨 위치 정보를 가져올 수 없습니다. 설정을 확인해주세요.'
          this.isLocationFetched = true
          this.isLocationValid = false
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    },

    async handleTimeRecord () {
      if (!this.isLocationValid) {
        alert('근무지 근처에서만 출퇴근 기록이 가능합니다.')
        return
      }

      const type = this.isWorking ? 'checkout' : 'checkin'
      this.isLoading = true
      this.statusMessage = `${type === 'checkin' ? '출근' : '퇴근'} 기록 중...`

      try {
        const url = type === 'checkout'
          ? 'http://localhost:3001/v1/work/end'
          : 'http://localhost:3001/v1/work/start'

        const token = process.client ? localStorage.getItem('user_token') : null

        await axios.post(
          url,
          {
            // TODO: 추후 위치도 같이 보낼 거면 여기에 추가
            // latitude: this.userLocation.lat,
            // longitude: this.userLocation.lng,
            mIdx: 1,
            sIdx: 1
          },
          {
            // headers: { Authorization: `Bearer ${token}` }
          }
        )

        this.isWorking = !this.isWorking
        this.statusMessage = this.isWorking
          ? '🎉 출근 완료!'
          : '👋 퇴근 완료!'

        alert(`${type === 'checkin' ? '출근' : '퇴근'}이 성공적으로 기록되었습니다!`)
      } catch (error) {
        console.error('API 호출 실패:', error)
        this.statusMessage = '🚨 기록 실패. 서버 오류.'
        alert(`기록 실패: ${(error.response && error.response.data && error.response.data.message) || '네트워크 오류'}`)
      } finally {
        this.isLoading = false
        // 위치 정보 새로고침
        this.fetchUserLocation()
      }
    }

    // 필요하면 거리 계산 메서드 추가 (하버사인 공식 등)
    /*
    checkDistance(lat1, lon1, lat2, lon2) {
      const R = 6371000; // 지구 반지름 (미터)
      const toRad = d => d * Math.PI / 180;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // meter
    }
    */
  }
}
</script>

<style scoped>
.time-tracker { padding: 20px; text-align: center; }
.status-message { margin: 15px 0; padding: 10px; border-radius: 5px; font-weight: bold; }
.status-valid { background-color: #e6ffe6; color: #4CAF50; }
.status-invalid { background-color: #ffe6e6; color: #f44336; }
button { padding: 15px 30px; font-size: 18px; border: none; border-radius: 10px; cursor: pointer; width: 100%; max-width: 300px; margin-top: 20px; transition: all 0.3s; }
button:disabled { background-color: #ccc !important; cursor: not-allowed; }
.btn-primary { background-color: #4CAF50; color: white; }
.btn-danger { background-color: #f44336; color: white; }
</style>
