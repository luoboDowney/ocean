function getContextPath() {
  let strPath = location.pathname;
  return strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
}

/**
 * 配置登陆后自动跳转的网址，可在调用本 js 之前定义 window.homeUrl 属性作为登陆后的跳转页面
 */
if (window.homeUrl === undefined) {
  window.homeUrl = "/OA1.html";
}

/**
 * 登陆成功后自动跳转
 */
function openHomeUrl() {
  location.href = typeof window.homeUrl === "string" ? getContextPath() + window.homeUrl : getContextPath() + "/index";
}

function clearUserInfo() {
  sessionStorage.removeItem("userInfo");
}

/**
 * @param userInfo {string|object}
 */
function setUserInfo(userInfo) {
  if (userInfo === undefined || userInfo === null) {
    return;
  }
  if (typeof userInfo !== "string") {
    userInfo = JSON.stringify(userInfo);
  }
  sessionStorage.setItem("userInfo", userInfo);
}

/**
 * @returns {string|null}
 */
function getUserInfo() {
  return sessionStorage.getItem("userInfo");
}

function openLoginUrl() {
  if (location.href.endsWith(URL_LOGIN)) {
    dismissCheckingLogin();
  } else {
    location.href = URL_LOGIN;
  }
}

function dismissCheckingLogin() {
  let i = setInterval(() => {
    let checkingLogin = document.getElementById("checkingLogin"),
      main = document.getElementById("main");
    if (checkingLogin !== undefined && checkingLogin !== null) {
      checkingLogin.style.display = "none";
      if (main !== undefined && main !== null) {
        main.style.display = "";
      }
      clearInterval(i);
    }
  }, 10);
}

const URL_404 = getContextPath() + "/404.html";
const URL_LOGIN = getContextPath() + "/login.html";
const USER_INFO_STR = getUserInfo();
const USER_INFO = JSON.parse(USER_INFO_STR);

if (USER_INFO_STR === null) {
  openLoginUrl();
} else {
  $.ajax({
    url: getContextPath() + "/user/loginAction",
    type: "POST",
    contentType: "application/json;charset=UTF-8",
    data: USER_INFO_STR,
    /**
     * @param result.code {number} 状态码
     * @param result.obj {*} 返回结果
     * @param result.message {string} 附加信息
     */
    success(result) {
      switch (result.code) {
        case 500:
          if (!location.href.endsWith(URL_LOGIN)) {
            toast(result.message + "3 秒钟后自动跳转登陆页面，请重新登录。");
            setTimeout(() => location.href = URL_LOGIN, 3000);
          } else {
            dismissCheckingLogin();
          }
          return;
        case 200:
          if (location.href.endsWith(URL_LOGIN)) {
            // 已登陆，从登录页面跳转到首页
            toast("已登陆，正在跳转...");
            openHomeUrl();
          } else {
            dismissCheckingLogin();
          }
          return;
      }
    },
    error() {
      if (location.href.endsWith(URL_LOGIN)) {
        dismissCheckingLogin();
      } else {
        toast("发生了错误，无法验证是否是有效用户，3 秒钟后自动跳转登陆页面，请重新登录。");
        setTimeout(() => location.href = URL_LOGIN, 3000);
      }
    }
  });
}