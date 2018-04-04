//已登陆后的欢迎文字
function welcome() {
    var Uname;
    if(sessionStorage["loginStatus"] == "true") {
        Uname = sessionStorage["Uname"];
        $("p.welcome").html("你好！"+Uname);
    }    
}


//阻止冒泡
function stopPropagation(e) {
    e.stopPropagation();
}

function post_show () {    
    if(updatingGPS == 1 || $("#gpsicon")[0].innerHTML != "gps_fixed"){
        alert("GPS定位失败");
        return;
    }
	var postWindow = document.getElementById("postWindow");
	var blurOverlay = document.getElementById("blurOverlay");
	if(postWindow.style.visibility == 'hidden'){
		postWindow.style.visibility = 'visible';
		blurOverlay.style.visibility = 'visible';
	}
	else{
		postWindow.style.visibility = 'hidden';
		blurOverlay.style.visibility = 'hidden';
    }
    map.setZoom(19);
    
    bpos = convertPointG2B(position);
    map.panTo(bpos);
    
}

function satellite(){
    $("div[title='显示卫星影像']")[0].onclick();
    $(":contains('卫星')").trigger("select");
}

function setmap(type){
    if(type == "satellite"){
        $("div[title='显示卫星影像']")[0].onclick();
        $("#satellitemap").addClass("active");
        $("#digitalmap").removeClass("active");
    }

    if(type == "digital"){
        $("div[title='显示普通地图']")[0].onclick();
        $("#digitalmap").addClass("active");
        $("#satellitemap").removeClass("active");
    }

}

///////////////////////////////////////
///           customPoint           ///
///          支持自定义div           ///
///////////////////////////////////////
function customPoint(point, div) {
    this._point = point;
    this._div = div;
}

customPoint.prototype = new BMap.Overlay();
// 实现初始化方法  
customPoint.prototype.initialize = function(map) {
    // 保存map对象实例
    this._map = map;
    
    // 将div添加到覆盖物容器中
    map.getPanes().markerPane.appendChild(this._div);
    return this._div;
}

// 实现绘制方法   
customPoint.prototype.draw = function() {
    // 根据地理坐标转换为像素坐标，并设置给容器    
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x - parseInt(this._div.style.width)/2 + "px";
    // 
    this._div.style.top = pixel.y - parseInt(this._div.style.height)/2 + "px";

}

// 实现显示方法    
customPoint.prototype.show = function() {
        if (this._div) {
            this._div.style.display = "";
        }
    }
    // 实现隐藏方法  
customPoint.prototype.hide = function() {
        if (this._div) {
            this._div.style.display = "none";
        }
    }
    // 添加自定义方法   
customPoint.prototype.toggle = function() {
    if (this._div) {
        if (this._div.style.display == "") {
            this.hide();
        } else {
            this.show();
        }
    }
}

customPoint.prototype.updatePoint = function(point) {
    this._point = point;
}

////////////////////////////////////////////
////            定位功能                ////
///////////////////////////////////////////

function convertPointG2B(Gpoint) {
    var Cpoint_arr = coordtransform.wgs84togcj02(Gpoint.lng, Gpoint.lat);
    var Bpoint_arr = coordtransform.gcj02tobd09(Cpoint_arr[0], Cpoint_arr[1]);
    var Bpoint = new BMap.Point(Bpoint_arr[0], Bpoint_arr[1]);
    return Bpoint;
}


function updatePosition(pos) {
    if(positionCache != undefined && positionCache.coords.longitude == pos.coords.longitude && positionCache.coords.latitude == pos.coords.latitude)return;
    else positionCache = pos;
    //alert("updateLocation");
    position = new BMap.Point(pos.coords.longitude,pos.coords.latitude);
    var bpos = new convertPointG2B(position);
    myPoint.updatePoint(bpos);
    myPoint.show();
    map.setZoom(18);    
    map.panTo(bpos);  
    myPoint.draw();
    updatingGPS = 0;
    $("#gpsicon").removeClass("loading");    
}

function showError(error)
  {
  switch(error.code)
    {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
    }
    $("#gpsicon")[0].innerHTML = "gps_off";
    clearInterval(updateLocationInterval);    
    $("#gpsicon").removeClass("loading");    
  }

function gpsOn() {
    clearInterval(updateLocationInterval); 
    var geo_options = {
        enableHighAccuracy: true, 
        maximumAge        : 30000, 
        timeout           : 27000
      };
    //alert("getLocation");
    if($("#gpsicon")[0].innerHTML != "gps_fixed"){
        $("#gpsicon")[0].innerHTML = "gps_fixed";
        watchingPosition = navigator.geolocation.watchPosition(updatePosition, showError, geo_options);
        updatingGPS = 1;
        $("#gpsicon").addClass("loading");
        // updateLocationInterval = self.setInterval(function(){
        //     if(updatingGPS == 1)return;
        //     if (navigator.geolocation) {
        //         navigator.geolocation.getCurrentPosition(updatePosition,showError);
        //         updatingGPS = 1;
        //         $("#gpsicon").addClass("loading");
        //     } else {
        //         position = null;
        //         myPoint.hide();
        //         alert("broswer not support");
        //         $("#gpsicon")[0].innerHTML = "gps_off";
        //         clearInterval(updateLocationInterval);
        //     }
        // },1000);
    }
    else{
        $("#gpsicon")[0].innerHTML = "gps_not_fixed";
        $("#gpsicon").removeClass("loading");
        navigator.geolocation.clearWatch(watchingPosition);
    }
}

