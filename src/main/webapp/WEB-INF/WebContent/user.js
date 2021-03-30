let $domTbodyUserList = $("#tbodyUserList"),
  domUsername = document.getElementById("username"),
  domPassword = document.getElementById("password");
$domTbodyUserList.on("click", "td", function () {
  domUsername.value = this.textContent;
  domPassword.value = "";
});
$("#addUser").on("click", () => {
  let [username, password] = [domUsername.value.trim(), domPassword.value.trim()];
  if (username === "" || password === "") {
    toast("User Name 和 Password 不能为空");
    return;
  }
  $.ajax({
    url: getContextPath() + "/user/addAction",
    type: "POST",
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify({username, password}),
    success(result) {
      switch (result.code) {
        case 200:
          getUserList();
          break;
        case 500:
          toast("新增用户失败。");
          break;
      }
    },
    error() {
      toast("网络错误，新增用户失败。");
    }
  });
});
$("#deleteUser").on("click", () => {
  let username = domUsername.value.trim();
  if (username === "") {
    toast("User Name 不能为空");
    return;
  }
  $.ajax({
    url: getContextPath() + "/user/removeAction",
    type: "POST",
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify({username}),
    success(result) {
      switch (result.code) {
        case 200:
          getUserList();
          break;
        case 500:
          toast("删除用户失败。");
          break;
      }
    },
    error() {
      toast("网络错误，删除用户失败。");
    }
  });
});

// 页面加载即立刻刷新用户列表
getUserList();

function getUserList() {
  $.ajax({
    url: getContextPath() + "/user/getUserListAction",
    type: "POST",
    success(result) {
      switch (result.code) {
        case 200:
          updateUserList(result.data);
          break;
        case 500:
          toast("获取用户列表失败");
          break;
      }
    },
    error() {
      toast("网络错误，获取用户列表失败。");
    }
  });
}

function updateUserList(userList) {
  $domTbodyUserList.empty();
  userList.forEach(user => {
    let domTr = document.createElement("tr"),
      domTd = document.createElement("td");
    domTd.textContent = user.username;
    domTr.append(domTd);
    $domTbodyUserList.append(domTr);
  });
}