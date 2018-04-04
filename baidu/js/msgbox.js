//****这里有所有和聊天窗口有关的函数*****//

function newMsgbox(map, center, width, height, text, imgsrc,username) {
    var msgbox = new Msgbox(center, width, height, text, imgsrc,username);
    map.addOverlay(msgbox);
}

function setDialog(){
    
}

// 定义自定义覆盖物的构造函数  
function Msgbox(point, width, height, text, imgsrc,username) {
    this._point = point;
    this._width = width;
    this._height = height;
    this._text = text;
    this._imgsrc = imgsrc;
    this._length = width;
    this._username = username
}
// 继承API的BMap.Overlay
Msgbox.prototype = new BMap.Overlay();
// 实现初始化方法  
Msgbox.prototype.initialize = function(map) {
    // 保存map对象实例
    this._map = map;
    // 创建div元素，作为自定义覆盖物的容器
    var div = document.createElement("div");
    div.className = div.className + "msgbox"
    div.style.position = "absolute";
    div.style.width = this._width + "px";
    div.style.height = this._height + "px";
    div.style.cursor = "pointer";
    // div.style.zIndex = "999"; 
    
    function msgboxClick() {
        $("#dialogUserimg")[0].src = this.childNodes[0].childNodes[0].childNodes[0].childNodes[0].src;
        $("#dialogPassage")[0].innerHTML = this.childNodes[0].childNodes[1].childNodes[0].innerHTML;
        $("#dialogUsername")[0].innerHTML = this.childNodes[0].childNodes[0].childNodes[1].innerHTML;
        $("#dialogWindow")[0].style.visibility = "visible";
    };
    div.addEventListener("click",msgboxClick,false);
    div.addEventListener("touchstart",msgboxClick,false);

    var img = document.createElement("img");
    img.src = this._imgsrc;
    img.className = img.className + " headimg";
    img.onerror = function(){
        $(this).attr('src', "img/default.jpg");
    };

    var imgdiv = document.createElement("div");
    imgdiv.className = imgdiv.className + " circle-small";
    imgdiv.appendChild(img);

    var username = document.createElement("b");
    username.innerHTML = this._username;
    username.className = username.className + "username";

    var userbox = document.createElement("div");
    userbox.className = userbox.className + "userbox";
    userbox.appendChild(imgdiv);
    userbox.appendChild(username);


    var arrow = document.createElement("div");
    arrow.className = div.className + " triangle_down";
    // arrow.style.top = "-25px";
    arrow.style.position = 'relative';
    arrow.style.left = "25px";

    var textbox = document.createElement("div");
    textbox.className = textbox.className + " textbox" + " md-shadow-card-restingState";
    textbox.style.width = this._width + "px";
    if (this._height != 0)
        textbox.style.height = this._height + "px";

    var text = document.createElement("p");
    text.innerHTML = this._text;
    text.className = text.className + ' text';

    var controlbox = document.createElement('div');
    controlbox.className = controlbox.className + "controlbox";

    var replynum = document.createElement('p');
    replynum.style.fontSize = "12px";
    replynum.innerHTML = "0";
    replynum.style.margin = "2px";

    var replyicon = document.createElement('i');
    replyicon.innerHTML = "chat";
    replyicon.className = "material-icons";
    replyicon.style.fontSize = "12px";
    controlbox.appendChild(replyicon);
    controlbox.appendChild(replynum);

    var passagebox = document.createElement('div');
   	passagebox.appendChild(text);
   	passagebox.className = passagebox.className + "passagebox";

    textbox.appendChild(userbox);
    textbox.appendChild(passagebox);
    textbox.appendChild(controlbox);


    div.appendChild(textbox);
    div.appendChild(arrow);


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
    this._div.style.left = pixel.x - 35.5 + "px";
    // 
    this._div.style.top = pixel.y - parseInt(this._div.style.height) - 10 + "px";
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