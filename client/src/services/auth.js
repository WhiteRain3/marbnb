export const AuthService = {
  login: async (email, password) => {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) return null
    const data = await res.json()
    sessionStorage.setItem("session_user", JSON.stringify(data.user))
    return data.user
  },
  getUser: () => JSON.parse(sessionStorage.getItem("session_user")),
  getRole: () => JSON.parse(sessionStorage.getItem("session_user"))?.role || "guest",
  logout: () => {
    sessionStorage.removeItem("session_user")
    window.location.href = "/"
  },
}
