//*****所有工具函数*****//


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
    var userWindow = document.getElementById("userWindow");
    
    loginWindow.style.visibility = 'hidden';
    blurOverlay.style.visibility = 'hidden';
    postWindow.style.visibility = 'hidden';
    userWindow.style.visibility = 'hidden';
    $("#dialogWindow")[0].style.visibility = 'hidden';
    
}

function headimgNotFound(){
    this.src="img/default.jpg";
    this.onerror=null;
}