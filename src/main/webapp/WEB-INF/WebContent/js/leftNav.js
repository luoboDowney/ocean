$(() => {
  const $firstDir = $("#firstDir"),
    $secondDir = $("#secondDir"),
    $thirdDir = $("#thirdDir"),
    firstDirOptions = ["重构模型", "模式数据", "实测数据", "声场数据", "遥感数据", "其他数据", "动态数据"],
    secondDirOptions = [
      ["adjust_instability_daily_app", "evaluate", "ISOP_NIO", "MODAS_NIO", "SQG_isQG_app"],
      ["coupled", "luzon", "ncep", "quick"],
      ["argo浮标", "船报轨迹", "单点海洋站"],
      ["作用距离", "隐蔽指数", "声场损失"],
      [],
      [],
      []
    ],
    thirdDirOptions = [
      ["input", "output"],
      [],
      [],
      [],
      [],
      [],
      []
    ],
    $leftNavFileList = $("#leftNavFileList");
  let firstDirIndex = 0, secondDirIndex = 0, thirdDirIndex = 0;
  $firstDir.on("change", function () {
    firstDirIndex = this.selectedIndex;
    notifySecondDirChange();
    notifyThirdDirChange();
  });
  $secondDir.on("change", function () {
    secondDirIndex = this.selectedIndex;
    notifyThirdDirChange();
  });
  $thirdDir.on("change", function () {
    thirdDirIndex = this.selectedIndex;
  });

  function notifySecondDirChange() {
    $secondDir.empty();
    secondDirOptions[firstDirIndex].forEach(item => $secondDir.append(`<option>${item}</option>`));
    secondDirIndex = $secondDir[0].selectedIndex;
  }

  function notifyThirdDirChange() {
    $thirdDir.empty();
    if (secondDirIndex !== 1) {
      thirdDirOptions[firstDirIndex].forEach(item => $thirdDir.append(`<option>${item}</option>`));
    }
    thirdDirIndex = $thirdDir[0].selectedIndex;
  }

  $("#leftNavButtonSearch").on("click", () => {
    // 假的动态演示功能，在第一个下拉框为第 6 条：动态数据时，调用 fakeWave 方法
    if (firstDirIndex === 6) {
      fakeWave();
      return;
    }
    $.ajax({
      url: getContextPath() + "/leftNav/search",
      type: "POST",
      contentType: "application/x-www-form-urlencoded;charset=UTF-8",
      data: {
        firstDir: firstDirOptions[firstDirIndex],
        secondDir: secondDirOptions[firstDirIndex][secondDirIndex],
        thirdDir: thirdDirOptions[firstDirIndex][thirdDirIndex]
      },
      success(result) {
        switch (result.code) {
          case 200:
            $leftNavFileList.empty();
            result.data.forEach(item => $leftNavFileList.append(`
          <li><label>
            <input type="radio" name="fileList" value="${item.name}" data-path="${item.path}" 
              data-first-dir="${item.firstDir}" data-second-dir="${item.secondDir}" data-third-dir="${item.thirdDir}">
            <span title="${item.name}">${item.name}</span>
          </label></li>`));
            break;
          case 500:
            console.log(result.message);
            break;
        }
      }
    });
  });

  // 利用基于 jQuery 的插件的方法，将 select 变更为可输入的下拉框
  // 插件网址：https://github.com/indrimuska/jquery-editable-select
  $("#selectLayer").editableSelect({
    effects: 'slide'
  });
  $("#selectAngle").editableSelect({
    effects: 'slide'
  });
  $("#leftNavButtonAdd").on("click", () => {
    const selectParam = document.getElementById("selectParam"),
      selectArea = document.getElementById("selectArea"),
      selectLayer = document.getElementById("selectLayer"),
      selectAngle = document.getElementById("selectAngle"),
      selectPrecision = document.getElementById("selectPrecision");
    let name = "", filePath = "", firstDir = "", secondDir = "", thirdDir = "";
    $("#leftNavFileList input").each(function () {
      if (this.checked) {
        name = this.dataset.name;
        filePath = this.dataset.path;
        firstDir = this.dataset.firstDir;
        secondDir = this.dataset.secondDir;
        thirdDir = this.dataset.thirdDir;
        return false;
      }
    });
    const param = {
      name,
      filePath,
      firstDir,
      secondDir,
      thirdDir,
      param: selectParam.value,
      area: selectArea.value,
      layer: selectLayer.value,
      angle: selectAngle.value,
      precision: selectPrecision.value
    };
    window.isEchartsMode ? addPic(param) : notifyParamConfirm(param);
  });
  $("#leftNavButtonClear").on("click", () => window.isEchartsMode ? clear() : stopFakeWave() || removeAll());
});