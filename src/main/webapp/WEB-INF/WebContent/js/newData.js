$(() => {
    getHt();
    function getHt(){
        var all_height=$(window).height();
        var div_height=all_height-80;
        $("#car_control").css("height",div_height+"px");
    }
    //地图区域切换
    $("#btnMap1").on("click", () => {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(180, 25, 33000000)
        });
    });
    $("#btnMap2").on("click", () => {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(72.5, 15, 22844209)
        });
    });
    $("#btnMap3").on("click", () => {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(140, 25, 22844209)
        });
    });
    //各个板块显示
    $("#btn_one").on("click", function () {
        $("#chonggou").css("display", "block");
        $("#fangzhen").css("display", "none");
        $("#first").css("display", "none");
        $("#userControl").css("display", "none");
        $("#database").css("display", "none");
        $("#vision").css("display", "none");
    });
    $("#btn_two").on("click", function () {
        $("#chonggou").css("display", "none");
        $("#fangzhen").css("display", "none");
        $("#first").css("display", "block");
        $("#userControl").css("display", "none");
        $("#database").css("display", "none");
        $("#vision").css("display", "none");
    });
    $("#btn_three").on("click", function () {
        $("#chonggou").css("display", "none");
        $("#fangzhen").css("display", "block");
        $("#first").css("display", "none");
        $("#userControl").css("display", "none");
        $("#database").css("display", "none");
        $("#vision").css("display", "none");
    });
    $("#btn_four").on("click", function () {
        $("#chonggou").css("display", "none");
        $("#fangzhen").css("display", "none");
        $("#first").css("display", "none");
        $("#userControl").css("display", "block");
        $("#database").css("display", "none");
        $("#vision").css("display", "none");
    });
    $("#btn_five").on("click", function () {
        $("#chonggou").css("display", "none");
        $("#fangzhen").css("display", "none");
        $("#first").css("display", "none");
        $("#userControl").css("display", "none");
        $("#database").css("display", "block");
        $("#vision").css("display", "none");
    });
    //可视化界面控制
    $("#popDown").on("click", function () {
        $("#sidebar").css("display", "block");
        $("#popDown").css("display", "none");
    });
    $("#closeNav").on("click", function () {
        $("#sidebar").css("display", "none");
        $("#popDown").css("display", "block");
    });
    $("#mySidenav").on("click", function () {
        $("#echarts_pop").css("width", "280px");
        $("#main").css("backgroundColor", "black");
        $("#myNavExit").css("display", "block");
        $("#main_title").css("width", "1207px");
    });
    $("#myNavExit").on("click", function () {
        $("#echarts_pop").css("width", "0");
        $("#main").css("width", "100%")
            .css("marginLeft", "0");
        $("#myNavExit").css("display", "none");
        $("#main_title").css("width", "100%");
    });
    window.isEchartsMode = false;
    $("#echartsShow").on("click", function () {
        window.isEchartsMode = !window.isEchartsMode;
        if (window.isEchartsMode) {
            $("#colorBarContainerCesium").slideUp("fast");
            $("#colorBarContainerEcharts").slideDown("fast");
        } else {
            $("#colorBarContainerEcharts").slideUp("fast");
            $("#colorBarContainerCesium").slideDown("fast");
        }
        $("#mySidenav").css("display", "block");
        $("#main").css("display", "block")
            .css("backgroundColor", "black");
        $("#myNavExit").css("display", "block");
        $("#btnMap1").css("display", "none");
        $("#btnMap2").css("display", "none");
        $("#btnMap3").css("display", "none");
        $("#sidebar").css("display", "none");
        $("#popDown").css("display", "block");
    });
});