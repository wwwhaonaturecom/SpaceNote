//****这里有所有和聊天窗口有关的函数*****//

function newMsgbox(map, center, width, height, text, imgsrc,username) {
    var msgbox = new Msgbox(center, width, height, text, imgsrc,username);
    map.addOverlay(msgbox);
}

function setDialog(){
    
}

function generateRplyboxDiv(username, message){
    var replybox = document.createElement("div");
    replybox.className = "dialog-screen md-shadow-dialogs";
    var replyuserbox = document.createElement("div");
    replyuserbox.className = replyuserbox.className + "dialog-userbox";
    var replyuserheadimg = document.createElement("div");
    replyuserheadimg.className = replyuserheadimg.className + "circle dialog-headimgbox";
    var headimg = document.createElement("img");
    headimg.className = headimg.className + "userimg headimg";
    headimg.onerror = function(){
        $(this).attr('src', "img/default.jpg");
    };
    headimg.src = "img/" + username + ".png";
    replyuserheadimg.appendChild(headimg);
    replyuserbox.appendChild(replyuserheadimg);
    var username = document.createElement("p");
    username.className = username.className + "dialog-username";

    var replymessagebox = document.createElement("div");
    replymessagebox.className = replymessagebox.className + "dialog-passagebox";
    var message = document.createElement("p");
    message.className = message.className + "dialog-passage";
    message.innerHTML = message;
    replymessagebox.appendChild(message);

    var replycontrolbox = document.createElement("div");
    replycontrolbox.className = replycontrolbox.className + "dialog-controlbox";
    var replybutton = document.createElement("a");
    replybutton.className = replybutton.className + "waves-effect waves-light btn";
    replybutton.innerHTML = "回复";
    replycontrolbox.appendChild(replybutton);

    replybox.appendChild(replyuserbox);
    replybox.appendChild(replymessagebox);
    replybox.appendChild(replycontrolbox);

    return replybox;
}

// 定义自定义覆盖物的构造函数  
function Msgbox(point, width, height, text, imgsrc, username, time, id) {
    this._id = id;
    this._time = time;
    this._point = point;
    this._width = 150;
    this._height = 100;
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
        $("#blurOverlay")[0].style.visibility = "visible";
        this.style.zIndex = this.style.zIndex + 10000; 
        REPLYID = this.id;
        var data = loadReply(REPLYID);
        for(item in data){
            var replydiv = generateRplyboxDiv(data[item].Uname, data[item].Note);
            $("#replyScreen")[0].appendChild(replydiv);
        }
    };
    div.addEventListener("click",msgboxClick,false);
    div.addEventListener("touchstart",msgboxClick,false);
    div.id = this._id;

    var img = document.createElement("img");
    img.src = "img/" + this._username + ".png";
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

    var messagetime = document.createElement("p");
    messagetime.className = "messagetime";
    messagetime.innerHTML = this._time;
    messagetime.style.fontSize = "12px";
    messagetime.style.margin = "2px";

    controlbox.appendChild(messagetime);
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