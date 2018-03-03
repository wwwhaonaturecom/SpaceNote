//****这里有所有和聊天窗口有关的函数*****//
function post_show () {
	var postWindow = document.getElementById("postWindow");
	var blurOverlay = document.getElementById("blurOverlay");
	if(postWindow.style.visibility == 'hidden'){
		postWindow.style.visibility = 'visible';
		blurOverlay.style.visibility = 'visible';
	}
	else{
		postWindow.style.visibility = 'hidden';
		blurOverlay.style.visibility = 'hidden';
	}
}
