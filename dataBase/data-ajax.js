///////////////////////////////////////
//与服务器请求数据时的ajax部分
//回传数据为json格式的字符串 jsonData中为转换后的json数组
//如需在其他位置使用时请设为全局变量
//上传数据部分暂未完成测试
//kagaya 2018年2月1日
//////////////////////////////////////
const uploadURL = "../dataBase/upload.php";
const downloadURL = "../dataBase/download.php";

function loadData(Lng, Lat, Rng, Ref = false) { //Rng为距离中心点的距离（水平竖直方向）
    var jsonData;//可设为全局变量
    if (Ref == true) {//清空表
        $(".nearby-data").empty();
        return null;
    }

    // xmlhttp = getXMLHttpRequest();

    $.ajax({
        url: downloadURL,        
        type: "get",
        dataType: "json",
        async: false,
        data: "Longitude="+Lng+"&Latitude="+Lat+"&Range="+Rng,
        success: function(data,status){
            jsonData = eval(data);          //将data字符串转换为json数组       
                 
        },
        error: function (XMLHttpRequest, textStatus, errorThrown){
            $(".nearby-data").append("<tr><td>status:" + XMLHttpRequest.status + "</td><td>" + textStatus + "</td></tr>");    
        }
    });
    return jsonData;
    
    // xmlhttp.open("GET", downloadURL + "?Longitude=" + Lng + "&Latitude=" + Lat + "&sid=" + Math.random(), true);
    // xmlhttp.send();
}

//
function uploadData() {

    if(sessionStorage["loginStatus"] == "true" && $("#gpsicon")[0].innerHTML == "gps_fixed"){
        var UID, Uname, Note, Lng, Lat, Alt;
        var bpos = new convertPointG2B(position);
        //UID = sessionStorage.getItem("UID");
        UID = "1650275";    //test
        Uname = sessionStorage.getItem("Uname");
        Note = document.getElementById("post-input").value;
        Lng = bpos.Lng;
        Lat = bpos.Lat;
        Alt = 0;
        var itemPicSrc = UID.toString() + ".png";
        msgboxHandle[msgboxNum] = new Msgbox(bpos, 150, 100, Note, itemPicSrc, Uname);
        map.addOverlay(msgboxHandle[msgboxNum]);
        msgboxNum++;

        $.ajax({
            url: uploadURL,        
            type: "post",
            async: false,
            data: {"UID": UID, "Uname": Uname,"Note" : Note, "Lng": Lng, "Lat": Lat, "Alt": Alt},
            success: function(result){
                alert(result);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown){
                alert(textStatus);
            }
        });
    }
    else if(sessionStorage["loginStatus"] != "true")alert("请先登录");
    else if($("#gpsicon")[0].innerHTML != "gps_fixed")alert("gps定位失败");
}
