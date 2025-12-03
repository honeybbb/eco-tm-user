// middleware/auth.js
export default function ({ redirect }) {
  // localStorage는 브라우저에서만 있으니까 클라이언트 체크
  if (process.client) {
    const token = localStorage.getItem('user_token')

    // 토큰 없으면 로그인 페이지로 보냄
    if (!token) {
      return redirect('/login')
    }
  }
}
