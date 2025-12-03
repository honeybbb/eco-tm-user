<template>
  <v-container class="pa-0 mobile-wrap" fluid>
    <v-card class="mx-4 mt-4 rounded-xl elevation-1">
          <v-card-title class="py-4">
            <v-avatar size="44" class="mr-3"><v-icon large>mdi-account</v-icon></v-avatar>
            <div>
              <div class="subtitle-1 grey--text">마이페이지</div>
              <div class="headline font-weight-bold">{{ profile.name || '-' }}</div>
            </div>
            <v-spacer/>
            <v-btn color="primary" outlined @click="goEdit">
              <v-icon left to="/mypage/edit">mdi-pencil</v-icon>수정
            </v-btn>
          </v-card-title>

          <v-divider/>

          <v-card-text>
            <v-skeleton-loader
              v-if="loading"
              type="article, list-item, list-item, list-item"
            />

            <template v-else>
              <!-- 기본 정보 -->
              <section class="mb-6">
                <div class="font-weight-bold mb-2">기본 정보</div>
                <v-list two-line dense>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>아이디</v-list-item-title>
                      <v-list-item-subtitle>{{ profile.userId || '-' }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>생년월일</v-list-item-title>
                      <v-list-item-subtitle>{{ formatDate(profile.birthDate) }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>연락처</v-list-item-title>
                      <v-list-item-subtitle>{{ profile.phone || '-' }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn icon :href="`tel:${profile.phone}`"><v-icon>mdi-phone</v-icon></v-btn>
                    </v-list-item-action>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>성별</v-list-item-title>
                      <v-list-item-subtitle>{{ profile.gender || '-' }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>직책</v-list-item-title>
                      <v-list-item-subtitle>{{ profile.position || '-' }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </section>

              <v-divider/>

              <!-- 주소/비고 -->
              <section class="my-6">
                <div class="font-weight-bold mb-2">주소 / 비고</div>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>주소</v-list-item-title>
                      <v-list-item-subtitle class="text-pre">{{ profile.address || '-' }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>비고</v-list-item-title>
                      <v-list-item-subtitle class="text-pre">{{ profile.note || '-' }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </section>

              <v-divider/>

              <!-- 계약/증빙 -->
              <section class="my-6">
                <div class="font-weight-bold mb-2">계약 / 증빙</div>
                <v-row dense>
                  <v-col cols="12" md="6">
                    <v-card outlined class="rounded-lg">
                      <v-card-text class="py-3">
                        <div class="subtitle-2 grey--text mb-1">근로계약서</div>
                        <div class="d-flex align-center">
                          <v-icon class="mr-2">mdi-file-document-outline</v-icon>
                          <a v-if="profile.contractUrl"
                             :href="profile.contractUrl" target="_blank">다운로드</a>
                          <span v-else>-</span>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-card outlined class="rounded-lg">
                      <v-card-text class="py-3">
                        <div class="subtitle-2 grey--text mb-1">신원보증</div>
                        <div class="d-flex align-center">
                          <v-icon class="mr-2">mdi-shield-account-outline</v-icon>
                          <a v-if="profile.guaranteeUrl"
                             :href="profile.guaranteeUrl" target="_blank">다운로드</a>
                          <span v-else>-</span>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </section>

              <v-divider/>

              <!-- 급여/은행 -->
              <section class="my-6">
                <div class="font-weight-bold mb-2">급여 정보</div>
                <v-simple-table dense class="rounded-lg outlined">
                  <tbody>
                  <tr>
                    <td class="grey--text text--darken-1" style="width:120px">은행</td>
                    <td>{{ profile.bank || '-' }}</td>
                  </tr>
                  <tr>
                    <td class="grey--text text--darken-1">계좌번호</td>
                    <td>{{ profile.account || '-' }}</td>
                  </tr>
                  <tr>
                    <td class="grey--text text--darken-1">입사일</td>
                    <td>{{ formatDate(profile.hireDate) }}</td>
                  </tr>
                  </tbody>
                </v-simple-table>
              </section>

              <v-divider/>

              <!-- 배치 현장 -->
              <section class="my-6">
                <div class="font-weight-bold mb-2">배치된 현장</div>
                <v-simple-table dense class="rounded-lg outlined">
                  <thead>
                  <tr>
                    <th class="text-left">현장명</th>
                    <th class="text-left">주소</th>
                    <th class="text-left">상태</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(s, i) in (profile.sites || [])" :key="i">
                    <td>{{ s.name }}</td>
                    <td>{{ s.address }}</td>
                    <td>
                      <v-chip x-small :color="s.active ? 'green lighten-5' : 'grey lighten-4'"
                              :text-color="s.active ? 'green darken-2' : 'grey darken-1'">
                        {{ s.active ? '배치중' : '해제' }}
                      </v-chip>
                    </td>
                  </tr>
                  <tr v-if="!(profile.sites && profile.sites.length)">
                    <td colspan="3" class="grey--text">배치 정보가 없습니다.</td>
                  </tr>
                  </tbody>
                </v-simple-table>
              </section>
            </template>
          </v-card-text>
        </v-card>
  </v-container>
</template>

<script>
// 필요 시 this.$axios 사용. 여기선 데모 데이터로 구성
import axios from "axios";

export default {
  name: 'MyPage',
  data: () => ({
    loading: true,
    profile: {
      // API 응답 예시 필드
      name: '',
      userId: '',
      birthDate: null,
      phone: '',
      gender: '',
      position: '',
      address: '',
      note: '',
      contractUrl: '',
      guaranteeUrl: '',
      bank: '',
      account: '',
      hireDate: null,
      sites: []
    }
  }),
  created () {
    this.getMyData()
  },
  methods: {
    async getMyData () {
      try {
        const mIdx = 1; // 임시값
        // const { data } = await this.$axios.get('/api/v1/me')
        // this.profile = data
        axios.get('http://localhost:3001/v1/member/data/'+mIdx)
          .then(res => {
            let result = res.data.data[0]
            console.log(JSON.parse(result.sites));
            // 데모 더미
            this.profile = {
              name: result.name,
              userId: result.id,
              birthDate: result.birthDate,
              phone: result.phone,
              gender: result.gender,
              position: result.position,
              address: result.addr,
              bigo: result.bigo,
              contractUrl: result.filePath, //계약서
              guaranteeUrl: '/files/guarantee_1234.pdf', //신원보증
              contractDt: result.startDt,
              expiredDt: result.endDt,
              bank: result.bank,
              account: result.account,
              inDate: result.inDate, //입사일
              outDate: result.outDate, //퇴사일
              sites: JSON.parse(result.sites),
              // hireDate: '2020-06-04',
              // sites: [
              //   { name: 'LH 옥정 8단지', address: '양주시 옥정동로 258', active: true },
              //   { name: '강서대림경동', address: '서울 강서구 허준로 121', active: false }
              // ]
            }
            /*
            this.profile = {
              name: '정계자',
              userId: 'jung',
              birthDate: '1970-03-11',
              phone: '010-5205-9596',
              gender: '여',
              position: '반장',
              address: '경기도 양주시 고읍남로39번길 84, 310동 1201호',
              note: '근무성실',
              contractUrl: '/files/contract_1234.pdf',
              guaranteeUrl: '/files/guarantee_1234.pdf',
              bank: '새마을',
              account: '9002-1340-9482-0',
              hireDate: '2020-06-04',
              sites: [
                { name: 'LH 옥정 8단지', address: '양주시 옥정동로 258', active: true },
                { name: '강서대림경동', address: '서울 강서구 허준로 121', active: false }
              ]
            }

             */
          })

      } finally {
        this.loading = false
      }
    },
    formatDate (d) {
      if (!d) return '-'
      const dt = new Date(d)
      if (isNaN(dt.getTime())) return d
      const y = dt.getFullYear()
      const m = String(dt.getMonth()+1).padStart(2, '0')
      const day = String(dt.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    },
    goEdit () {
      this.$router.push('/mypage/edit') // 수정 화면이 있다면
    }
  }
}
</script>

<style scoped>
.text-pre { white-space: pre-line; }
.outlined { border: 1px solid #e5e7eb; }
</style>
