// middleware/guest-only.js
export default function ({ redirect }) {
  // 클라이언트에서만 localStorage 접근
  if (process.client) {
    const token = localStorage.getItem('user_token')
    if (token) {
      // 토큰이 있으면 메인 페이지로 리다이렉트
      return redirect('/')
    }
  }
}
