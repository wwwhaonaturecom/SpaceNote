//*****和登录有关的函数******//

function login_show() {
	var loginWindow = document.getElementById("loginWindow");
	var blurOverlay = document.getElementById("blurOverlay");
	if(loginWindow.style.visibility == 'hidden'){
		loginWindow.style.visibility = 'visible';
		blurOverlay.style.visibility = 'visible';
	}
	else{
		loginWindow.style.visibility = 'hidden';
		blurOverlay.style.visibility = 'hidden';
	}
}