let viewer = new Cesium.Viewer('cesiumContainer', {
  animation: false,//是否显示动画控件
  shouldAnimate: true,
  baseLayerPicker: false,
  // infoBox:false,
  geocoder: false, //是否显示地名查找控件
  navigationHelpButton: false,//是否显示帮助信息控件
  timeline: false, //是否显示时间线控件
  sceneModePicker: true, //是否显示投影方式控件
  imageryProvider: new Cesium.TileMapServiceImageryProvider({
    url: 'lib/Cesium/Assets/Textures/NaturalEarthII',
    fileExtension: "jpg"
  })
});
//去掉大气渲染
viewer.scene.globe.showGroundAtmosphere = false;
//设置初始位置,勿删
viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(120.20, 20.7, 10000000)
});
viewer.scene.debugShowFramesPerSecond = true;
//关闭地形遮盖
viewer.scene.globe.depthTestAgainstTerrain = false;
//去掉左下角logo
viewer.cesiumWidget.creditContainer.style.display = "none";
//修改鼠标操作方式（默认鼠标中建旋转，右键zoom，以下方式为：中建zoom，右键旋转）
viewer.scene.screenSpaceCameraController.tiltEventTypes = [
  Cesium.CameraEventType.RIGHT_DRAG, Cesium.CameraEventType.PINCH,
  {eventType: Cesium.CameraEventType.LEFT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL},
  {eventType: Cesium.CameraEventType.RIGHT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL}
];
viewer.scene.screenSpaceCameraController.zoomEventTypes = [
  Cesium.CameraEventType.MIDDLE_DRAG, Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH
];
viewer.scene.camera.setView({destination: new Cesium.Cartesian3.fromDegrees(107.515637, 31.105743, 22844209)});

let colors = [
  "#7CCC00",
  "#7DCC00",
  "#7ECD00",
  "#80CD00",
  "#82CE00",
  "#84CE00",
  "#ACD800",
  "#B5DA00",
  "#B7DB00",
  "#B9DB00",
  "#DFE400",
  "#E1E400",
  "#E6D612",
  "#E8C133",
  "#E9BC3C",
  "#E9BB3E",
  "#E9BB40",
  "#EABB40",
  "#EB9940",
  "#EB9940",
  "#ee646c",
  "#f06464",
  "#fa5050",
  "rgb(254,50,50)",
  "#ff0000"
];

let fileEntity = {};

let fileListEntity = {
  date: "20201212",
  temperature: true,
  salty: true,
  density: true,
  sound_Speed: false,
  flow: true
};


function getFileList() {
  $.ajax({
    type: "POST",
    url: getContextPath() + "/search/getFileList",
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify(fileListEntity),
    success(result) {
      switch (result.code) {
        case 200:
          for (let i = 0; i < result.data.length; i++) {
            switch (result.data[i].fileType) {
              case "tt":
                if (result.data[i].temperature.date !== null && result.data[i].temperature.fileName !== null) {
                  $tableTbody.append("<tr><td>" + dateFormula(result.data[i].temperature.date) + "</td><td>" +
                    result.data[i].temperature.fileName + "</td></tr>");
                }
                break;
              case "ss":
                if (result.data[i].salty.date !== null && result.data[i].salty.fileName !== null) {
                  $tableTbody.append("<tr><td>" + dateFormula(result.data[i].salty.date) + "</td><td>" +
                    result.data[i].salty.fileName + "</td></tr>");
                }
                break;
              case "flow":
                if (result.data[i].flow.date !== null && result.data[i].flow.fileName !== null) {
                  $tableTbody.append("<tr><td>" + dateFormula(result.data[i].flow.date) + "</td><td>" +
                    result.data[i].flow.fileName + "</td></tr>");
                }
                break;
              case "density":
                if (result.data[i].density.date !== null && result.data[i].density.fileName !== null) {
                  $tableTbody.append("<tr><td>" + dateFormula(result.data[i].density.date) + "</td><td>" +
                    result.data[i].density.fileName + "</td></tr>");
                }
                break;
              case "soundSpeed":
                if (result.data[i].sound_SPEED.date !== null && result.data[i].sound_SPEED.fileName !== null) {
                  $tableTbody.append("<tr><td>" + dateFormula(result.data[i].sound_SPEED.date) + "</td><td>" +
                    result.data[i].sound_SPEED.fileName + "</td></tr>");
                }
                break;
            }
          }
          break;
        case 500:
          alert("未找到文件，请确认文件是否存在！");
          break;
      }
    },
    error() {
      alert("fail");
    }
  });
}

function dateFormula(date) {
  return date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8);
}

function applyImageMaterial(primitive) {
  primitive.appearance.material = new Cesium.Material({
    fabric: {
      type: "Image",
      uniforms: {
        image: "../images/Cesium_Logo_Color.jpg"
      }
    }
  });
}

function drawSound() {
  $.ajax({
    type: "POST",
    url: getContextPath() + "/search/getTxtData",
    contentType: "application/json;charset=UTF-8",
    data: JSON.stringify(fileEntity),
    success(result) {
      switch (result.code) {
        case 200:
          let tricon = d3.tricontour();
          let contourS = tricon(result.data);
          handleSoundData(contourS);
          break;
        case 500:
          alert("未找到文件，请确认文件是否存在！");
          break;
      }
    },
    error() {
      alert("fail");
    }
  });
}

function handleSoundData(obj) {
  let polyArr = [];
  obj.forEach((contour, i) => {
    contour.coordinates.forEach(coordinate => {
      let coordinatePoly = [];
      coordinate.forEach(c => {
        let poly = [];
        c.forEach(arr => {
          poly[poly.length] = arr[0];
          poly[poly.length] = arr[1];
        });
        coordinatePoly[coordinatePoly.length] = poly;
      });
      addPoly(polyArr, coordinatePoly, i + 2, contour.value);
    });
  });
  polyArr.reverse().forEach(poly => viewerAdd(poly));
}

let level = 1;

let colorOffset = 0;
let coloriMax = -9999;
let coloriMin = 9999;
let colorbarMax = -9999;
let colorbarMin = 9999;
let ratio;

