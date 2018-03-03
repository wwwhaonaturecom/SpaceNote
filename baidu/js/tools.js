//*****所有工具函数*****//
var position = null;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(updatePosition);
    } else {
        position = null;
    }
}

function updatePosition(pos) {
    position = pos;
    var h1 = document.getElementById("alert");
    if(h1 != null && pos != null)
        h1.innerHTML = pos.coords.longitude.toString() + " " + pos.coords.latitude.toString();
}

function setLocation(){
    if (navigator.geolocation && map != null) 
    {
        console.log("1");
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("2");
            var pos_google = 
            {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var pos = new BMap.Point(pos_google.lng,pos_google.lat);
            console.log(position.coords);
            console.log(pos);
            map.setCenter(pos);

        }, function() {
            console.log("3");
            if(!alerted){
                alert("请打开你的位置信息");
                alerted = 1;
            }
        });
    } 
    else if(map)
    {
        // Browser doesn't support Geolocation
        if(!alerted){
            alert("浏览器不支持位置信息，请使用chrome");
            alerted = 1;
        }

    }
    else
    {
        console.log("map is null");
    }
}

function hide_all(){
    var loginWindow = document.getElementById("loginWindow");
    var blurOverlay = document.getElementById("blurOverlay");
    var postWindow = document.getElementById("postWindow");
    var btns = document.getElementsByClassName("btn-block");
    loginWindow.style.visibility = 'hidden';
    blurOverlay.style.visibility = 'hidden';
    postWindow.style.visibility = 'hidden';
    btns.style.visibility = 'hidden';
}

