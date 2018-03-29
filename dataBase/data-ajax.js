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
    var UID, Uname, Note, Lng, Lat, Alt
    
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
