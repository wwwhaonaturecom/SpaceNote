
//阻止冒泡
function stopPropagation(e) {
    e.stopPropagation();
}


function newMsgbox(map, center, width, height, text, imgsrc) {
    var msgbox = new Msgbox(center, width, height, text, imgsrc);
    map.addOverlay(msgbox);
}


// 定义自定义覆盖物的构造函数  
function Msgbox(point, width, height, text, imgsrc) {
    this._point = point;
    this._width = width;
    this._height = height;
    this._text = text;
    this._imgsrc = imgsrc;
    this._length = width;
}
// 继承API的BMap.Overlay
Msgbox.prototype = new BMap.Overlay();
// 实现初始化方法  
Msgbox.prototype.initialize = function(map) {
    // 保存map对象实例
    this._map = map;
    // 创建div元素，作为自定义覆盖物的容器
    var div = document.createElement("div");
    div.style.position = "absolute";
    // div.style.zIndex = "999"; 
    div.onclick = function() {
        alert('success');
    };


    var img = document.createElement("img");
    img.src = this._imgsrc;
    img.className = img.className + " headimg";

    var imgdiv = document.createElement("div");
    imgdiv.className = imgdiv.className + " circle";
    imgdiv.style.position = 'relative';
    imgdiv.style.left = "6px";
    imgdiv.style.top = '4px';
    imgdiv.appendChild(img);


    var arrow = document.createElement("div");
    arrow.className = div.className + " triangle_down";
    // arrow.style.top = "-25px";
    arrow.style.position = 'relative';
    arrow.style.left = "25px";

    var textbox = document.createElement("div");
    textbox.className = textbox.className + " textbox";
    textbox.style.width = this._width + "px";
    if (this._height != 0)
        textbox.style.height = this._height + "px";


    var text = document.createElement("p");
    text.innerHTML = this._text;
    text.className = text.className + ' text';
    var textheight = this._height - 20;
    text.style.height = textheight + "px";
    var textwidth = this._width - 40;
    text.style.width = textwidth + "px";


    textbox.appendChild(text);

    div.appendChild(textbox);
    div.appendChild(arrow);
    div.appendChild(imgdiv);

    div.style.width = this._length + "px";
    div.style.height = this._length + "px";


    // 将div添加到覆盖物容器中
    map.getPanes().markerPane.appendChild(div);
    // 保存div实例
    this._div = div;
    // 需要将div元素作为方法的返回值，当调用该覆盖物的show、
    // hide方法，或者对覆盖物进行移除时，API都将操作此元素。
    return div;
}

// 实现绘制方法   
Msgbox.prototype.draw = function() {
    // 根据地理坐标转换为像素坐标，并设置给容器    
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x - 32 + "px";
    // 通过精确的计算得到的32和39
    this._div.style.top = pixel.y - parseInt(this._div.style.height) - 39 + "px";

}

// 实现显示方法    
Msgbox.prototype.show = function() {
        if (this._div) {
            this._div.style.display = "";
        }
    }
    // 实现隐藏方法  
Msgbox.prototype.hide = function() {
        if (this._div) {
            this._div.style.display = "none";
        }
    }
    // 添加自定义方法   
Msgbox.prototype.toggle = function() {
    if (this._div) {
        if (this._div.style.display == "") {
            this.hide();
        } else {
            this.show();
        }
    }
}

///////////////////////////////////////
///            customPoint              ///
///          支持自定义div           ///
///////////////////////////////////////
function customPoint(point, div) {
    this._point = point
    this._div = div
}

customPoint.prototype = new BMap.Overlay();
// 实现初始化方法  
customPoint.prototype.initialize = function(map) {
    // 保存map对象实例
    this._map = map;

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
    position = pos;
    myPoint.updatePoint(pos);
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
var msgbox = new Msgbox(Bcenter, 100, 100, "原始坐标（WGS84）", "res/1.png");
map.addOverlay(msgbox);
var marker2 = new BMap.Marker(Bcenter);
map.addOverlay(marker2);

newMsgbox(map, result, 100, 100, "转换坐标（BD）", "res/2.png");
var marker = new BMap.Marker(result);
map.addOverlay(marker);
var point2 = new BMap.Point(result.lng + 0.1, result.lat + 0.1);
newMsgbox(map, point2, 100, 100, "测试", "res/3.png");



var position = point2;
var myPointDiv = document.createElement("div")
myPointDiv.id = 'myPointDiv'
myPointDiv.style.backgroundColor = 'red';
myPointDiv.className = myPointDiv.className + "circle";
myPointDiv.style.height = '100px';
myPointDiv.style.width = '100px';
var myPoint = new customPoint(position, myPointDiv)
map.addOverlay(myPoint)
getLocation();