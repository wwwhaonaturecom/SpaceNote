//已登陆后的欢迎文字
function welcome() {
    var Uname;
    if(sessionStorage["loginStatus"] == "true") {
        Uname = sessionStorage["Uname"];
        $("p.welcome").html("你好！"+Uname);
    }
}
welcome();  //调用

//阻止冒泡
function stopPropagation(e) {
    e.stopPropagation();
}




///////////////////////////////////////
///            customPoint              ///
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
    this._div.style.left = pixel.x + "px";
    // 
    this._div.style.top = pixel.y - parseInt(this._div.style.height) + "px";

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


function convertPointG2B(Gpoint) {
    var Cpoint_arr = coordtransform.wgs84togcj02(Gpoint.lng, Gpoint.lat);
    var Bpoint_arr = coordtransform.gcj02tobd09(Cpoint_arr[0], Cpoint_arr[1]);
    var Bpoint = new BMap.Point(Bpoint_arr[0], Bpoint_arr[1]);
    return Bpoint;
}


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(updatePosition);
    } else {
        position = null;
    }
}

function updatePosition(pos) {
    position = new BMap.Point(pos.coords.longitude,pos.coords.latitude);
    var bpos = new convertPointG2B(position);
    myPoint.updatePoint(bpos);
    myPoint.draw();
    var h1 = document.getElementById("alert");
    if (h1 != null && pos != null)
        h1.innerHTML = pos.coords.longitude.toString() + " " + pos.coords.latitude.toString();

}


//设置一个坐标点对象
function Point(Lng, Lat) {
    this.Lng = Lng;
    this.Lat = Lat;
}
center = new Point(121.582086, 31.273069);
var map = new BMap.Map("container", {
    enableMapClick: false
});
// 创建地图实例  

var Bcenter = new BMap.Point(center.Lng, center.Lat);
var result = convertPointG2B(Bcenter);
// 创建点坐标  
map.centerAndZoom(Bcenter, 15);
map.enableDragging();
map.enableScrollWheelZoom(true);
map.setCenter(result);
map.panTo(result);
// 初始化地图，设置中心点坐标和地图级别

// alerted = 0;
// var set_locate=self.setInterval("setLocation()",1000);


// 添加自定义覆盖物  
var range = 1; //设置范围
var data = loadData(center.Lng, center.Lat, range); //加载数据点
var msgboxHandle = new Array();
var msgboxId = 0;

for (item in data) {
    var itemCoord = new BMap.Point(data[item].Lng, data[item].Lat);
    var itemSrc = data[item].UID.toString() + ".jpg";
    msgboxHandle[msgboxId] = new Msgbox(itemCoord, 100, 100, data[item].Note, itemSrc);
    map.addOverlay(msgboxHandle[msgboxId]);
    msgboxId++;
}
//
//newMsgbox(map,Bcenter,100 ,100,"原始坐标（WGS84）","res/1.png");
var msgbox = new Msgbox(Bcenter, 150, 100, "原始坐标（WGS84）", "res/1.png" , "azuse");
map.addOverlay(msgbox);
var marker2 = new BMap.Marker(Bcenter);
map.addOverlay(marker2);

newMsgbox(map, result, 150, 100, "转换坐标（BD）一大段测试文字来测试文本框最多能放多少字", "res/2.png" , "azuse");
var marker = new BMap.Marker(result);
map.addOverlay(marker);
var point2 = new BMap.Point(result.lng + 0.1, result.lat + 0.1);
newMsgbox(map, point2, 150, 100, "测试", "res/3.png" , "azuse");



var position = point2;
var myPointDiv = document.createElement("div")
myPointDiv.id = 'myPointDiv'
myPointDiv.style.backgroundColor = 'blue';
myPointDiv.className = myPointDiv.className + "circle_small";
myPointDiv.style.height = '20px';
myPointDiv.style.width = '20px';
myPointDiv.style.position = 'absolute';
var myPoint = new customPoint(position, myPointDiv);
map.addOverlay(myPoint);
getLocation();