//设置一个坐标点对象
function Point(Lng, Lat) {
    this.Lng = Lng;
    this.Lat = Lat;
}


////////////////////////////////////////////
////            程序入口                ////
///////////////////////////////////////////
var updateLocationInterval;
var updatingGPS = 0;
var watchingPosition;
var positionCache;

//若已登陆设置用户欢迎窗口
welcome();

$(function() {  
    FastClick.attach(document.body);  
});  

$(".placeHolder")[0].style.height = document.body.clientHeight/2 - 230 + 'px';

center = new Point(121.209, 31.2895);
var map = new BMap.Map("container", {
    enableMapClick: false
});
// 创建地图实例  

var Bcenter = new BMap.Point(center.Lng, center.Lat);
var result = convertPointG2B(Bcenter);
// 创建点坐标  
map.centerAndZoom(result, 17);
map.addControl(new BMap.MapTypeControl({
    mapTypes:[
      BMAP_SATELLITE_MAP,
      BMAP_NORMAL_MAP,
      BMAP_HYBRID_MAP
    ]}));	
map.enableDragging();
map.enableScrollWheelZoom(true);
map.setCenter(result);
map.panTo(result);
// 初始化地图，设置中心点坐标和地图级别

// alerted = 0;
// var set_locate=self.setInterval("setLocation()",1000);


// 添加自定义覆盖物  
var range = 1; //设置范围 单位 度
var data = loadData(center.Lng, center.Lat, range); //加载数据点
var msgboxHandle = new Array();
var msgboxNum = 0;

// for (item in data) {
//     var itemCoord_G = new BMap.Point(data[item].Lng, data[item].Lat);
//     var itemCoord_B = convertPointG2B(itemCoord_G);
//     var itemPicSrc = "img/" + data[item].UID.toString() + ".png";
//     msgboxHandle[msgboxNum] = new Msgbox(itemCoord_B, 80, 80, data[item].Note, itemPicSrc, data[item].Uname);
//     map.addOverlay(msgboxHandle[msgboxNum]);
//     msgboxNum++;
// }

//slider selector
$(function () {
    $("#slider").slider({
        range: "min",
        value: 0,
        min: -14,
        max: 0,
        step: 1,
        slide: function (event, ui) {
            if(ui.value == 0)
                $("#timelineLabel")[0].innerHTML = "时间轴:今天";
            else if(ui.value == -1)
                $("#timelineLabel")[0].innerHTML = "时间轴:昨天";
            else if(ui.value == -2)
                $("#timelineLabel")[0].innerHTML = "时间轴:前天";
            else{
                var date = new Date();
                date.setDate(date.getDate() + ui.value);
                var month = date.getMonth() + 1;
                var day = date.getDate();
                $("#timelineLabel")[0].innerHTML = "时间轴:"+month+"月"+day+"日";
            }
                        
            //delete message
            if(msgboxNum != 0){
                map.clearOverlays();
                msgboxNum = 0; 
                msgboxHandle = [];
            }
            
            //load message
            var range = 1;
            var data = loadData(center.Lng, center.Lat, range, ui.value);
            for (item in data) {
                var itemCoord_G = new BMap.Point(data[item].Lng, data[item].Lat);
                var itemCoord_B = convertPointG2B(itemCoord_G);
                var itemPicSrc = "img/" + data[item].UID.toString() + ".png";
                msgboxHandle[msgboxNum] = new Msgbox(itemCoord_B, 150, 100, data[item].Note, itemPicSrc, data[item].Uname);
                map.addOverlay(msgboxHandle[msgboxNum]);
                msgboxNum++;
            }
            map.addOverlay(myPoint);
        }
    });
    $("#selected-date").val($("#slider").slider("value"));
});


// newMsgbox(map,Bcenter,100 ,100,"原始坐标（WGS84）","res/1.png");
// var msgbox = new Msgbox(Bcenter, 150, 100, "原始坐标（WGS84）", "res/1.png" , "azuse");
// map.addOverlay(msgbox);
// var marker2 = new BMap.Marker(Bcenter);
// map.addOverlay(marker2);

// newMsgbox(map, result, 150, 100, "转换坐标（BD）一大段测试文字来测试文本框最多能放多少字", "res/2.png" , "azuse");
// var marker = new BMap.Marker(result);
// map.addOverlay(marker);
var point2 = new BMap.Point(result.lng + 0.1, result.lat + 0.1);
// newMsgbox(map, point2, 150, 100, "测试", "res/3.png" , "azuse");



var position = point2;
var myPointDiv = document.createElement("div");
myPointDiv.id = 'myPointDiv';
myPointDiv.className = myPointDiv.className + "myPoint";
myPointDiv.style.height = '20px';
myPointDiv.style.width = '20px';
myPointDiv.style.position = 'absolute';
myPointDiv.style.zIndex = '10000';
var myPoint = new customPoint(position, myPointDiv);
map.addOverlay(myPoint);
myPoint.hide();

gpsOn();

