import request from "@/core/request";

// 取得玩家信息
export function getProfile() {
  return request<InternalProfile.Profile>({ url: "/profile", method: "GET" });
}

// 设置基礎資料
export function setProfile(data: InternalProfile.SetProfile) {
  return request({ url: "/profile", method: "PATCH", data });
}

// 设置用户名
export function setUsername(data: InternalProfile.SetUsername) {
  return request({ url: "/username", method: "PUT", data });
}

// 设置手机号
export function setPhoneNumber(data: InternalProfile.BindPhoneNumberForm) {
  return request({ url: "/phone-number", method: "POST", data });
}

// 设置邮箱
export function setEmail(data: InternalProfile.EmailUpdateDTO) {
  return request({ url: "/email", method: "POST", data });
}

// 設置登入密碼
export function setLoginPassword(data: InternalProfile.SetPwdCommandDTO) {
  return request({ url: "/login-password", method: "POST", data });
}

// 修改登入密碼
export function updateLoginPassword(data: InternalProfile.UpdatePwdCommandDTO) {
  return request({ url: "/login-password", method: "PUT", data });
}
