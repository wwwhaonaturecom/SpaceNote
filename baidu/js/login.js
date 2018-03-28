//*****和登录有关的函数******//
function login_show() {
	var loginWindow = document.getElementById("loginWindow");
	var blurOverlay = document.getElementById("blurOverlay");
	var userWindow = document.getElementById("userWindow");
	
	//如果已登陆，则显示用户欢迎界面
	if(sessionStorage["loginStatus"] == "true"){
		if(userWindow.style.visibility == 'hidden'){
			userWindow.style.visibility = 'visible';
			blurOverlay.style.visibility = 'visible';
		}
		else {
			userWindow.style.visibility = 'hidden';
			blurOverlay.style.visibility = 'hidden';
		}
	}
	else {
		if (loginWindow.style.visibility == 'hidden') {
			loginWindow.style.visibility = 'visible';
			blurOverlay.style.visibility = 'visible';
		}
		else {
			loginWindow.style.visibility = 'hidden';
			blurOverlay.style.visibility = 'hidden';
		}
	}
}

function login() {
	var Uname = document.getElementById("login-name").value;
	var Upass = document.getElementById("login-pass").value;
	var errMsg;
	var isError = true;

	//验证输入部分

	//服务端验证部分
	// $.ajax({
	// 	url: "../dataBase/login.php",
	// 	type: post,
	// 	data: {"Uname": Uname, "Upass": Upass},
	// 	success: function(result,status) {
	// 		if(result == true)
	// 			sessionStorage.setItem("loginStatus", true);
	// 		else {
	// 			sessionStorage.setItem("loginStatus", false);
	// 			errMsg = "用户名或密码错误";
	// 		}
	// 	},
	// 	error: function (XMLHttpRequest, textStatus, errorThrown){
    //         alert(textStatus);
    //     }
	// })

	sessionStorage.setItem("loginStatus", "true");
	sessionStorage.setItem("Uname", Uname);
	if (loginWindow.style.visibility == 'hidden') {
		loginWindow.style.visibility = 'visible';
		blurOverlay.style.visibility = 'visible';
	}
	else {
		loginWindow.style.visibility = 'hidden';
		blurOverlay.style.visibility = 'hidden';
	}
	//插入欢迎页面
	$("p.welcome").html("你好！"+Uname);
}

function logout() {
	var blurOverlay = document.getElementById("blurOverlay");
	var userWindow = document.getElementById("userWindow");

	sessionStorage.removeItem("loginStatus");
	sessionStorage.removeItem("Uname");

	sessionStorage.setItem("Uname", Uname);
	userWindow.style.visibility = 'hidden';
	blurOverlay.style.visibility = 'hidden';
	$("p.welcome").html("");	
}

