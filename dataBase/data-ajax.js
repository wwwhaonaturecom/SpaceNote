///////////////////////////////////////
//与服务器请求数据时的ajax部分
//回传数据为json格式的字符串 jsonData中为转换后的json数组
//kagaya 2018年4月1日
//////////////////////////////////////
const uploadURL = "../dataBase/upload.php";
const downloadURL = "../dataBase/download.php";
const addReplyURL = "../dataBase/add_reply.php";
const loadReplyURL = "../dataBase/load_reply.php";

function loadData(Lng, Lat, Rng, Slt = 0) { //Rng为距离中心点的距离（水平竖直方向）
    var jsonData;

    $.ajax({
        url: downloadURL,        
        type: "get",
        dataType: "json",
        async: false,
        data: "Longitude="+Lng+"&Latitude="+Lat+"&Range="+Rng+"&Select="+Slt,
        success: function(data,status){
            jsonData = eval(data);          //将data字符串转换为json数组       
        },
        error: function (XMLHttpRequest, textStatus, errorThrown){
            $(".nearby-data").append("status:" + XMLHttpRequest.status + "\n" + textStatus + "</td></tr>");    
        }
    });
    return jsonData;
}


function uploadData() {

    if(sessionStorage["loginStatus"] == "true" && $("#gpsicon")[0].innerHTML == "gps_fixed"){
        var UID, Uname, Note, Lng, Lat, Alt;
        var bpos = new convertPointG2B(position);
        //UID = sessionStorage.getItem("UID");
        UID = "1650275";    //test
        Uname = sessionStorage.getItem("Uname");
        Note = document.getElementById("post-input").value;
        Lng = position.lng;
        Lat = position.lat;
        Alt = 0;
        var itemPicSrc = UID.toString() + ".png";

        if(Note == "") {
            alert("请输入留言");
            return 
        }

        $.ajax({
            url: uploadURL,        
            type: "post",
            dataType:"text",
            async: false,
            data: {"UID": UID, "Uname": Uname,"Note" : Note, "Lng": Lng, "Lat": Lat, "Alt": Alt},
            success: function(result){
                document.getElementById("post-input").value = "";
                msgboxHandle[msgboxNum] = new Msgbox(bpos, 150, 100, Note, itemPicSrc, Uname);
                map.addOverlay(msgboxHandle[msgboxNum]);
                msgboxNum++;
                hide_all();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown){
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(textStatus);
            }
        });
    }
    else if(sessionStorage["loginStatus"] != "true")alert("请先登录");
    else if($("#gpsicon")[0].innerHTML != "gps_fixed")alert("gps定位失败");
}

function loadReply(replyID) { //Rng为距离中心点的距离（水平竖直方向）
    var jsonData;

    $.ajax({
        url: loadReplyURL,        
        type: "post",
        dataType: "json",
        async: false,
        data: {"replyID": replyID},
        success: function(data,status){
            jsonData = eval(data);          //将data字符串转换为json数组       
        },
        error: function (XMLHttpRequest, textStatus, errorThrown){
            $(".nearby-data").append("status:" + XMLHttpRequest.status + "\n" + textStatus + "</td></tr>");    
        }
    });

    return jsonData;
}

function addReply() {

    if(sessionStorage["loginStatus"] == "true"){
        var replyID, UID, Uname, Note;
        //UID = sessionStorage.getItem("UID");
        replyID = REPLYID;
        UID = "1650275";    //test
        Uname = sessionStorage.getItem("Uname");
        Note = $("#replycontent")[0].value;
        
        if(Note == "") {
            alert("请输入回复");
            return 
        }

        $.ajax({
            url: addReplyURL,        
            type: "post",
            dataType:"text",
            async: false,
            data: {"replyID": replyID, "UID": UID, "Uname": Uname,"Note" : Note},
            success: function(result){
                $("#replycontent")[0].value = "";
        
                var data = loadReply(REPLYID);
                $("#replyScreen")[0].innerHTML = "";
                
                for(item in data){
                    var replydiv = generateRplyboxDiv(data[item].Uname, data[item].Content);
                    $("#replyScreen")[0].appendChild(replydiv);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown){
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(textStatus);
            }
        });


    }
    else if(sessionStorage["loginStatus"] != "true")alert("请先登录");
}