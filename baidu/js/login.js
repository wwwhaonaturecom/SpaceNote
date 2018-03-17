//*****和登录有关的函数******//
function login_show() {
	var loginWindow = document.getElementById("loginWindow");
	var blurOverlay = document.getElementById("blurOverlay");
	if(sessionStorage["loginStatus"] == true){
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
	// 			sessionStorage["loginStatus"] = true;
	// 		else {
	// 			sessionStorage["loginStatus"] = false;
	// 			errMsg = "用户名或密码错误";
	// 		}
	// 	},
	// 	error: function (XMLHttpRequest, textStatus, errorThrown){
    //         alert(textStatus);
    //     }
	// })

	sessionStorage["loginStatus"] = true;
	sessionStorage["Uname"] = Uname;
	//插入欢迎页面
	$("p.welcome").html("你好！"+Uname);
}

